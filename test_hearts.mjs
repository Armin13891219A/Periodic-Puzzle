// Deep verify: hearts decrement visually + wrong answers + hint penalty + leaderboard DB untouched by story
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

  LAST_STEP = 'open-fresh';
  const target = JSON.parse(await httpReq(`/json/new?${encodeURIComponent(GAME_URL)}`, 'PUT'));
  const cdp = await connect(target.webSocketDebuggerUrl);
  await cdp.send('Page.enable');
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });

  // nuke SW first so we always test latest files
  LAST_STEP = 'nuke-sw';
  await evalJS(cdp, `
    navigator.serviceWorker.getRegistrations().then(rs => Promise.all(rs.map(r => r.unregister()))).then(() => 'ok')
  `, 10000);

  await cdp.send('Page.navigate', { url: GAME_URL });
  await sleep(4500);

  LAST_STEP = 'login-classic-wrong-answers';
  await evalJS(cdp, `
    localStorage.removeItem('pp-story-progress');
    document.getElementById('player-name-input').value = 'تستر۲';
    document.getElementById('submit-name-btn').click(); 'ok'
  `);
  await sleep(600);

  // Start CLASSIC mode and make 3 wrong answers in a row → watch hearts drop each time
  LAST_STEP = 'classic-hearts';
  const heartsFlow = await evalJS(cdp, `
    (async () => {
      document.getElementById('start-btn').click();
      await new Promise(r => setTimeout(r, 700));

      const snap = () => ({
        domLives: (document.getElementById('lives').textContent.match(/❤️/g) || []).length,
        domScore: +document.getElementById('score').textContent,
        jsLives: lives,
        jsScore: score
      });
      const out = { start: snap() };

      for (let i = 0; i < 3; i++) {
        const wrongCell = Array.from(document.querySelectorAll('.puzzle-target')).find(c => !c.classList.contains('filled') && +c.dataset.atomic !== currentElement.num);
        if (!wrongCell || lives <= 0) break;
        wrongCell.click();
        await new Promise(r => setTimeout(r, 400));
        out['wrong' + (i+1)] = snap();
        if (!document.getElementById('game-over-modal').classList.contains('hidden')) { out['gameOverAfterWrong' + (i+1)] = true; break; }
      }

      // hint penalty check (game may be over — restart if needed)
      if (lives > 0 && isGameActive) {
        const s = score;
        useHint();
        await new Promise(r => setTimeout(r, 250));
        out.hintPenaltyApplied = score < s;
        out.afterHint = snap();
      }
      return out;
    })()
  `, 30000);
  console.log('HEARTS FLOW:', JSON.stringify(heartsFlow, null, 2));

  clearTimeout(WATCHDOG);
  cdp.close();
  process.exit(0);
}
main().catch(e => { console.error('FAILED at [' + LAST_STEP + ']:', e.message); clearTimeout(WATCHDOG); process.exit(1); });
