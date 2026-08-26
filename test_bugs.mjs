// Diagnose: z-order of teach chips click, score/lives updates, story quiz scoping
import http from 'http';
import WebSocket from 'ws';

const PORT = 9333;
const GAME_URL = 'http://localhost:8888/Periodic-Puzzle/index.html';
const WATCHDOG = setTimeout(() => { console.log('WATCHDOG at', LAST_STEP); process.exit(2); }, 80000);
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
  const tabs = JSON.parse(await httpReq('/json/list'));
  for (const t of tabs) if (t.type === 'page' && t.url.includes('8888')) await httpReq('/json/close/' + t.id).catch(() => {});

  LAST_STEP = 'open';
  const target = JSON.parse(await httpReq(`/json/new?${encodeURIComponent(GAME_URL)}`, 'PUT'));
  const cdp = await connect(target.webSocketDebuggerUrl);
  await cdp.send('Page.enable');
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Page.navigate', { url: GAME_URL });
  await sleep(4500);

  // login + clear progress
  await evalJS(cdp, `
    localStorage.removeItem('pp-story-progress');
    document.getElementById('player-name-input').value = 'دیباگر';
    document.getElementById('submit-name-btn').click(); 'ok'
  `);
  await sleep(600);

  // === ISSUE 1: teach chip click opens element modal? ===
  LAST_STEP = 'chip-click-test';
  await evalJS(cdp, `startStoryLevel('r1','l1')`);
  await sleep(500);

  // What's on top at the chip's position?
  const chipTest = await evalJS(cdp, `
    (() => {
      const chip = document.querySelector('.teach-element-chip');
      if (!chip) return { chipFound: false };
      chip.scrollIntoView({ block: 'center' });
      const r = chip.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const topEl = document.elementFromPoint(cx, cy);
      const chain = [];
      let n = topEl;
      while (n && chain.length < 6) { chain.push(n.id || n.className.toString().slice(0, 40) || n.tagName); n = n.parentElement; }
      return {
        chipFound: true,
        chipRect: { x: Math.round(cx), y: Math.round(cy) },
        topElementIsChipOrChild: chip.contains(topEl),
        topChain: chain
      };
    })()
  `);
  console.log('CHIP TEST:', JSON.stringify(chipTest, null, 2));

  // Simulate a real user click via CDP Input domain
  const realClickResult = await evalJS(cdp, `
    new Promise(resolve => {
      const chip = document.querySelector('.teach-element-chip');
      const r = chip.getBoundingClientRect();
      const cx = r.left + r.width/2, cy = r.top + r.height/2;

      // Track what happens
      window.__modalOpened = false;
      const observer = new MutationObserver(() => {
        if (!document.getElementById('element-modal').classList.contains('hidden')) window.__modalOpened = true;
      });
      observer.observe(document.getElementById('element-modal'), { attributes: true });

      // Dispatch a full realistic click sequence on the TOP element at that point
      const topEl = document.elementFromPoint(cx, cy);
      ['pointerdown','mousedown','pointerup','mouseup','click'].forEach(type => {
        topEl.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, clientX: cx, clientY: cy, view: window }));
      });
      setTimeout(() => resolve({ modalOpened: window.__modalOpened }), 700);
    })
  `, 15000);
  console.log('REAL-CLICK ON CHIP:', JSON.stringify(realClickResult));

  // Close whatever opened
  await evalJS(cdp, `document.getElementById('element-modal').classList.add('hidden'); document.getElementById('level-intro-modal').classList.add('hidden'); 'reset'`);

  // === ISSUE 4: score & lives update correctly? ===
  LAST_STEP = 'score-lives-test';
  await evalJS(cdp, `
    document.getElementById('begin-level-btn').click(); 'quiz-started'
  `);
  await sleep(700);

  const scoreLives = await evalJS(cdp, `
    (async () => {
      const out = {};
      const readDom = () => ({
        domScore: document.getElementById('score').textContent,
        domLives: (document.getElementById('lives').textContent.match(/❤️/g) || []).length,
        jsScore: score,
        jsLives: lives
      });

      out.initial = readDom();

      // correct answer
      let cell = document.querySelector('.puzzle-target[data-atomic="' + currentElement.num + '"]');
      cell.click();
      await new Promise(r => setTimeout(r, 400));
      out.afterCorrect = readDom();

      // wrong answer
      const wrongCell = Array.from(document.querySelectorAll('.puzzle-target')).find(c => !c.classList.contains('filled'));
      if (wrongCell) {
        wrongCell.click();
        await new Promise(r => setTimeout(r, 300));
        out.afterWrong = readDom();
      }

      // hint
      const sBefore = score;
      useHint();
      await new Promise(r => setTimeout(r, 200));
      out.afterHint = readDom();

      // another correct
      cell = document.querySelector('.puzzle-target[data-atomic="' + currentElement.num + '"]');
      if (cell) {
        cell.click();
        await new Promise(r => setTimeout(r, 400));
        out.afterSecondCorrect = readDom();
      }
      return out;
    })()
  `, 25000);
  console.log('SCORE/LIVES FLOW:', JSON.stringify(scoreLives, null, 2));

  clearTimeout(WATCHDOG);
  cdp.close();
  process.exit(0);
}
main().catch(e => { console.error('FAILED at [' + LAST_STEP + ']:', e.message); clearTimeout(WATCHDOG); process.exit(1); });
