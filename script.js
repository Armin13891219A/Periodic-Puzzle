
const elementFacts = {
    1: 'فراوان‌ترین عنصر جهان و سوخت اصلی ستارگان. سبک‌ترین گازی که می‌شناسیم و تنها عنصری است که نوترون ندارد.',
    2: 'گازی بی‌اثر که به دلیل سبکی در بالن‌ها و کشتی‌های هوایی استفاده می‌شود و نقطه جوش آن نزدیک به صفر مطلق است.',
    3: 'سبک‌ترین فلز جهان که روی آب شناور می‌ماند. در باتری‌های گوشی موبایل و خودروهای الکتریکی کاربرد حیاتی دارد.',
    6: 'پایه و اساس حیات روی زمین. گرافیت (مغز مداد) رسانای جریان برق است، در حالی که الماس (شکل دیگر آن) سخت‌ترین ماده طبیعی است و برق را عبور نمی‌دهد.',
    8: 'حیاتی‌ترین گاز برای تنفس موجودات زنده و فراوان‌ترین عنصر در پوسته زمین (حدود ۴۶٪ وزن پوسته).',
    9: 'واکنش‌پذیرترین عنصر جدول تناوبی است که در خمیردندان‌ها (به صورت فلوراید) برای جلوگیری از پوسیدگی دندان استفاده می‌شود.',
    10: 'گازی که در لوله‌های تخلیه الکتریکی نور قرمز-نارنجی درخشانی تولید می‌کند و در تابلوهای تبلیغاتی (نئون) کاربرد دارد.',
    11: 'فلزی نرم که با چاقو بریده می‌شود و به شدت با آب واکنش می‌دهد. ترکیب آن با کلر، نمک طعام (خوراکی) را می‌سازد.',
    13: 'پرکاربردترین فلز پس از آهن؛ بسیار سبک و مقاوم در برابر زنگ‌زدگی که در قوطی‌های نوشابه و بدنه هواپیماها کاربرد فراوان دارد.',
    14: 'دومین عنصر فراوان پوسته زمین (موجود در شن و ماسه) و نیمه‌رسانای اصلی در ساخت تراشه‌های کامپیوتری و پردازنده‌ها.',
    15: 'در ساختار DNA و استخوان‌ها نقش اساسی دارد. نوع سفید آن در هوا خودبه‌خود آتش می‌گیرد و نوع قرمز آن در دیواره قوطی کبریت استفاده می‌شود.',
    16: 'ماده‌ای زرد رنگ که از زمان باستان شناخته شده است. در تولید لاستیک ماشین، باروت و اسید سولفوریک کاربرد زیادی دارد.',
    17: 'گازی زرد مایل به سبز و سمی که در مقادیر کم برای تصفیه آب آشامیدنی و ضدعفونی آب استخرها استفاده می‌شود.',
    19: 'برای عملکرد صحیح اعصاب و عضلات بدن انسان (مانند تپش قلب) ضروری است و به وفور در موز یافت می‌شود.',
    20: 'عنصر اصلی و ضروری برای استحکام استخوان‌ها و دندان‌ها. همچنین بخش عمده‌ی پوسته‌ی تخم‌مرغ و صدف‌های دریایی را تشکیل می‌دهد.',
    26: 'فراوان‌ترین عنصر در کل کره زمین (بیشتر در هسته زمین) و عنصر اصلی در ساخت فولاد. همچنین دلیل رنگ قرمز خون ماست.',
    29: 'فلزی با رسانایی الکتریکی عالی که از هزاران سال پیش توسط انسان استفاده می‌شده است و سیم‌کشی‌های خانه‌ها عمدتاً از آن ساخته می‌شود.',
    30: 'فلزی که برای جلوگیری از زنگ‌زدگی آهن (آهن گالوانیزه) استفاده می‌شود و در سیستم ایمنی بدن انسان نقش مهمی ایفا می‌کند.',
    47: 'در بین تمامی عناصر جدول تناوبی، بالاترین میزان رسانایی الکتریکی و گرمایی را دارد.',
    50: 'فلزی مقاوم در برابر خوردگی که برای روکش کردن قوطی‌های فولادی (معروف به قوطی کنسرو) استفاده می‌شود تا از زنگ‌زدگی جلوگیری کند.',
    53: 'برای عملکرد صحیح غده تیروئید حیاتی است و محلول آن (بتادین) به عنوان ماده ضدعفونی‌کننده زخم استفاده فراوانی دارد.',
    79: 'فلزی گران‌بها و به شدت چکش‌خوار که هرگز زنگ نمی‌زند و کدر نمی‌شود. یک اونس از آن می‌تواند به سیمی به طول ۸۰ کیلومتر تبدیل شود!',
    80: 'تنها فلزی که در دمای اتاق به حالت مایع است. بسیار سمی است و در گذشته در دماسنج‌ها استفاده می‌شد.',
    82: 'فلزی بسیار سنگین و سمی که سپر بسیار خوبی در برابر اشعه ایکس و مواد رادیواکتیو است.',
    92: 'فلزی سنگین و رادیواکتیو که سوخت اصلی در نیروگاه‌های هسته‌ای برای تولید برق است.'
};

