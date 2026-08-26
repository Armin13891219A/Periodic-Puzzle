// Robust E2E test with watchdog + step logging
import http from 'http';
import WebSocket from 'ws';

const PORT = 9333;
const GAME_URL = 'http://localhost:8888/Periodic-Puzzle/index.html';

// Hard watchdog: never hang silently
const WATCHDOG = setTimeout(() => {
  console.log('WATCHDOG FIRED — last step:', LAST_STEP);
  process.exit(2);
}, 100000);

let LAST_STEP = 'init';
const step = s => { LAST_STEP = s; console.log('STEP:', s); };

function httpReq(path, method = 'GET', timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port: PORT, path, method }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.setTimeout(timeoutMs, () => { req.destroy(); reject(new Error('http timeout ' + path)); });
    req.end();
  });
}

function connect(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    let id = 0;
    const pending = new Map();
    const timer = setTimeout(() => reject(new Error('ws connect timeout')), 10000);
    ws.on('open', () => {
      clearTimeout(timer);
      resolve({
        send(method, params = {}) {
          return new Promise((res2, rej2) => {
            const mid = ++id;
            pending.set(mid, { res2, rej2 });
            ws.send(JSON.stringify({ id: mid, method, params }));
            setTimeout(() => {
              if (pending.has(mid)) { pending.delete(mid); rej2(new Error('cdp send timeout: ' + method)); }
            }, 15000);
          });
        },
        close() { try { ws.close(); } catch {} }
      });
    });
    ws.on('message', (ev) => {
      const msg = JSON.parse(ev);
      if (msg.id && pending.has(msg.id)) {
        const { res2, rej2 } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) rej2(new Error(JSON.stringify(msg.error)));
        else res2(msg.result);
      }
    });
    ws.on('error', (e) => { clearTimeout(timer); reject(e); });
  });
}

async function evalJS(cdp, expr, timeoutMs = 20000) {
  return Promise.race([
    (async () => {
      const r = await cdp.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || 'eval failed');
      return r.result.value;
    })(),
    new Promise((_, rej) => setTimeout(() => rej(new Error('evalJS timeout')), timeoutMs))
  ]);
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
const errors = [];

