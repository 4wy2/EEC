document.addEventListener('DOMContentLoaded', () => {
    let state = JSON.parse(localStorage.getItem('creators_pro_db')) || [];
    let activeView = 'home'; 
    let activeS = null, activeC = null;

    const save = () => { localStorage.setItem('creators_pro_db', JSON.stringify(state)); render(); };

    // نظام المودال الزجاجي (Modal System)
    const showModal = (title, bodyHTML, onConfirm) => {
        document.getElementById('modal-title').innerText = title;
        document.getElementById('modal-body').innerHTML = bodyHTML;
        document.getElementById('modal').style.display = 'flex';
        document.getElementById('modal-confirm').onclick = () => { onConfirm(); closeModal(); };
    };

    window.closeModal = () => document.getElementById('modal').style.display = 'none';

    const render = () => {
        const container = document.getElementById('app-content');
        
        if (activeView === 'home') {
            container.innerHTML = `
                <div class="space-y-8 animate-in">
                    <div class="flex justify-between items-center">
                        <h2 class="text-2xl font-black italic">الأترام الدراسية</h2>
                        <button onclick="addSemUI()" class="btn-grad text-xs px-6">+ ترم جديد</button>
                    </div>
                    <div class="grid gap-6">
                        ${state.length === 0 ? `
                            <div class="glass-card p-20 text-center opacity-40 border-dashed border-2">
                                <i class="fa-solid fa-folder-plus text-4xl mb-4"></i>
                                <p>لا توجد بيانات، أضف أول ترم لك</p>
                            </div>` : 
                        state.map((s, si) => `
                            <div class="glass-card p-6 space-y-6">
                                <div class="flex justify-between items-center border-b border-white/5 pb-4">
                                    <span class="font-black text-lg text-indigo-300">${s.name}</span>
                                    <button onclick="addCourseUI(${si})" class="text-[10px] text-white/30 hover:text-white transition-all">+ مادة</button>
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    ${s.courses.map((c, ci) => `
                                        <div onclick="openCourse(${si}, ${ci})" class="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex justify-between items-center hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all cursor-pointer">
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
            
            // حساب الدرجة النهائية
            let totalGrade = 0;
            course.syllabus.forEach(cat => {
                if(cat.marks.length) {
                    let avg = cat.marks.reduce((a,b)=>a+(b.s/b.m),0)/cat.marks.length;
                    totalGrade += (avg * cat.w);
                }
            });

            container.innerHTML = `
                <div class="space-y-8 animate-in">
                    <div class="flex justify-between items-center">
                        <button onclick="goHome()" class="text-white/20 text-xs font-bold hover:text-white transition-all">
                            <i class="fa-solid fa-arrow-right ml-2"></i> العودة
                        </button>
                        <h3 class="text-sm font-black text-indigo-400 italic">${course.name}</h3>
                    </div>
                    
                    <div class="glass-card p-12 text-center relative overflow-hidden">
                        <h2 class="text-7xl md:text-8xl font-black italic tracking-tighter text-white">${totalGrade.toFixed(1)}%</h2>
                        <div class="absolute inset-0 bg-gradient-to-t from-indigo-500/10 to-transparent -z-10"></div>
                    </div>

                    <div class="grid grid-cols-3 gap-3">
                        ${['ميد', 'ميجر', 'فاينل'].map(type => `
                            <button onclick="quickAdd('${type}')" class="p-5 rounded-[1.5rem] bg-white/[0.03] border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all group">
                                <p class="text-[10px] font-black text-white/40 group-hover:text-indigo-400 mb-2 uppercase tracking-widest">${type}</p>
                                <i class="fa-solid fa-bolt-lightning text-indigo-500"></i>
                            </button>
                        `).join('')}
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        ${course.syllabus.map((cat, ci) => `
                            <div class="glass-card p-6 space-y-4 border-white/5">
                                <div class="flex justify-between items-center">
                                    <div>
                                        <h4 class="font-bold text-sm">${cat.name}</h4>
                                        <span class="text-[9px] text-indigo-400 font-bold uppercase tracking-widest">${cat.w}% Weight</span>
                                    </div>
                                    <button onclick="addMarkUI(${ci})" class="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all">+</button>
                                </div>
                                <div class="space-y-2">
                                    ${cat.marks.map((m, mi) => `
                                        <div class="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                            <span class="text-[9px] text-white/20 font-bold uppercase tracking-tighter">Grade</span>
                                            <span class="text-xs font-black">${m.s} / ${m.m}</span>
                                            <button onclick="deleteMark(${ci}, ${mi})" class="text-red-500/20 hover:text-red-500 transition-colors"><i class="fa-solid fa-trash-can text-[10px]"></i></button>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <button onclick="addCatUI()" class="w-full py-6 rounded-3xl border-2 border-dashed border-white/10 text-white/20 text-xs font-bold hover:text-indigo-400 hover:border-indigo-400/50 transition-all">
                        + إضافة قسم مخصص (كويز، مشاركة..)
                    </button>
                </div>`;
        }
    };

    // منطق الإدخال السريع (هنا الإبداع!)
    window.quickAdd = (type) => {
        showModal(`إدخال سريع: ${type}`, `
            <div class="space-y-4">
                <input type="number" id="q-w" placeholder="الوزن من 100 (مثلاً: 20)">
                <input type="number" id="q-s" placeholder="درجتك المحققة">
                <input type="number" id="q-m" placeholder="الدرجة الكاملة (مثلاً: 100)">
            </div>
        `, () => {
            const w = document.getElementById('q-w').value;
            const s = document.getElementById('q-s').value;
            const m = document.getElementById('q-m').value;
            if(w && s && m) {
                state[activeS].courses[activeC].syllabus.push({
                    name: type,
                    w: parseFloat(w),
                    marks: [{ s: parseFloat(s), m: parseFloat(m) }]
                });
                save();
            }
        });
    };

    // الأكواد المتبقية للإدارة
    window.addSemUI = () => {
        showModal('إضافة ترم جديد', `<input type="text" id="sem-n" placeholder="اسم الترم الدراسي...">`, () => {
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
        showModal('إضافة قسم مخصص', `<input type="text" id="cat-n" placeholder="مثلاً: كويزات"><input type="number" id="cat-w" placeholder="الوزن %">`, () => {
            const n = document.getElementById('cat-n').value;
            const w = document.getElementById('cat-w').value;
            if(n && w) { state[activeS].courses[activeC].syllabus.push({name: n, w: parseFloat(w), marks: []}); save(); }
        });
    };

    window.addMarkUI = (ci) => {
        showModal('إضافة درجة جديدة', `<input type="number" id="m-s" placeholder="الدرجة"><input type="number" id="m-m" placeholder="من كم؟">`, () => {
            const s = document.getElementById('m-s').value;
            const m = document.getElementById('m-m').value;
            if(s && m) { state[activeS].courses[activeC].syllabus[ci].marks.push({s: parseFloat(s), m: parseFloat(m)}); save(); }
        });
    };

    window.deleteMark = (ci, mi) => { state[activeS].courses[activeC].syllabus[ci].marks.splice(mi, 1); save(); };
    window.openCourse = (si, ci) => { activeS = si; activeC = ci; activeView = 'details'; render(); };
    window.goHome = () => { activeView = 'home'; render(); };

    render();
});
