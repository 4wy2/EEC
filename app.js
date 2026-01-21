document.addEventListener('DOMContentLoaded', () => {
    let state = JSON.parse(localStorage.getItem('creators_pro_db')) || [];
    let activeView = 'home'; 
    let activeS = null, activeC = null;

    const save = () => { localStorage.setItem('creators_pro_db', JSON.stringify(state)); render(); };

    // نظام المودال الزجاجي
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
                        <button onclick="addSemUI()" class="btn-grad text-xs">+ إضافة ترم</button>
                    </div>
                    <div class="grid gap-6">
                        ${state.length === 0 ? '<p class="text-white/20 text-center py-10">لا توجد أترام، ابدأ بالإضاة..</p>' : 
                        state.map((s, si) => `
                            <div class="glass-card p-6 space-y-6">
                                <div class="flex justify-between items-center border-b border-white/5 pb-4">
                                    <span class="font-black text-lg text-indigo-300">${s.name}</span>
                                    <button onclick="addCourseUI(${si})" class="text-[10px] text-white/30 hover:text-white">+ إضافة مادة</button>
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
            
            // حساب الدرجة النهائية بدقة
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
                        <button onclick="goHome()" class="text-white/20 text-xs font-bold italic hover:text-white">
                            <i class="fa-solid fa-arrow-right ml-2"></i> العودة
                        </button>
                        <span class="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">${course.name}</span>
                    </div>
                    
                    <div class="glass-card p-10 text-center relative overflow-hidden">
                        <h2 class="text-7xl font-black italic text-gradient">${totalGrade.toFixed(1)}%</h2>
                        <p class="text-white/30 font-bold text-[10px] mt-4 tracking-widest uppercase">Academic Performance</p>
                    </div>

                    <div class="grid grid-cols-3 gap-3">
                        ${['ميد', 'ميجر', 'فاينل'].map(type => `
                            <button onclick="quickAdd('${type}')" class="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 hover:bg-indigo-500/20 transition-all text-center">
                                <p class="text-[10px] text-indigo-400 font-bold mb-1">${type}</p>
                                <i class="fa-solid fa-bolt-lightning text-xs text-white/40"></i>
                            </button>
                        `).join('')}
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        ${course.syllabus.map((cat, ci) => `
                            <div class="glass-card p-6 space-y-4 border-white/5 hover:border-indigo-500/30 transition-all">
                                <div class="flex justify-between items-center">
                                    <div>
                                        <h4 class="font-bold text-sm">${cat.name}</h4>
                                        <span class="text-[9px] text-indigo-400 font-bold">${cat.w}% من المادة</span>
                                    </div>
                                    <button onclick="addMarkUI(${ci})" class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs hover:bg-indigo-500">+</button>
                                </div>
                                <div class="space-y-2">
                                    ${cat.marks.map((m, mi) => `
                                        <div class="flex justify-between items-center p-2 rounded-xl bg-white/[0.02] border border-white/5">
                                            <span class="text-[9px] text-white/20 uppercase">درجة</span>
                                            <span class="text-[11px] font-bold">${m.s} / ${m.m}</span>
                                            <button onclick="deleteMark(${ci}, ${mi})" class="text-white/10 hover:text-red-500"><i class="fa-solid fa-trash-can text-[10px]"></i></button>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <button onclick="addCatUI()" class="w-full py-5 rounded-3xl border-2 border-dashed border-white/5 text-white/20 text-xs font-bold hover:border-indigo-500/20 hover:text-indigo-400 transition-all">
                        + إضافة قسم مخصص (كويز، واجب، الخ..)
                    </button>
                </div>`;
        }
    };

    // وظيفة الإدخال السريع اللي طلبتها
    window.quickAdd = (type) => {
        showModal(`إدخال سريع: ${type}`, `
            <input type="number" id="q-w" placeholder="وزن الـ ${type} في المادة (مثلاً 20)">
            <input type="number" id="q-s" placeholder="درجتك المحققة">
            <input type="number" id="q-m" placeholder="الدرجة الكاملة للاختبار">
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
        showModal('إضافة قسم مخصص', `<input type="text" id="cat-n" placeholder="اسم القسم (كويزات، واجبات..)"><input type="number" id="cat-w" placeholder="الوزن الإجمالي %">`, () => {
            const n = document.getElementById('cat-n').value;
            const w = document.getElementById('cat-w').value;
            if(n && w) { state[activeS].courses[activeC].syllabus.push({name: n, w: parseFloat(w), marks: []}); save(); }
        });
    };

    window.addMarkUI = (ci) => {
        showModal('إضافة درجة', `<input type="number" id="m-s" placeholder="الدرجة"><input type="number" id="m-m" placeholder="من كم؟">`, () => {
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
