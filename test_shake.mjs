// Test shake on wrong answer in level r1/l2 (2 targets so wrong is possible)
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

  const target = JSON.parse(await httpReq(`/json/new?${encodeURIComponent(GAME_URL)}`, 'PUT'));
  const cdp = await connect(target.webSocketDebuggerUrl);
  await cdp.send('Page.enable');
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await evalJS(cdp, `navigator.serviceWorker.getRegistrations().then(rs => Promise.all(rs.map(r => r.unregister()))).then(() => 'ok')`, 10000).catch(() => {});
  await cdp.send('Page.navigate', { url: GAME_URL });
  await sleep(4500);

  LAST_STEP = 'login-and-progress';
  await evalJS(cdp, `
    localStorage.removeItem('pp-story-progress');
    document.getElementById('player-name-input').value = 'تستر۴';
    document.getElementById('submit-name-btn').click(); 'ok'
  `);
  await sleep(600);

  // Pre-unlock l2 by faking l1 completion
  LAST_STEP = 'unlock-l2';
  await evalJS(cdp, `localStorage.setItem('pp-story-progress', JSON.stringify({'r1/l1':15})); 'ok'`);

  LAST_STEP = 'start-l2';
  await evalJS(cdp, `startStoryLevel('r1','l2')`);
  await sleep(500);
  await evalJS(cdp, `document.getElementById('begin-level-btn').click()`);
  // bootcamp: H then He (~0.35+0.9+0.9+0.7 ≈ 3s)
  await sleep(3600);

  LAST_STEP = 'wrong-answer-shake';
  const shakeRes = await evalJS(cdp, `
    (async () => {
      const targets = document.querySelectorAll('.puzzle-target');
      if (targets.length !== 2) return { unexpectedTargets: targets.length };
      const wrongCell = Array.from(targets).find(c => +c.dataset.atomic !== currentElement.num);
      wrongCell.click();
      await new Promise(r => setTimeout(r, 120));
      const shakeNow = document.body.classList.contains('screen-shake');
      const heartPopNow = document.getElementById('lives').classList.contains('heart-hit');
      return { shakeApplied: shakeNow, heartPopApplied: heartPopNow, jsLives: lives };
    })()
  `, 15000);
  console.log('SHAKE+HEARTS:', JSON.stringify(shakeRes));

  clearTimeout(WATCHDOG);
  cdp.close();
  process.exit(0);
}
main().catch(e => { console.error('FAILED at [' + LAST_STEP + ']:', e.message); clearTimeout(WATCHDOG); process.exit(1); });
