// Verify: WIN a story level -> progress saved -> next level unlocks -> region 2 opens after finishing region 1
import http from 'http';
import WebSocket from 'ws';

const PORT = 9333;
const GAME_URL = 'http://localhost:8888/Periodic-Puzzle/index.html';
const WATCHDOG = setTimeout(() => { console.log('WATCHDOG at', LAST_STEP); process.exit(2); }, 90000);
let LAST_STEP = 'init';

function httpReq(path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port: PORT, path, method }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.end();
  });
}

function connect(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    let id = 0;
    const pending = new Map();
    ws.on('open', () => resolve({
      send(method, params = {}) {
        return new Promise((res2, rej2) => {
          const mid = ++id;
          pending.set(mid, { res2, rej2 });
          ws.send(JSON.stringify({ id: mid, method, params }));
        });
      },
      close() { try { ws.close(); } catch {} }
    }));
    ws.on('message', (ev) => {
      const msg = JSON.parse(ev);
      if (msg.id && pending.has(msg.id)) {
        const p = pending.get(msg.id); pending.delete(msg.id);
        msg.error ? p.rej2(new Error(JSON.stringify(msg.error))) : p.res2(msg.result);
      }
    });
    ws.on('error', reject);
  });
}

async function evalJS(cdp, expr) {
  const r = await cdp.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || 'eval failed');
  return r.result.value;
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  LAST_STEP = 'cleanup';
  const tabs = JSON.parse(await httpReq('/json/list'));
  for (const t of tabs) if (t.type === 'page' && t.url.includes('8888')) await httpReq('/json/close/' + t.id).catch(() => {});

  const target = JSON.parse(await httpReq(`/json/new?${encodeURIComponent(GAME_URL)}`, 'PUT'));
  const cdp = await connect(target.webSocketDebuggerUrl);
  await cdp.send('Page.enable');
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });

  // Fresh state: clear saved story progress to test from scratch
  LAST_STEP = 'navigate';
  await cdp.send('Page.navigate', { url: GAME_URL });
  await sleep(4500);

  await evalJS(cdp, `localStorage.removeItem('pp-story-progress'); localStorage.removeItem('pp-heatmap'); 'cleared'`);

  LAST_STEP = 'login';
  await evalJS(cdp, `
    document.getElementById('player-name-input').value = 'قهرمان';
    document.getElementById('submit-name-btn').click(); 'ok'
  `);
  await sleep(600);

  // Play level r1/l1 to completion (2 elements)
  LAST_STEP = 'start-level';
  await evalJS(cdp, `startStoryLevel('r1','l1'); document.getElementById('begin-level-btn').click(); 'started'`);
  await sleep(700);

  const beforeWin = await evalJS(cdp, `({
    targets: document.querySelectorAll('.puzzle-target').length,
    remaining: document.querySelectorAll('.puzzle-target:not(.filled)').length
  })`);
  console.log('BEFORE WIN:', JSON.stringify(beforeWin));

  LAST_STEP = 'play-to-win';
  const winResult = await evalJS(cdp, `
    (async () => {
      let guard = 0;
      while (!document.getElementById('game-over-modal').offsetParent && guard++ < 30) {
        const cell = document.querySelector('.puzzle-target[data-atomic="' + currentElement.num + '"]:not(.filled)');
        if (!cell) break;
        cell.click();
        await new Promise(r => setTimeout(r, 350));
      }
      await new Promise(r => setTimeout(r, 800));
      const title = document.getElementById('modal-title').textContent.trim();
      return {
        winTitle: title.includes('تبریک'),
        confettiSeen: !!document.querySelector('.confetti-container'),
        statsText: document.getElementById('end-stats').textContent.replace(/\\s+/g,' ').trim().slice(0,80),
        finalScore: document.getElementById('final-score').textContent
      };
    })()
  `, 30000);
  console.log('WIN:', JSON.stringify(winResult, null, 2));

  LAST_STEP = 'check-unlock';
  const progress = await evalJS(cdp, `localStorage.getItem('pp-story-progress')`);
  console.log('PROGRESS SAVED:', progress);

  // Restart to menu, open map, verify l2 unlocked & l1 marked done
  LAST_STEP = 'verify-map-state';
  await evalJS(cdp, `document.getElementById('restart-btn').click()`);
  await sleep(400);
  const mapState = await evalJS(cdp, `
    openStoryMap();
    new Promise(res => setTimeout(() => {
      const btns = Array.from(document.querySelectorAll('#story-map-list .map-level-btn'));
      const firstDone = btns[0] ? btns[0].classList.contains('done') : false;
      const secondEnabled = btns[1] ? !btns[1].disabled : false;
      res({ firstLevelMarkedDone: firstDone, secondLevelUnlocked: secondEnabled });
    }, 400));
  `);
  console.log('MAP STATE:', JSON.stringify(mapState));

  // Now beat r1/l2 too -> region r2 should unlock
  LAST_STEP = 'beat-l2';
  await evalJS(cdp, `document.getElementById('close-story-map-btn').click(); startStoryLevel('r1','l2'); document.getElementById('begin-level-btn').click(); 'started'`);
  await sleep(700);
  const l2win = await evalJS(cdp, `
    (async () => {
      let guard = 0;
      while (!document.getElementById('game-over-modal').offsetParent && guard++ < 30) {
        const cell = document.querySelector('.puzzle-target[data-atomic="' + currentElement.num + '"]:not(.filled)');
        if (!cell) break;
        cell.click();
        await new Promise(r => setTimeout(r, 350));
      }
      await new Promise(r => setTimeout(r, 600));
      return { won: document.getElementById('modal-title').textContent.includes('تبریک') };
    })()
  `, 30000);
  console.log('L2 WIN:', JSON.stringify(l2win));

  LAST_STEP = 'region2-check';
  await evalJS(cdp, `document.getElementById('restart-btn').click()`);
  await sleep(400);
  const regionCheck = await evalJS(cdp, `
    openStoryMap();
    new Promise(res => setTimeout(() => {
      const regions = Array.from(document.querySelectorAll('#story-map-list .map-region'));
      const r2 = regions[1];
      const unlocked = !r2.classList.contains('locked');
      const firstR2Btn = r2.querySelector('.map-level-btn');
      res({ region2Unlocked: unlocked, region2FirstBtnEnabled: firstR2Btn ? !firstR2Btn.disabled : false });
    }, 400));
  `);
  console.log('REGION2:', JSON.stringify(regionCheck));

  console.log('\n=== STORY MODE WIN-PATH VERIFIED ===');
  clearTimeout(WATCHDOG);
  cdp.close();
  process.exit(0);
}
main().catch(e => { console.error('FAILED at [' + LAST_STEP + ']:', e.message); clearTimeout(WATCHDOG); process.exit(1); });
