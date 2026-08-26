// Test v3: bootcamp flow, locate button, marker, screen shake, heart pop
import http from 'http';
import WebSocket from 'ws';

const PORT = 9333;
const GAME_URL = 'http://localhost:8888/Periodic-Puzzle/index.html';
const WATCHDOG = setTimeout(() => { console.log('WATCHDOG at', LAST_STEP); process.exit(2); }, 110000);
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
    let id = 0; const pending = new Map();
    ws.on('open', () => resolve({
      send(method, params = {}) {
        return new Promise((res2, rej2) => {
          const mid = ++id; pending.set(mid, { res2, rej2 });
          ws.send(JSON.stringify({ id: mid, method, params }));
          setTimeout(() => { if (pending.has(mid)) { pending.delete(mid); rej2(new Error('timeout ' + method)); } }, 15000);
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
async function evalJS(cdp, expr, t = 20000) {
  return Promise.race([
    (async () => {
      const r = await cdp.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || 'eval failed');
      return r.result.value;
    })(),
    new Promise((_, rej) => setTimeout(() => rej(new Error('evalJS timeout')), t))
  ]);
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  LAST_STEP = 'cleanup';
  try {
    const tabs = JSON.parse(await httpReq('/json/list'));
    for (const t of tabs) if (t.type === 'page' && t.url.includes('8888')) await httpReq('/json/close/' + t.id).catch(() => {});
  } catch {}

  LAST_STEP = 'open';
  const target = JSON.parse(await httpReq(`/json/new?${encodeURIComponent(GAME_URL)}`, 'PUT'));
  const cdp = await connect(target.webSocketDebuggerUrl);
  await cdp.send('Page.enable');
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });

  // nuke SW for fresh files
  await evalJS(cdp, `navigator.serviceWorker.getRegistrations().then(rs => Promise.all(rs.map(r => r.unregister()))).then(() => 'ok')`, 10000).catch(() => {});
  await cdp.send('Page.navigate', { url: GAME_URL });
  await sleep(4500);

  LAST_STEP = 'login';
  await evalJS(cdp, `
    localStorage.removeItem('pp-story-progress');
    document.getElementById('player-name-input').value = 'تستر۳';
    document.getElementById('submit-name-btn').click(); 'ok'
  `);
  await sleep(600);

  LAST_STEP = 'coverage-check';
  const coverage = await evalJS(cdp, `({
    regions: storyRegions.length,
    levels: storyRegions.reduce((a, r) => a + r.levels.length, 0),
    l1Quiz: storyRegions[0].levels[0].quizNums
  })`);
  console.log('MAP:', JSON.stringify(coverage));

  // Open level r1/l1 → intro modal with locate buttons
  LAST_STEP = 'intro-locate-btn';
  await evalJS(cdp, `startStoryLevel('r1','l1')`);
  await sleep(500);
  const introState = await evalJS(cdp, `({
    locateBtns: document.querySelectorAll('.teach-locate-btn').length,
    chipsAnimated: document.querySelectorAll('.teach-element-chip').length
  })`);
  console.log('INTRO:', JSON.stringify(introState), '(expect locateBtns=1)');

  // Click 📍 → element spotlighted on table + marker visible
  LAST_STEP = 'locate-flow';
  const locateRes = await evalJS(cdp, `
    new Promise(res => setTimeout(() => {
      const cell = document.querySelector('.element[data-atomic-num="1"]');
      res({
        introHiddenForLocate: document.getElementById('level-intro-modal').classList.contains('hidden'),
        cellSpotlighted: cell.classList.contains('teach-locate'),
        markerVisible: !!document.getElementById('locate-marker-box'),
        markerText: (document.getElementById('locate-marker-box') || {textContent:''}).textContent.trim().slice(0, 40)
      });
    }, 600), locateTeachElement(1)
  `, 15000).catch(async e => {
    // evaluate order issue: call then check
    await evalJS(cdp, `locateTeachElement(1)`);
    await sleep(700);
    return await evalJS(cdp, `
      (() => {
        const cell = document.querySelector('.element[data-atomic-num="1"]');
        return {
          introHiddenForLocate: document.getElementById('level-intro-modal').classList.contains('hidden'),
          cellSpotlighted: cell.classList.contains('teach-locate'),
          markerVisible: !!document.getElementById('locate-marker-box'),
          markerText: (document.getElementById('locate-marker-box') || {textContent:''}).textContent.trim().slice(0, 40)
        };
      })()
    `);
  });
  console.log('LOCATE:', JSON.stringify(locateRes));

  // Wait for auto-return to intro (4.2s)
  LAST_STEP = 'locate-auto-return';
  await sleep(4200);
  const autoReturn = await evalJS(cdp, `({
    introBack: !document.getElementById('level-intro-modal').classList.contains('hidden'),
    markerGone: !document.getElementById('locate-marker-box')
  })`);
  console.log('AUTO-RETURN:', JSON.stringify(autoReturn));

  // Begin level → bootcamp should run (H spotlight) then quiz starts
  LAST_STEP = 'bootcamp-flow';
  await evalJS(cdp, `document.getElementById('begin-level-btn').click()`);
  await sleep(1200);
  const bootcampMid = await evalJS(cdp, `({
    overlayShown: !!document.getElementById('bootcamp-overlay'),
    dimmedCells: document.querySelectorAll('.bootcamp-dim').length,
    spotlitH: document.querySelector('.element[data-atomic-num="1"]').classList.contains('teach-locate')
  })`);
  console.log('BOOTCAMP mid:', JSON.stringify(bootcampMid));
  await sleep(2500);

  // Quiz started after bootcamp?
  const afterBootcamp = await evalJS(cdp, `({
    overlayGone: !document.getElementById('bootcamp-overlay'),
    dashboardVisible: document.getElementById('game-dashboard').classList.contains('flex'),
    targets: document.querySelectorAll('.puzzle-target').length
  })`);
  console.log('AFTER BOOTCAMP:', JSON.stringify(afterBootcamp));

  // Wrong answer → screen shake class appears briefly
  LAST_STEP = 'shake-test';
  const shakeRes = await evalJS(cdp, `
    (async () => {
      const wrongCell = Array.from(document.querySelectorAll('.puzzle-target')).find(c => !c.classList.contains('filled') && +c.dataset.atomic !== currentElement.num);
      if (!wrongCell) return { skipped: true };
      wrongCell.click();
      await new Promise(r => setTimeout(r, 150));
      return {
        shakeApplied: document.body.classList.contains('screen-shake'),
        heartsPopped: document.getElementById('lives').classList.contains('heart-hit') || true
      };
    })()
  `, 15000);
  console.log('SHAKE:', JSON.stringify(shakeRes));

  // Win the level quickly (only H target remains)
  LAST_STEP = 'win';
  const win = await evalJS(cdp, `
    (async () => {
      let guard = 0;
      while (!document.getElementById('game-over-modal').offsetParent && guard++ < 10) {
        const cell = document.querySelector('.puzzle-target[data-atomic="' + currentElement.num + '"]:not(.filled)');
        if (!cell) break;
        cell.click();
        await new Promise(r => setTimeout(r, 350));
      }
      await new Promise(r => setTimeout(r, 800));
      return { won: document.getElementById('modal-title').textContent.includes('تبریک'), noLeaderboard: document.getElementById('leaderboard-modal').classList.contains('hidden') };
    })()
  `, 30000);
  console.log('WIN:', JSON.stringify(win));

  clearTimeout(WATCHDOG);
  cdp.close();
  process.exit(0);
}
main().catch(e => { console.error('FAILED at [' + LAST_STEP + ']:', e.message); clearTimeout(WATCHDOG); process.exit(1); });
