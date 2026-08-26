// Screenshot: bootcamp spotlight + locate marker
import http from 'http';
import WebSocket from 'ws';
import fs from 'fs';

const PORT = 9333;
const GAME_URL = 'http://localhost:8888/Periodic-Puzzle/index.html';
const OUT = 'D:/Hermes file/Periodic-Puzzle/shots';
fs.mkdirSync(OUT, { recursive: true });

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
async function shot(cdp, name) {
  const r = await cdp.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${OUT}/${name}.png`, Buffer.from(r.data, 'base64'));
  console.log('SHOT:', name);
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  try {
    const tabs = JSON.parse(await httpReq('/json/list'));
    for (const t of tabs) if (t.type === 'page' && t.url.includes('8888')) await httpReq('/json/close/' + t.id).catch(() => {});
  } catch {}

  const target = JSON.parse(await httpReq(`/json/new?${encodeURIComponent(GAME_URL)}`, 'PUT'));
  const cdp = await connect(target.webSocketDebuggerUrl);
  await cdp.send('Page.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
  await evalJS(cdp, `navigator.serviceWorker.getRegistrations().then(rs => Promise.all(rs.map(r => r.unregister()))).then(() => 'ok')`, 10000).catch(() => {});
  await sleep(4000);

  await evalJS(cdp, `
    document.getElementById('player-name-input').value = 'آرمین';
    document.getElementById('submit-name-btn').click(); 'ok'
  `);
  await sleep(700);

  // Locate view for Helium
  await evalJS(cdp, `startStoryLevel('r1','l1')`);
  await sleep(500);
  await evalJS(cdp, `locateTeachElement(2)`);
  await sleep(1000);
  await shot(cdp, '6-locate-helium');

  // close locate & start bootcamp of level l2 (H + He)
  await evalJS(cdp, `localStorage.setItem('pp-story-progress', JSON.stringify({'r1/l1':15})); closeLocateView()`);
  await sleep(300);
  await evalJS(cdp, `startStoryLevel('r1','l2')`);
  await sleep(400);
  await evalJS(cdp, `document.getElementById('begin-level-btn').click()`);
  await sleep(2200); // mid-bootcamp: He lit, H still glowing
  await shot(cdp, '7-bootcamp-spotlight');

  // gameplay
  await sleep(2500);
  await shot(cdp, '8-gameplay-l2');

  cdp.close();
  process.exit(0);
}
main().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