async function main() {
  step('cleanup-tabs');
  try {
    const tabs = JSON.parse(await httpReq('/json/list'));
    for (const t of tabs) {
      if (t.type === 'page' && t.url.includes('localhost:8888')) await httpReq('/json/close/' + t.id).catch(() => {});
    }
  } catch (e) { console.log('cleanup warn:', e.message); }

  step('open-tab');
  const target = JSON.parse(await httpReq(`/json/new?${encodeURIComponent(GAME_URL)}`, 'PUT'));

  step('connect-ws');
  const cdp = await connect(target.webSocketDebuggerUrl);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Network.enable');

  step('navigate-nocache');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Page.navigate', { url: GAME_URL });
  await sleep(5000);

  step('check-bootstrap');
  const boot = await evalJS(cdp, `({
    hasElementData: typeof elementData !== 'undefined' && elementData.length,
    tableChildren: document.getElementById('periodic-table').children.length,
    welcomeVisible: !document.getElementById('welcome-modal').classList.contains('hidden')
  })`);
  console.log('BOOT:', JSON.stringify(boot));
  if (!boot.hasElementData || boot.tableChildren === 0) {
    // unregister stale SW and reload once
    step('unregister-sw-reload');
    await evalJS(cdp, `navigator.serviceWorker.getRegistrations().then(rs => Promise.all(rs.map(r => r.unregister()))).then(() => 'cleared')`, 10000).catch(e => console.log('sw clear warn:', e.message));
    await cdp.send('Page.navigate', { url: GAME_URL });
    await sleep(4500);
  }

  step('login');
  await evalJS(cdp, `
    document.getElementById('player-name-input').value = 'تستر';
    document.getElementById('submit-name-btn').click(); 'ok'
  `);
  await sleep(700);

  step('buttons-check');
  const buttonsExist = await evalJS(cdp, `({
    story: !!document.getElementById('story-map-btn'),
    heatmap: !!document.getElementById('heatmap-btn'),
    hint: !!document.getElementById('hint-btn'),
    quit: !!document.getElementById('quit-game-btn'),
    challenge: !!document.getElementById('challenge-mode-check'),
    sound: !!document.getElementById('sound-toggle-btn')
  })`);
  console.log('BUTTONS:', JSON.stringify(buttonsExist));

  step('story-map-open');
  const storyMapOpens = await evalJS(cdp, `
    document.getElementById('story-map-btn').click();
    new Promise(res => setTimeout(() => res(!document.getElementById('story-map-modal').classList.contains('hidden')), 300));
  `, 10000);
  const mapRegions = await evalJS(cdp, `document.querySelectorAll('#story-map-list .map-region').length`);
  const mapLevels = await evalJS(cdp, `document.querySelectorAll('#story-map-list .map-level-btn').length`);
  console.log('MAP:', storyMapOpens, 'regions:', mapRegions, 'levels:', mapLevels);

  step('teach-modal');
  const teachModalShows = await evalJS(cdp, `
    startStoryLevel('r1','l1');
    new Promise(res => setTimeout(() => res(!document.getElementById('level-intro-modal').classList.contains('hidden')), 400));
  `, 10000);
  const teachChips = await evalJS(cdp, `document.querySelectorAll('.teach-element-chip').length`);
  console.log('TEACH:', teachModalShows, 'chips:', teachChips);

  step('begin-quiz');
  const levelBegins = await evalJS(cdp, `
    document.getElementById('begin-level-btn').click();
    new Promise(res => setTimeout(() => res(document.getElementById('game-dashboard').classList.contains('flex')), 500));
  `, 10000);
  const targets = await evalJS(cdp, `document.querySelectorAll('.puzzle-target').length`);
  const banner = await evalJS(cdp, `(document.getElementById('story-banner-live')||{textContent:''}).textContent.trim().slice(0,40)`);
  console.log('QUIZ:', levelBegins, 'targets:', targets, 'banner:', banner);

  step('correct-answer');
  const correctAnswerWorks = await evalJS(cdp, `
    (() => {
      const num = currentElement.num;
      const cell = document.querySelector('.puzzle-target[data-atomic="' + num + '"]');
      const scoreBefore = score;
      cell.click();
      return { num, scoreBefore, scoreAfter: score, filled: cell.classList.contains('filled'), combo: comboCount };
    })()
  `);
  console.log('CORRECT:', JSON.stringify(correctAnswerWorks));
  await sleep(350);

  step('wrong-answer');
  const wrongAnswerWorks = await evalJS(cdp, `
    (() => {
      const wrongCell = Array.from(document.querySelectorAll('.puzzle-target')).find(c => !c.classList.contains('filled') && +c.dataset.atomic !== currentElement.num);
      if (!wrongCell) return { skipped: true };
      wrongCell.click();
      return { livesAfter: lives, comboReset: comboCount === 0 };
    })()
  `);
  console.log('WRONG:', JSON.stringify(wrongAnswerWorks));

  step('hint');
  const hintWorks = await evalJS(cdp, `
    (() => {
      const s = score;
      useHint();
      return { scoreDropped: score < s, pulses: document.querySelectorAll('.hint-pulse').length > 0 };
    })()
  `);
  console.log('HINT:', JSON.stringify(hintWorks));

  step('quit');
  const quitEndsGame = await evalJS(cdp, `
    (() => {
      window.confirm = () => true;
      document.getElementById('quit-game-btn').click();
      return {
        modalShown: !document.getElementById('game-over-modal').classList.contains('hidden'),
        statsText: document.getElementById('end-stats').textContent.trim().slice(0, 70)
      };
    })()
  `);
  const savedProgress = await evalJS(cdp, `localStorage.getItem('pp-story-progress')`);
  console.log('QUIT:', JSON.stringify(quitEndsGame), 'progress:', savedProgress);

  step('classic-challenge');
  await evalJS(cdp, `document.getElementById('restart-btn').click()`);
  await sleep(400);
  const classicWithChallenge = await evalJS(cdp, `
    document.getElementById('challenge-mode-check').checked = true;
    document.getElementById('start-btn').click();
    new Promise(res => setTimeout(() => res({
      dashboardVisible: document.getElementById('game-dashboard').classList.contains('flex'),
      challengeBarShown: !document.getElementById('challenge-bar-container').classList.contains('hidden'),
      targets: document.querySelectorAll('.puzzle-target').length,
      notStoryMode: !document.getElementById('game-dashboard').classList.contains('story-active')
    }), 600));
  `, 12000);
  console.log('CLASSIC+CHALLENGE:', JSON.stringify(classicWithChallenge));

  step('play-for-heatmap');
  const played = await evalJS(cdp, `
    (async () => {
      let guard = 0;
      while (document.querySelectorAll('.puzzle-target:not(.filled)').length > 5 && guard++ < 60) {
        const cell = document.querySelector('.puzzle-target[data-atomic="' + currentElement.num + '"]:not(.filled)');
        if (!cell) break;
        cell.click();
        await new Promise(r => setTimeout(r, 300));
      }
      return { remaining: document.querySelectorAll('.puzzle-target:not(.filled)').length };
    })()
  `, 40000);
  console.log('PLAYED:', JSON.stringify(played));

  step('heatmap');
  const heatmapToggle = await evalJS(cdp, `
    (() => {
      toggleHeatmap();
      const on = {
        heatCells: document.querySelectorAll('.element[class*="heat-"]').length,
        legendVisible: !document.getElementById('heatmap-legend').classList.contains('hidden')
      };
      toggleHeatmap();
      return on;
    })()
  `);
  console.log('HEATMAP:', JSON.stringify(heatmapToggle));

  step('sound');
  const soundEngine = await evalJS(cdp, `({ enabled: soundEnabled, ctxOk: !!getAudioCtx() })`);
  console.log('SOUND:', JSON.stringify(soundEngine));

  step('info-card');
  const infoCard = await evalJS(cdp, `
    (() => {
      isGameActive = false;
      openElementInfo(elementData.find(e => e.num === 26));
      const g = document.querySelectorAll('#info-desc .prop-box').length;
      document.getElementById('element-modal').classList.add('hidden');
      return { propBoxes: g };
    })()
  `);
  console.log('INFO CARD:', JSON.stringify(infoCard));

  step('done');
  console.log('\n=== ALL STEPS PASSED ===');
  clearTimeout(WATCHDOG);
  cdp.close();
  process.exit(0);
}

main().catch(e => {
  console.error('TEST FAILED at [' + LAST_STEP + ']:', e.message);
  clearTimeout(WATCHDOG);
  process.exit(1);
});
