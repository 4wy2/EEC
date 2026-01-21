document.addEventListener('DOMContentLoaded', () => {
    let state = JSON.parse(localStorage.getItem('creators_pro_db')) || [];
    let activeView = 'home'; 
    let activeS = null, activeC = null;

    const save = () => { localStorage.setItem('creators_pro_db', JSON.stringify(state)); render(); };

    // نظام المودال بدلاً من الـ prompt
    const showModal = (title, bodyHTML, onConfirm) => {
        document.getElementById('modal-title').innerText = title;
        document.getElementById('modal-body').innerHTML = bodyHTML;
        document.getElementById('modal').style.display = 'flex';
        document.getElementById('modal-confirm').onclick = () => { onConfirm(); closeModal(); };
    };

    window.closeModal = () => document.getElementById('modal').style.display = 'none';

    // الدوال الأساسية
    const render = () => {
        const container = document.getElementById('app-content');
        
        if (activeView === 'home') {
            container.innerHTML = `
                <div class="space-y-8 animate-in">
                    <div class="flex justify-between items-center">
                        <h2 class="text-2xl font-black italic">الأورام الدراسية</h2>
                        <button onclick="addSemUI()" class="btn-grad text-xs">+ إضافة ترم</button>
                    </div>
                    <div class="grid gap-6">
                        ${state.map((s, si) => `
                            <div class="glass-card p-6 space-y-6">
                                <div class="flex justify-between items-center border-b border-white/5 pb-4">
                                    <span class="font-black text-lg text-indigo-300">${s.name}</span>
                                    <button onclick="addCourseUI(${si})" class="text-[10px] text-white/30 hover:text-white transition-all">+ إضافة مادة</button>
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    ${s.courses.map((c, ci) => `
                                        <div onclick="openCourse(${si}, ${ci})" class="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex justify-between items-center hover:bg-white/[0.05] transition-all">
                                            <span class="font-bold text-sm text-white/80">${c.name}</span>
                                            <i class="fa-solid fa-chevron-left text-[10px] text-indigo-500"></i>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>`;
        } else {
            const course = state[activeS].courses[activeC];
            let grade = 0;
            course.syllabus.forEach(cat => {
                if(cat.marks.length) {
                    let avg = cat.marks.reduce((a,b)=>a+(b.s/b.m),0)/cat.marks.length;
                    grade += (avg * cat.w);
                }
            });

            container.innerHTML = `
                <div class="space-y-8 animate-in">
                    <button onclick="goHome()" class="text-white/20 text-xs font-bold italic hover:text-white">
                        <i class="fa-solid fa-arrow-right ml-2"></i> العودة للرئيسية
                    </button>
                    
                    <div class="glass-card p-10 text-center relative overflow-hidden">
                        <h2 class="text-7xl font-black italic">${grade.toFixed(1)}%</h2>
                        <p class="text-indigo-400 font-bold uppercase tracking-widest text-xs mt-4">${course.name}</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        ${course.syllabus.map((cat, ci) => `
                            <div class="glass-card p-6 space-y-4">
                                <div class="flex justify-between items-center">
                                    <span class="font-bold text-sm">${cat.name} (${cat.w}%)</span>
                                    <button onclick="addMarkUI(${ci})" class="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-xs">+</button>
                                </div>
                                <div class="space-y-2">
                                    ${cat.marks.map(m => `<div class="flex justify-between text-[10px] text-white/20"><span>مدخل</span><span>${m.s}/${m.m}</span></div>`).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <button onclick="addCatUI()" class="w-full py-5 rounded-3xl border-2 border-dashed border-white/5 text-white/20 text-xs font-bold">+ إضافة قسم للسيلبس</button>
                </div>`;
        }
    };

    // دوال الربط مع المودال
    window.addSemUI = () => {
        showModal('إضافة ترم جديد', `<input type="text" id="sem-n" placeholder="اسم الترم...">`, () => {
            const val = document.getElementById('sem-n').value;
            if(val) { state.push({name: val, courses: []}); save(); }
        });
    };

    window.addCourseUI = (si) => {
        showModal('إضافة مادة', `<input type="text" id="crs-n" placeholder="اسم المادة...">`, () => {
            const val = document.getElementById('crs-n').value;
            if(val) { state[si].courses.push({name: val, syllabus: [], tasks: []}); save(); }
        });
    };

    window.addCatUI = () => {
        showModal('إضافة قسم جديد', `<input type="text" id="cat-n" placeholder="اسم القسم (ميدترم..)"><input type="number" id="cat-w" placeholder="الوزن %">`, () => {
            const n = document.getElementById('cat-n').value;
            const w = document.getElementById('cat-w').value;
            if(n && w) { state[activeS].courses[activeC].syllabus.push({name: n, w: parseFloat(w), marks: []}); save(); }
        });
    };

    window.addMarkUI = (ci) => {
        showModal('إضافة درجة', `<input type="number" id="m-s" placeholder="الدرجة المحققة"><input type="number" id="m-m" placeholder="الدرجة الكاملة">`, () => {
            const s = document.getElementById('m-s').value;
            const m = document.getElementById('m-m').value;
            if(s && m) { state[activeS].courses[activeC].syllabus[ci].marks.push({s: parseFloat(s), m: parseFloat(m)}); save(); }
        });
    };

    window.openCourse = (si, ci) => { activeS = si; activeC = ci; activeView = 'details'; render(); };
    window.goHome = () => { activeView = 'home'; render(); };

    render();
});
