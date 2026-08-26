// Verify all 4 fixes — with SW bypass: unregister + hard reload before assertions
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
  await cdp.send('Runtime.enable');
  await cdp.send('Network.enable');

  LAST_STEP = 'nuke-sw-and-caches';
  await evalJS(cdp, `
    (async () => {
      if ('serviceWorker' in navigator) {
        const rs = await navigator.serviceWorker.getRegistrations();
        for (const r of rs) await r.unregister();
      }
      if (window.caches && caches.keys) {
        const keys = await caches.keys();
        for (const k of keys) await caches.delete(k);
      }
      return 'nuked';
    })()
  `, 15000);

  // Fresh load with cache disabled
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Page.navigate', { url: GAME_URL });
  await sleep(5000);

  LAST_STEP = 'sanity-check-fresh-files';
  const sanity = await evalJS(cdp, `({
    elementModalZ: getComputedStyle(document.getElementById('element-modal')).zIndex,
    l1QuizLen: storyRegions[0].levels[0].quizNums.length,
    swActive: !!navigator.serviceWorker.controller
  })`);
  console.log('SANITY:', JSON.stringify(sanity));

  LAST_STEP = 'login';
  await evalJS(cdp, `
    localStorage.removeItem('pp-story-progress');
    document.getElementById('player-name-input').value = 'تستر';
    document.getElementById('submit-name-btn').click(); 'ok'
  `);
  await sleep(600);

  // ===== FIX 1: chip click → element modal ON TOP =====
  LAST_STEP = 'fix1-chip-modal';
  await evalJS(cdp, `startStoryLevel('r1','l1')`);
  await sleep(500);
  const chipModalTest = await evalJS(cdp, `
    new Promise(resolve => {
      const chip = document.querySelector('.teach-element-chip');
      const r = chip.getBoundingClientRect();
      const cx = r.left + r.width/2, cy = r.top + r.height/2;
      ['pointerdown','mousedown','pointerup','mouseup','click'].forEach(type => {
        const topEl = document.elementFromPoint(cx, cy);
        topEl.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, clientX: cx, clientY: cy, view: window }));
      });
      setTimeout(() => {
        const em = document.getElementById('element-modal');
        const lim = document.getElementById('level-intro-modal');
        const emZ = parseInt(getComputedStyle(em).zIndex) || 0;
        const limZ = parseInt(getComputedStyle(lim).zIndex) || 0;
        resolve({
          elementModalVisible: !em.classList.contains('hidden'),
          elementOnTopOfIntro: emZ > limZ,
          zIndexes: { element: emZ, intro: limZ },
          infoNameShown: document.getElementById('info-name').textContent
        });
      }, 700);
    })
  `, 15000);
  console.log('FIX1 chip→modal:', JSON.stringify(chipModalTest));

  // close element modal; intro should remain
  const introStillOpen = await evalJS(cdp, `
    document.getElementById('element-modal').classList.add('hidden');
    !document.getElementById('level-intro-modal').classList.contains('hidden')
  `);
  console.log('INTRO STILL OPEN after closing card:', introStillOpen);

  // ===== FIX 2: L1 scope = exactly [1] =====
  LAST_STEP = 'fix2-quiz-scope';
  const scopeL1 = await evalJS(cdp, `
    document.getElementById('begin-level-btn').click();
    new Promise(res => setTimeout(() => res(Array.from(document.querySelectorAll('.puzzle-target')).map(c => +c.dataset.atomic).sort((a,b)=>a-b)), 600));
  `, 15000);
  console.log('FIX2 L1 targets:', JSON.stringify(scopeL1), '(expect [1])');
  console.log('FIX2 PASS:', JSON.stringify(scopeL1) === '[1]');

  // ===== FIX 3: hearts/score sync =====
  LAST_STEP = 'fix3-hearts-sync';
  const syncTest = await evalJS(cdp, `
    (async () => {
      const readDom = () => ({
        domScore: +document.getElementById('score').textContent,
        domLives: (document.getElementById('lives').textContent.match(/❤️/g) || []).length,
        jsLives: lives
      });
      const out = { initial: readDom() };
      let cell = document.querySelector('.puzzle-target[data-atomic="' + currentElement.num + '"]');
      cell.click(); await new Promise(r => setTimeout(r, 400));
      out.afterCorrect = readDom();

      let wrongCell = Array.from(document.querySelectorAll('.puzzle-target')).find(c => !c.classList.contains('filled'));
      if (wrongCell) { wrongCell.click(); await new Promise(r => setTimeout(r, 300)); out.afterWrong1 = readDom(); }

      wrongCell = Array.from(document.querySelectorAll('.puzzle-target')).find(c => !c.classList.contains('filled') && +c.dataset.atomic !== currentElement.num);
      if (wrongCell) { wrongCell.click(); await new Promise(r => setTimeout(r, 300)); out.afterWrong2 = readDom(); }
      return out;
    })()
  `, 25000);
  console.log('FIX3 sync:', JSON.stringify(syncTest));

  // Win level (only H left)
  LAST_STEP = 'win-l1';
  const winRes = await evalJS(cdp, `
    (async () => {
      let guard = 0;
      while (!document.getElementById('game-over-modal').offsetParent && guard++ < 15) {
        const cell = document.querySelector('.puzzle-target[data-atomic="' + currentElement.num + '"]:not(.filled)');
        if (!cell) break;
        cell.click();
        await new Promise(r => setTimeout(r, 350));
      }
      await new Promise(r => setTimeout(r, 1600));
      return {
        won: document.getElementById('modal-title').textContent.includes('تبریک'),
        leaderboardOpened: !document.getElementById('leaderboard-modal').classList.contains('hidden')
      };
    })()
  `, 30000);
  const lbState = await evalJS(cdp, `localStorage.getItem('local_leaderboard') || ''`);
  console.log('STORY WIN:', JSON.stringify(winRes), '| local_leaderboard len:', lbState.length);

  // Classic mode still submits to leaderboard
  LAST_STEP = 'classic-mode';
  await evalJS(cdp, `document.getElementById('restart-btn').click()`);
  await sleep(400);
  const classicRes = await evalJS(cdp, `
    (async () => {
      document.getElementById('start-btn').click();
      await new Promise(r => setTimeout(r, 700));
      window.confirm = () => true;
      document.getElementById('quit-game-btn').click();
      await new Promise(r => setTimeout(r, 2500));
      return {
        ended: !document.getElementById('game-over-modal').classList.contains('hidden'),
        leaderboardOpened: !document.getElementById('leaderboard-modal').classList.contains('hidden')
      };
    })()
  `, 40000);
  console.log('CLASSIC:', JSON.stringify(classicRes));

  clearTimeout(WATCHDOG);
  cdp.close();
  process.exit(0);
}
main().catch(e => { console.error('FAILED at [' + LAST_STEP + ']:', e.message); clearTimeout(WATCHDOG); process.exit(1); });