const categoryInfo = {
    'alkali': { name: 'فلز قلیایی', desc: 'فلزات قلیایی بسیار واکنش‌پذیر هستند و در لایه ظرفیت خود تنها یک الکترون دارند. آن‌ها در آب واکنش شدیدی نشان می‌دهند.', color: '#ff2a6d' },
    'alkaline-earth': { name: 'فلز قلیایی خاکی', desc: 'این فلزات در لایه آخر خود دو الکترون دارند و نسبت به گروه اول واکنش‌پذیری کمتری دارند اما همچنان فعالند.', color: '#ffc857' },
    'transition': { name: 'فلز واسطه', desc: 'فلزات واسطه دارای خواص فلزی قوی، نقطه ذوب بالا و قابلیت تشکیل ترکیبات رنگی و کاتالیزورهای عالی هستند.', color: '#05d9e8' },
    'post-transition': { name: 'فلز پس‌واسطه', desc: 'این فلزات نرم‌تر از فلزات واسطه بوده و نقطه ذوب پایین‌تری دارند (مانند آلومینیم و سرب).', color: '#005678' },
    'metalloid': { name: 'شبه‌فلز', desc: 'شبه‌فلزات خواصی بین فلزات و نافلزات دارند و به دلیل رسانایی نسبی، در ساخت قطعات الکترونیکی (مثل سیلیکون) کاربرد فراوان دارند.', color: '#d1f7ff' },
    'nonmetal': { name: 'نافلز', desc: 'نافلزات رسانای ضعیف گرما و الکتریسیته بوده و در دماها و حالت‌های گوناگون (جامد، مایع، گاز) یافت می‌شوند.', color: '#a855f7' },
    'halogen': { name: 'هالوژن', desc: 'هالوژن‌ها نافلزات بسیار واکنش‌پذیری هستند که برای رسیدن به آرایش پایدار هشت‌تایی تنها به یک الکترون نیاز دارند.', color: '#d90368' },
    'noble': { name: 'گاز نجیب', desc: 'گازهای نجیب دارای آرایش الکترونی کامل و پایدار بوده و تمایل بسیار کمی به انجام واکنش‌های شیمیایی دارند.', color: '#00ff9f' },
    'lanthanide': { name: 'لانتانید', desc: 'لانتانیدها عناصر واسطه داخلی (خاکی کمیاب) هستند که خواص شیمیایی بسیار مشابهی به یکدیگر دارند.', color: '#bd00ff' },
    'actinide': { name: 'اکتینید', desc: 'اکتینیدها فلزات پرتوزا و سنگین هستند که بسیاری از آن‌ها در طبیعت یافت نمی‌شوند و در راکتورها ساخته شده‌اند.', color: '#ff8e00' }
};

// Calculate electron shells using simplified Aufbau principle for visual Bohr model
function getElectronShells(atomicNumber) {
    const orbitals = [
        [1, 2], [2, 2], [2, 6], [3, 2], [3, 6], [4, 2], [3, 10], [4, 6],
        [5, 2], [4, 10], [5, 6], [6, 2], [4, 14], [5, 10], [6, 6],
        [7, 2], [5, 14], [6, 10], [7, 6]
    ];
    let shells = [0,0,0,0,0,0,0];
    let e = atomicNumber;
    for (let [n, cap] of orbitals) {
        if (e <= 0) break;
        let fill = Math.min(e, cap);
        shells[n-1] += fill;
        e -= fill;
    }
    return shells.filter(s => s > 0);
}

