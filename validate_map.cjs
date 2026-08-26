// Validate the golden rule for story_map.js
const fs = require('fs');
const src = fs.readFileSync(__dirname + '/story_map.js', 'utf8').split('/* Element properties')[0];
const storyRegions = new Function(src + '\nreturn storyRegions;')();

let ok = true;
let cumulative = new Set();
for (const r of storyRegions) {
  for (const l of r.levels) {
    (l.teachNums || []).forEach(n => cumulative.add(n));
    const quiz = l.quizNums === '__ALL__' ? [] : l.quizNums;
    for (const q of quiz) {
      if (!cumulative.has(q)) { console.log('VIOLATION:', r.id + '/' + l.id, 'quizzes untaught element', q); ok = false; }
    }
  }
}
console.log(ok ? 'GOLDEN RULE OK: every quiz only tests taught elements' : 'RULE BROKEN');
console.log('Total regions:', storyRegions.length, '| Total levels:', storyRegions.reduce((a, r) => a + r.levels.length, 0));
storyRegions.forEach(r => {
  r.levels.forEach((l, i) => console.log(r.id, '| L' + (i + 1), l.name, '→ teach:', JSON.stringify(l.teachNums), 'quiz:', l.quizNums === '__ALL__' ? 'ALL' : '[' + l.quizNums.join(',') + ']'));
});
