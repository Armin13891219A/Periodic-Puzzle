// Check full coverage of 118 elements in story map
const fs = require('fs');
const src = fs.readFileSync(__dirname + '/story_map.js', 'utf8').split('/* عنصر properties')[0];
const storyRegions = new Function(src + '\nreturn storyRegions;')();

const taught = new Set();
storyRegions.forEach(r => r.levels.forEach(l => (l.teachNums || []).forEach(n => taught.add(n))));

const missing = [];
for (let i = 1; i <= 118; i++) if (!taught.has(i)) missing.push(i);
console.log('Taught elements:', taught.size, '/ 118');
console.log('Missing:', missing.length ? JSON.stringify(missing) : 'NONE — full coverage!');

let totalLevels = 0;
storyRegions.forEach(r => totalLevels += r.levels.length);
console.log('Total levels:', totalLevels);

// max quiz size check
let maxQuiz = 0, maxAt = '';
storyRegions.forEach(r => r.levels.forEach(l => {
  const q = l.quizNums === '__ALL__' ? 999 : l.quizNums.length;
  if (q > maxQuiz && q !== 999) { maxQuiz = q; maxAt = r.id + '/' + l.id; }
}));
console.log('Largest non-final quiz:', maxQuiz, 'elements at', maxAt);
