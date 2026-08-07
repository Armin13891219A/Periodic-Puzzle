// Complete periodic table data structure up to period 5
// Categories mapping:
// 1: alkali, 2: alkaline-earth, 3: transition, 4: post-transition
// 5: metalloid, 6: nonmetal, 7: halogen, 8: noble

const elementData = [
    { num: 1, sym: 'H', name: 'هیدروژن', p: 1, g: 1, cat: 'nonmetal', isMainBlock: true },
    { num: 2, sym: 'He', name: 'هلیم', p: 1, g: 18, cat: 'noble', isMainBlock: true },
    { num: 3, sym: 'Li', name: 'لیتیم', p: 2, g: 1, cat: 'alkali', isMainBlock: true },
    { num: 4, sym: 'Be', name: 'بریلیم', p: 2, g: 2, cat: 'alkaline-earth', isMainBlock: true },
    { num: 5, sym: 'B', name: 'بور', p: 2, g: 13, cat: 'metalloid', isMainBlock: true },
    { num: 6, sym: 'C', name: 'کربن', p: 2, g: 14, cat: 'nonmetal', isMainBlock: true },
    { num: 7, sym: 'N', name: 'نیتروژن', p: 2, g: 15, cat: 'nonmetal', isMainBlock: true },
    { num: 8, sym: 'O', name: 'اکسیژن', p: 2, g: 16, cat: 'nonmetal', isMainBlock: true },
    { num: 9, sym: 'F', name: 'فلوئور', p: 2, g: 17, cat: 'halogen', isMainBlock: true },
    { num: 10, sym: 'Ne', name: 'نئون', p: 2, g: 18, cat: 'noble', isMainBlock: true },
    { num: 11, sym: 'Na', name: 'سدیم', p: 3, g: 1, cat: 'alkali', isMainBlock: true },
    { num: 12, sym: 'Mg', name: 'منیزیم', p: 3, g: 2, cat: 'alkaline-earth', isMainBlock: true },
    { num: 13, sym: 'Al', name: 'آلومینیم', p: 3, g: 13, cat: 'post-transition', isMainBlock: true },
    { num: 14, sym: 'Si', name: 'سیلیسیم', p: 3, g: 14, cat: 'metalloid', isMainBlock: true },
    { num: 15, sym: 'P', name: 'فسفر', p: 3, g: 15, cat: 'nonmetal', isMainBlock: true },
    { num: 16, sym: 'S', name: 'گوگرد', p: 3, g: 16, cat: 'nonmetal', isMainBlock: true },
    { num: 17, sym: 'Cl', name: 'کلر', p: 3, g: 17, cat: 'halogen', isMainBlock: true },
    { num: 18, sym: 'Ar', name: 'آرگون', p: 3, g: 18, cat: 'noble', isMainBlock: true },
    { num: 19, sym: 'K', name: 'پتاسیم', p: 4, g: 1, cat: 'alkali', isMainBlock: true },
    { num: 20, sym: 'Ca', name: 'کلسیم', p: 4, g: 2, cat: 'alkaline-earth', isMainBlock: true },
    { num: 21, sym: 'Sc', name: 'اسکاندیم', p: 4, g: 3, cat: 'transition', isMainBlock: false },
    { num: 22, sym: 'Ti', name: 'تیتانیم', p: 4, g: 4, cat: 'transition', isMainBlock: false },
    { num: 23, sym: 'V', name: 'وانادیم', p: 4, g: 5, cat: 'transition', isMainBlock: false },
    { num: 24, sym: 'Cr', name: 'کروم', p: 4, g: 6, cat: 'transition', isMainBlock: false },
    { num: 25, sym: 'Mn', name: 'منگنز', p: 4, g: 7, cat: 'transition', isMainBlock: false },
    { num: 26, sym: 'Fe', name: 'آهن', p: 4, g: 8, cat: 'transition', isMainBlock: false },
    { num: 27, sym: 'Co', name: 'کبالت', p: 4, g: 9, cat: 'transition', isMainBlock: false },
    { num: 28, sym: 'Ni', name: 'نیکل', p: 4, g: 10, cat: 'transition', isMainBlock: false },
    { num: 29, sym: 'Cu', name: 'مس', p: 4, g: 11, cat: 'transition', isMainBlock: false },
    { num: 30, sym: 'Zn', name: 'روی', p: 4, g: 12, cat: 'transition', isMainBlock: false },
    { num: 31, sym: 'Ga', name: 'گالیم', p: 4, g: 13, cat: 'post-transition', isMainBlock: true },
    { num: 32, sym: 'Ge', name: 'ژرمانیم', p: 4, g: 14, cat: 'metalloid', isMainBlock: true },
    { num: 33, sym: 'As', name: 'آرسنیک', p: 4, g: 15, cat: 'metalloid', isMainBlock: true },
    { num: 34, sym: 'Se', name: 'سلنیم', p: 4, g: 16, cat: 'nonmetal', isMainBlock: true },
    { num: 35, sym: 'Br', name: 'برم', p: 4, g: 17, cat: 'halogen', isMainBlock: true },
    { num: 36, sym: 'Kr', name: 'کریپتون', p: 4, g: 18, cat: 'noble', isMainBlock: true },
    { num: 37, sym: 'Rb', name: 'روبیدیم', p: 5, g: 1, cat: 'alkali', isMainBlock: true },
    { num: 38, sym: 'Sr', name: 'استرانسیم', p: 5, g: 2, cat: 'alkaline-earth', isMainBlock: true },
    { num: 39, sym: 'Y', name: 'ایتریم', p: 5, g: 3, cat: 'transition', isMainBlock: false },
    { num: 40, sym: 'Zr', name: 'زیرکونیم', p: 5, g: 4, cat: 'transition', isMainBlock: false },
    { num: 41, sym: 'Nb', name: 'نیوبیم', p: 5, g: 5, cat: 'transition', isMainBlock: false },
    { num: 42, sym: 'Mo', name: 'مولیبدن', p: 5, g: 6, cat: 'transition', isMainBlock: false },
    { num: 43, sym: 'Tc', name: 'تکنسیم', p: 5, g: 7, cat: 'transition', isMainBlock: false },
    { num: 44, sym: 'Ru', name: 'روتنیم', p: 5, g: 8, cat: 'transition', isMainBlock: false },
    { num: 45, sym: 'Rh', name: 'رودیم', p: 5, g: 9, cat: 'transition', isMainBlock: false },
    { num: 46, sym: 'Pd', name: 'پالادیم', p: 5, g: 10, cat: 'transition', isMainBlock: false },
    { num: 47, sym: 'Ag', name: 'نقره', p: 5, g: 11, cat: 'transition', isMainBlock: false },
    { num: 48, sym: 'Cd', name: 'کادمیم', p: 5, g: 12, cat: 'transition', isMainBlock: false },
    { num: 49, sym: 'In', name: 'ایندیم', p: 5, g: 13, cat: 'post-transition', isMainBlock: true },
    { num: 50, sym: 'Sn', name: 'قلع', p: 5, g: 14, cat: 'post-transition', isMainBlock: true },
    { num: 51, sym: 'Sb', name: 'آنتیموان', p: 5, g: 15, cat: 'metalloid', isMainBlock: true },
    { num: 52, sym: 'Te', name: 'تلوریم', p: 5, g: 16, cat: 'metalloid', isMainBlock: true },
    { num: 53, sym: 'I', name: 'ید', p: 5, g: 17, cat: 'halogen', isMainBlock: true },
    { num: 54, sym: 'Xe', name: 'زنون', p: 5, g: 18, cat: 'noble', isMainBlock: true },
    { num: 55, sym: 'Cs', name: 'سزیم', p: 6, g: 1, cat: 'alkali', isMainBlock: true },
    { num: 56, sym: 'Ba', name: 'باریم', p: 6, g: 2, cat: 'alkaline-earth', isMainBlock: true },
    { num: 57, sym: 'La', name: 'لانتان', p: 6, g: 3, cat: 'lanthanide', isMainBlock: false },
    { num: 58, sym: 'Ce', name: 'سریم', p: 9, g: 4, cat: 'lanthanide', isMainBlock: false },
    { num: 59, sym: 'Pr', name: 'پرازئودیمیم', p: 9, g: 5, cat: 'lanthanide', isMainBlock: false },
    { num: 60, sym: 'Nd', name: 'نئودیمیم', p: 9, g: 6, cat: 'lanthanide', isMainBlock: false },
    { num: 61, sym: 'Pm', name: 'پرومتیم', p: 9, g: 7, cat: 'lanthanide', isMainBlock: false },
    { num: 62, sym: 'Sm', name: 'ساماریم', p: 9, g: 8, cat: 'lanthanide', isMainBlock: false },
    { num: 63, sym: 'Eu', name: 'اروپیم', p: 9, g: 9, cat: 'lanthanide', isMainBlock: false },
    { num: 64, sym: 'Gd', name: 'گادولینیم', p: 9, g: 10, cat: 'lanthanide', isMainBlock: false },
    { num: 65, sym: 'Tb', name: 'تربیم', p: 9, g: 11, cat: 'lanthanide', isMainBlock: false },
    { num: 66, sym: 'Dy', name: 'دیسپروزیم', p: 9, g: 12, cat: 'lanthanide', isMainBlock: false },
    { num: 67, sym: 'Ho', name: 'هولمیم', p: 9, g: 13, cat: 'lanthanide', isMainBlock: false },
    { num: 68, sym: 'Er', name: 'اربیم', p: 9, g: 14, cat: 'lanthanide', isMainBlock: false },
    { num: 69, sym: 'Tm', name: 'تولیم', p: 9, g: 15, cat: 'lanthanide', isMainBlock: false },
    { num: 70, sym: 'Yb', name: 'ایتربیم', p: 9, g: 16, cat: 'lanthanide', isMainBlock: false },
    { num: 71, sym: 'Lu', name: 'لوتتیم', p: 9, g: 17, cat: 'lanthanide', isMainBlock: false },
    { num: 72, sym: 'Hf', name: 'هافنیم', p: 6, g: 4, cat: 'transition', isMainBlock: false },
    { num: 73, sym: 'Ta', name: 'تانتال', p: 6, g: 5, cat: 'transition', isMainBlock: false },
    { num: 74, sym: 'W', name: 'تنگستن', p: 6, g: 6, cat: 'transition', isMainBlock: false },
    { num: 75, sym: 'Re', name: 'رنیم', p: 6, g: 7, cat: 'transition', isMainBlock: false },
    { num: 76, sym: 'Os', name: 'اسمیم', p: 6, g: 8, cat: 'transition', isMainBlock: false },
    { num: 77, sym: 'Ir', name: 'ایریدیم', p: 6, g: 9, cat: 'transition', isMainBlock: false },
    { num: 78, sym: 'Pt', name: 'پلاتین', p: 6, g: 10, cat: 'transition', isMainBlock: false },
    { num: 79, sym: 'Au', name: 'طلا', p: 6, g: 11, cat: 'transition', isMainBlock: false },
    { num: 80, sym: 'Hg', name: 'جیوه', p: 6, g: 12, cat: 'transition', isMainBlock: false },
    { num: 81, sym: 'Tl', name: 'تالیم', p: 6, g: 13, cat: 'post-transition', isMainBlock: true },
    { num: 82, sym: 'Pb', name: 'سرب', p: 6, g: 14, cat: 'post-transition', isMainBlock: true },
    { num: 83, sym: 'Bi', name: 'بیسموت', p: 6, g: 15, cat: 'post-transition', isMainBlock: true },
    { num: 84, sym: 'Po', name: 'پولونیم', p: 6, g: 16, cat: 'post-transition', isMainBlock: true },
    { num: 85, sym: 'At', name: 'استاتین', p: 6, g: 17, cat: 'halogen', isMainBlock: true },
    { num: 86, sym: 'Rn', name: 'رادون', p: 6, g: 18, cat: 'noble', isMainBlock: true },
    { num: 87, sym: 'Fr', name: 'فرانسیم', p: 7, g: 1, cat: 'alkali', isMainBlock: true },
    { num: 88, sym: 'Ra', name: 'رادیم', p: 7, g: 2, cat: 'alkaline-earth', isMainBlock: true },
    { num: 89, sym: 'Ac', name: 'اکتینیم', p: 7, g: 3, cat: 'actinide', isMainBlock: false },
    { num: 90, sym: 'Th', name: 'توریم', p: 10, g: 4, cat: 'actinide', isMainBlock: false },
    { num: 91, sym: 'Pa', name: 'پروتاکتینیم', p: 10, g: 5, cat: 'actinide', isMainBlock: false },
    { num: 92, sym: 'U', name: 'اورانیوم', p: 10, g: 6, cat: 'actinide', isMainBlock: false },
    { num: 93, sym: 'Np', name: 'نپتونیوم', p: 10, g: 7, cat: 'actinide', isMainBlock: false },
    { num: 94, sym: 'Pu', name: 'پلوتونیوم', p: 10, g: 8, cat: 'actinide', isMainBlock: false },
    { num: 95, sym: 'Am', name: 'امریسیم', p: 10, g: 9, cat: 'actinide', isMainBlock: false },
    { num: 96, sym: 'Cm', name: 'کوریم', p: 10, g: 10, cat: 'actinide', isMainBlock: false },
    { num: 97, sym: 'Bk', name: 'برکلیم', p: 10, g: 11, cat: 'actinide', isMainBlock: false },
    { num: 98, sym: 'Cf', name: 'کالیفرنیم', p: 10, g: 12, cat: 'actinide', isMainBlock: false },
    { num: 99, sym: 'Es', name: 'اینشتینیم', p: 10, g: 13, cat: 'actinide', isMainBlock: false },
    { num: 100, sym: 'Fm', name: 'فرمیم', p: 10, g: 14, cat: 'actinide', isMainBlock: false },
    { num: 101, sym: 'Md', name: 'مندلیفیم', p: 10, g: 15, cat: 'actinide', isMainBlock: false },
    { num: 102, sym: 'No', name: 'نوبلیم', p: 10, g: 16, cat: 'actinide', isMainBlock: false },
    { num: 103, sym: 'Lr', name: 'لارنسیم', p: 10, g: 17, cat: 'actinide', isMainBlock: false },
    { num: 104, sym: 'Rf', name: 'رادرفوردیم', p: 7, g: 4, cat: 'transition', isMainBlock: false },
    { num: 105, sym: 'Db', name: 'دوبنیم', p: 7, g: 5, cat: 'transition', isMainBlock: false },
    { num: 106, sym: 'Sg', name: 'سیبورگیم', p: 7, g: 6, cat: 'transition', isMainBlock: false },
    { num: 107, sym: 'Bh', name: 'بوریم', p: 7, g: 7, cat: 'transition', isMainBlock: false },
    { num: 108, sym: 'Hs', name: 'هاسیم', p: 7, g: 8, cat: 'transition', isMainBlock: false },
    { num: 109, sym: 'Mt', name: 'مایتنریم', p: 7, g: 9, cat: 'unknown', isMainBlock: false },
    { num: 110, sym: 'Ds', name: 'دارمشتادیم', p: 7, g: 10, cat: 'unknown', isMainBlock: false },
    { num: 111, sym: 'Rg', name: 'رونتگنیم', p: 7, g: 11, cat: 'unknown', isMainBlock: false },
    { num: 112, sym: 'Cn', name: 'کوپرنیسیم', p: 7, g: 12, cat: 'post-transition', isMainBlock: false },
    { num: 113, sym: 'Nh', name: 'نیهونیم', p: 7, g: 13, cat: 'unknown', isMainBlock: false },
    { num: 114, sym: 'Fl', name: 'فلروویم', p: 7, g: 14, cat: 'unknown', isMainBlock: false },
    { num: 115, sym: 'Mc', name: 'مسکوویم', p: 7, g: 15, cat: 'unknown', isMainBlock: false },
    { num: 116, sym: 'Lv', name: 'لیورموریم', p: 7, g: 16, cat: 'unknown', isMainBlock: false },
    { num: 117, sym: 'Ts', name: 'تنسین', p: 7, g: 17, cat: 'unknown', isMainBlock: false },
    { num: 118, sym: 'Og', name: 'اوگانسون', p: 7, g: 18, cat: 'unknown', isMainBlock: false }
];