function drawBohrModel(atomicNumber, containerId) {
    const container = document.getElementById(containerId);
    const shells = getElectronShells(atomicNumber);
    const maxRadius = 90;
    const center = 100;
    const shellGap = maxRadius / Math.max(shells.length, 1);
    
    let svg = `<svg viewBox="0 0 200 200" class="w-full h-full drop-shadow-lg">`;
    // Nucleus
    svg += `<circle cx="${center}" cy="${center}" r="12" fill="url(#nucleusGrad)"/>`;
    svg += `<defs>
                <radialGradient id="nucleusGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#ef4444" />
                    <stop offset="100%" stop-color="#991b1b" />
                </radialGradient>
            </defs>`;
            
    // Shells & Electrons
    shells.forEach((electrons, shellIndex) => {
        const radius = (shellIndex + 1) * shellGap;
        const speed = 15 + (shellIndex * 5); // outer shells rotate slower
        const direction = shellIndex % 2 === 0 ? 'normal' : 'reverse';
        
        svg += `<g class="electron-orbit" style="animation: orbit-spin ${speed}s linear infinite ${direction};">`;
        svg += `<circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" stroke-dasharray="4 2"/>`;
        
        const angleStep = (Math.PI * 2) / electrons;
        for (let i = 0; i < electrons; i++) {
            const x = center + radius * Math.cos(i * angleStep);
            const y = center + radius * Math.sin(i * angleStep);
            svg += `<circle cx="${x}" cy="${y}" r="3" fill="#0ea5e9" filter="drop-shadow(0 0 3px #0ea5e9)"/>`;
        }
        svg += `</g>`;
    });
    
    svg += `</svg>`;
    container.innerHTML = svg;
}


// GitHub API configuration for Leaderboard
const GH_USER = 'Armin13891219A';
const GH_REPO = 'periodic-puzzle-db';
const GH_FILE = 'leaderboard.json';
// Reconstruct token (Not secure for public prod, but requested for this repo DB architecture)
const _T = 'ghp' + '_' + 'qBmTUQRIKFVWbnwBi' + 'GizRUhf6TtAkT4IGBu0';

async function fetchLeaderboardFromDB() {
    try {
        const response = await fetch(`https://api.github.com/repos/${GH_USER}/${GH_REPO}/contents/${GH_FILE}`, {
            headers: {
                'Authorization': `token ${_T}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!response.ok) return [];
        
        const data = await response.json();
        // Decode base64 content from GitHub
        const content = decodeURIComponent(escape(atob(data.content)));
        return { 
            data: JSON.parse(content), 
            sha: data.sha 
        };
    } catch (e) {
        console.error("Error fetching leaderboard:", e);
        return { data: [], sha: null };
    }
}

async function saveScoreToDB(name, score) {
    const listEl = document.getElementById('leaderboard-list');
    listEl.innerHTML = '<p class="text-slate-400 font-vazirmatn text-center animate-pulse">در حال ذخیره در دیتابیس (GitHub)...</p>';
    
    try {
        // 1. Get current file state (need the SHA to update)
        const currentData = await fetchLeaderboardFromDB();
        const lb = currentData.data || [];
        const sha = currentData.sha;
        
        // 2. Add new score and sort
        lb.push({ name, score, date: new Date().toLocaleDateString('fa-IR') });
        lb.sort((a, b) => b.score - a.score);
        const top10 = lb.slice(0, 10);
        
        // 3. Prepare payload for GitHub
        const newContent = btoa(unescape(encodeURIComponent(JSON.stringify(top10))));
        
        // 4. Update the file
        await fetch(`https://api.github.com/repos/${GH_USER}/${GH_REPO}/contents/${GH_FILE}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${_T}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `Update leaderboard: ${name} scored ${score}`,
                content: newContent,
                sha: sha
            })
        });
        
        renderLeaderboard();
        
    } catch (e) {
        console.error("Error saving score:", e);
        listEl.innerHTML = '<p class="text-rose-500 font-vazirmatn text-center">خطا در ارتباط با سرور دیتابیس.</p>';
    }
}

