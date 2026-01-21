document.addEventListener('DOMContentLoaded', () => {
    // استخدام مفتاح تخزين مختلف لضمان تحديث الجوال
    let state = JSON.parse(localStorage.getItem('student_tracker_v5')) || [];
    let activeView = 'home'; 
    let activeS = null, activeC = null;

    const save = () => { localStorage.setItem('student_tracker_v5', JSON.stringify(state)); render(); };

    const render = () => {
        const container = document.getElementById('app-content');
        
        if (activeView === 'home') {
            container.innerHTML = `
                <div class="space-y-6 animate-in">
                    <div class="flex justify-between items-center px-2">
                        <h2 class="text-2xl font-black italic">أهلاً أيها المهندس</h2>
                        <button onclick="addSem()" class="btn-grad text-[10px] px-4 py-2">ترم جديد</button>
                    </div>
                    <div class="grid gap-4">
                        ${state.map((s, si) => `
                            <div class="glass-card p-5 border-white/5">
                                <div class="flex justify-between items-center mb-4">
                                    <span class="font-bold text-indigo-400 text-sm">${s.name}</span>
                                    <button onclick="addCourse(${si})" class="text-[10px] bg-white/5 px-3 py-1 rounded-lg"> + مادة </button>
                                </div>
                                <div class="grid grid-cols-1 gap-3">
                                    ${s.courses.map((c, ci) => `
                                        <div onclick="openCourse(${si}, ${ci})" class="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex justify-between items-center active:scale-95 transition-transform">
                                            <span class="text-sm font-bold">${c.name}</span>
                                            <span class="text-[10px] text-white/30 tracking-tighter italic">عرض الدرجات</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>`;
        } else {
            const course = state[activeS].courses[activeC];
            
            // حساب الدرجات المكتسبة والوزن الإجمالي المدخل
            let earned = 0;
            let totalWeightInput = 0;
            course.syllabus.forEach(cat => {
                if(cat.marks.length) {
                    let avg = cat.marks.reduce((a,b)=>a+(b.s/b.m),0)/cat.marks.length;
                    earned += (avg * cat.w);
                    totalWeightInput += cat.w;
                }
            });

            container.innerHTML = `
                <div class="space-y-6 animate-in pb-20">
                    <div class="flex justify-between items-center">
                        <button onclick="goHome()" class="p-2 text-white/40"><i class="fa-solid fa-arrow-right"></i></button>
                        <h3 class="font-bold text-sm">${course.name}</h3>
                        <div class="w-10"></div>
                    </div>
                    
                    <div class="glass-card p-8 text-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                        <div class="text-6xl font-black italic text-white">${earned.toFixed(1)}</div>
                        <p class="text-[10px] text-white/40 mt-2 uppercase tracking-widest">مجموعك الحالي من ${totalWeightInput}%</p>
                        ${totalWeightInput < 100 ? `<p class="text-[9px] text-indigo-400 mt-1">باقي لك ${100 - totalWeightInput}% من الدرجات</p>` : ''}
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <button onclick="quickAdd('ميدترم')" class="p-4 glass-card border-indigo-500/20 text-center">
                            <span class="block text-[10px] font-bold text-indigo-400 mb-1">MIDTERM</span>
                            <span class="text-xs font-bold">إدخال الميد</span>
                        </button>
                        <button onclick="quickAdd('فاينل')" class="p-4 glass-card border-purple-500/20 text-center">
                            <span class="block text-[10px] font-bold text-purple-400 mb-1">FINAL</span>
                            <span class="text-xs font-bold">إدخال الفاينل</span>
                        </button>
                    </div>

                    <div class="space-y-4">
                        ${course.syllabus.map((cat, ci) => `
                            <div class="glass-card p-5 border-white/5">
                                <div class="flex justify-between items-center mb-3">
                                    <span class="text-xs font-bold">${cat.name} <span class="text-white/20">(${cat.w}%)</span></span>
                                    <button onclick="addMark(${ci})" class="text-[18px] text-indigo-500"> + </button>
                                </div>
                                <div class="space-y-2">
                                    ${cat.marks.map((m, mi) => `
                                        <div class="flex justify-between text-[11px] bg-white/5 p-2 rounded-lg">
                                            <span>الدرجة: ${m.s}/${m.m}</span>
                                            <button onclick="delMark(${ci}, ${mi})" class="text-red-500/30">حذف</button>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <button onclick="addCat()" class="w-full py-4 text-xs text-white/20 border-2 border-dashed border-white/5 rounded-2xl">+ إضافة قسم (كويزات، واجبات..)</button>
                </div>`;
        }
    };

    // وظائف الطالب (المبسطة)
    window.quickAdd = (type) => {
        let w = prompt(`وزن ${type} (مثلاً 20):`);
        let s = prompt(`درجتك في ${type}:`);
        let m = prompt(`الدرجة الكاملة للاختبار:`, "100");
        if(w && s) {
            state[activeS].courses[activeC].syllabus.push({ name: type, w: parseFloat(w), marks: [{ s: parseFloat(s), m: parseFloat(m) }] });
            save();
        }
    };

    window.addSem = () => { let n = prompt("اسم الترم:"); if(n) { state.push({name:n, courses:[]}); save(); } };
    window.addCourse = (si) => { let n = prompt("اسم المادة:"); if(n) { state[si].courses.push({name:n, syllabus:[], tasks:[]}); save(); } };
    window.addCat = () => { let n = prompt("القسم:"); let w = prompt("الوزن:"); if(n && w) { state[activeS].courses[activeC].syllabus.push({name:n, w:parseFloat(w), marks:[]}); save(); } };
    window.addMark = (ci) => { let s = prompt("الدرجة:"); let m = prompt("من كم؟"); if(s) { state[activeS].courses[activeC].syllabus[ci].marks.push({s:parseFloat(s), m:parseFloat(m)}); save(); } };
    window.delMark = (ci, mi) => { state[activeS].courses[activeC].syllabus[ci].marks.splice(mi, 1); save(); };
    window.openCourse = (si, ci) => { activeS = si; activeC = ci; activeView = 'details'; render(); };
    window.goHome = () => { activeView = 'home'; render(); };

    render();
});