// Game State
let currentPool = [];
let currentElement = null;
let score = 0;
let lives = 3;
let timeElapsed = 0;
let timerInterval;
let gameMode = 'symbol'; // 'symbol' or 'name'
let isGameActive = false;

// DOM Elements
const tableEl = document.getElementById('periodic-table');
const targetBox = document.getElementById('target-element-box');
const targetSymbolEl = document.getElementById('target-symbol');
const targetNameEl = document.getElementById('target-name');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const timerEl = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const startPanel = document.getElementById('start-panel');
const gameDashboard = document.getElementById('game-dashboard');
const modal = document.getElementById('game-over-modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const finalScoreEl = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

function createGrid(activeGame = false) {
    tableEl.innerHTML = '';
    
    elementData.forEach(el => {
        const cell = document.createElement('div');
        // Base classes
        cell.className = `element font-english period-${el.p} group-${el.g}`;
        
        if (el.isMainBlock && activeGame) {
            // These are the puzzle targets
            cell.classList.add('puzzle-target');
            cell.dataset.atomic = el.num;
            cell.addEventListener('click', () => handleCellClick(cell, el.num));
            
            // Add internal structure (hidden initially)
            cell.innerHTML = `
                <span class="number" style="direction: ltr; text-align: left;">${el.num}</span>
                <span class="symbol" style="direction: ltr;">${el.sym}</span>
                <span class="name font-vazirmatn" style="direction: ltr;">${el.name}</span>
            `;
            // Store color class to add later when correctly guessed
            cell.dataset.colorClass = `cat-${el.cat}`;
        } else {
            // Pre-filled items (Transition metals, Period 6 right side, or inactive state)
            cell.classList.add(`cat-${el.cat}`);
            if (activeGame) {
                cell.classList.add('pre-filled');
            }
            
            cell.innerHTML = `
                <span class="number" style="direction: ltr; text-align: left;">${el.num}</span>
                <span class="symbol" style="direction: ltr;">${el.sym}</span>
                <span class="name font-vazirmatn" style="direction: ltr;">${el.name}</span>
            `;
        }
        
        tableEl.appendChild(cell);
    });
}

function initGame() {
    // Get mode
    const selectedMode = document.querySelector('input[name="mode"]:checked').value;
    gameMode = selectedMode;
    
    // Reset state
    score = 0;
    lives = 3;
    timeElapsed = 0;
    isGameActive = true;
    
    // Get only main block elements (groups 1,2, 13-18 up to period 5) for the puzzle
    currentPool = elementData.filter(e => e.isMainBlock).sort(() => Math.random() - 0.5);
    
    // Update UI
    updateStats();
    createGrid(true);
    
    startPanel.classList.add('hidden');
    gameDashboard.classList.remove('hidden');
    gameDashboard.classList.add('flex');
    modal.classList.add('hidden');
    
    // Timer
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeElapsed++;
        updateTimerDisplay();
    }, 1000);
    
    nextElement();
}