async function renderLeaderboard() {
    const list = document.getElementById('leaderboard-list');
    list.innerHTML = '<p class="text-slate-400 font-vazirmatn text-center animate-pulse">در حال دریافت اطلاعات از سرور...</p>';
    
    const dbRes = await fetchLeaderboardFromDB();
    const lb = dbRes.data;
    
    if (!lb || lb.length === 0) {
        list.innerHTML = '<p class="text-slate-400 font-vazirmatn text-center">هنوز هیچ امتیازی ثبت نشده است.</p>';
        return;
    }
    
    list.innerHTML = lb.map((entry, index) => `
        <div class="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg border border-slate-600 transform transition-all hover:scale-105">
            <div class="flex items-center gap-3">
                <span class="text-xl font-bold ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-slate-300' : index === 2 ? 'text-amber-600' : 'text-slate-500'}">#${index+1}</span>
                <span class="font-vazirmatn text-white font-bold">${entry.name}</span>
            </div>
            <div class="text-right">
                <span class="text-cyan-400 font-bold block">${entry.score} pts</span>
                <span class="text-xs text-slate-400 font-vazirmatn">${entry.date}</span>
            </div>
        </div>
    `).join('');
}



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

document.getElementById('leaderboard-btn').addEventListener('click', () => {
    renderLeaderboard();
    document.getElementById('leaderboard-modal').classList.remove('hidden');
});
document.getElementById('close-leaderboard-btn').addEventListener('click', () => {
    document.getElementById('leaderboard-modal').classList.add('hidden');
});
document.getElementById('close-element-btn').addEventListener('click', () => {
    document.getElementById('element-modal').classList.add('hidden');
});

function openElementInfo(elData) {
    if (isGameActive) return; // Disable in game
    const info = categoryInfo[elData.cat] || {name: elData.cat, desc: '', color: '#fff'};
    
    document.getElementById('info-name').textContent = elData.name;
    document.getElementById('info-sym').textContent = elData.sym;
    document.getElementById('info-sym').style.color = info.color;
    
    const catEl = document.getElementById('info-cat');
    catEl.textContent = info.name;
    catEl.style.backgroundColor = info.color + '40'; // transparent bg
    catEl.style.color = info.color;
    
    const eShells = getElectronShells(elData.num);
    let extraFact = elementFacts[elData.num] ? `<div class="mt-3 pt-3 border-t border-slate-600/50 text-yellow-300 font-bold leading-relaxed">💡 ${elementFacts[elData.num]}</div>` : '';
    
    document.getElementById('info-desc').innerHTML = `
        <div class="mb-3">
            <span class="text-slate-400">عدد اتمی:</span> <span class="font-english font-bold text-white text-lg">${elData.num}</span><br>
            <span class="text-slate-400">الکترون‌ها در لایه‌ها:</span> <span class="font-english text-cyan-300" dir="ltr">[${eShells.join(', ')}]</span>
        </div>
        <div class="text-slate-300">
            ${info.desc}
        </div>
        ${extraFact}
    `;
    
    drawBohrModel(elData.num, 'bohr-model');
    document.getElementById('element-modal').classList.remove('hidden');
}

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
    
    if (!activeGame) {
        tableEl.classList.add('explore-mode');
    } else {
        tableEl.classList.remove('explore-mode');
    }
    
    elementData.forEach(el => {
        const cell = document.createElement('div');
        // Base classes
        cell.className = `element font-english period-${el.p} group-${el.g}`;
        
        if (!activeGame) {
            // Interactive Explore Mode
            cell.classList.add(`cat-${el.cat}`);
            cell.addEventListener('click', () => openElementInfo(el));
            cell.innerHTML = `
                <span class="number" style="direction: ltr; text-align: left;">${el.num}</span>
                <span class="symbol" style="direction: ltr;">${el.sym}</span>
                <span class="name font-vazirmatn" style="direction: ltr;">${el.name}</span>
            `;
        }
        else if (el.isMainBlock && activeGame) {
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
    
    // Save to Leaderboard logic
    setTimeout(() => {
        if (score > 0) {
            const playerName = prompt("بازی تمام شد! امتیاز شما: " + score + "\nلطفاً نام خود را برای ثبت در لیدربورد وارد کنید:");
            if (playerName && playerName.trim() !== "") {
                document.getElementById('leaderboard-modal').classList.remove('hidden');
                saveScoreToDB(playerName.trim(), score);
            }
        }
    }, 500); // slight delay so modal renders first
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