function nextElement() {
    if (currentPool.length === 0) {
        endGame(true);
        return;
    }
    
    currentElement = currentPool.pop();
    
    if (gameMode === 'symbol') {
        targetSymbolEl.textContent = currentElement.sym;
        targetNameEl.textContent = ''; // Hide name
    } else {
        targetSymbolEl.textContent = currentElement.name;
        targetNameEl.textContent = ''; // Show symbol small below
        // Adjust text size if name is long
        if (currentElement.name.length > 8) {
            targetSymbolEl.className = 'text-2xl md:text-3xl leading-none';
        } else {
            targetSymbolEl.className = 'text-3xl md:text-4xl leading-none';
        }
    }
    
    // Add pop animation to target box
    targetBox.style.transform = 'scale(0.8)';
    setTimeout(() => {
        targetBox.style.transform = 'scale(1)';
    }, 150);
}

function handleCellClick(cell, targetAtomic) {
    if (!isGameActive || !currentElement || cell.classList.contains('filled')) return;
    
    if (targetAtomic === currentElement.num) {
        // Correct!
        cell.classList.remove('puzzle-target');
        cell.classList.add('filled');
        cell.classList.add(cell.dataset.colorClass); // Apply original color
        
        score += 10;
        updateStats();
        nextElement();
    } else {
        // Wrong!
        cell.classList.add('wrong-guess');
        setTimeout(() => cell.classList.remove('wrong-guess'), 500);
        
        lives--;
        score = Math.max(0, score - 5);
        updateStats();
        
        if (lives <= 0) {
            endGame(false);
        }
    }
}

function updateStats() {
    scoreEl.textContent = score;
    livesEl.textContent = '❤️'.repeat(lives) + '🤍'.repeat(3 - lives);
}

function updateTimerDisplay() {
    const mins = Math.floor(timeElapsed / 60).toString().padStart(2, '0');
    const secs = (timeElapsed % 60).toString().padStart(2, '0');
    timerEl.textContent = `${mins}:${secs}`;
}

function endGame(win) {
    isGameActive = false;
    clearInterval(timerInterval);
    modal.classList.remove('hidden');
    
    if (win) {
        modalTitle.textContent = 'تبریک! 🎉';
        modalTitle.className = 'text-3xl font-extrabold text-green-400 mb-2';
        modalMessage.textContent = 'شما تمام عناصر را با موفقیت در جایگاه صحیح خود قرار دادید!';
    } else {
        modalTitle.textContent = 'بازی تمام شد! 💀';
        modalTitle.className = 'text-3xl font-extrabold text-rose-500 mb-2';
        modalMessage.innerHTML = `عنصری که نتوانستید پیدا کنید:<br><span class="font-bold text-white text-xl mt-2 inline-block font-english">${currentElement.sym} - ${currentElement.name}</span>`;
    }
    
    finalScoreEl.textContent = score;
}

// Event Listeners
startBtn.addEventListener('click', initGame);
restartBtn.addEventListener('click', () => {
    startPanel.classList.remove('hidden');
    gameDashboard.classList.add('hidden');
    gameDashboard.classList.remove('flex');
    modal.classList.add('hidden');
    createGrid(false); // Reset to display mode
});

// Initial empty grid for visual structure before start
document.addEventListener('DOMContentLoaded', () => {
    createGrid(false);
});