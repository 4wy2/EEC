/**
 * THE CREATORS ENGINE v4.0 - PROFESSIONAL EDITION
 * نظام إدارة الأداء الأكاديمي المتقدم
 */

// 1. الحالة العامة للتطبيق (State)
let state = {
    db: JSON.parse(localStorage.getItem('creators_pro_v4')) || [],
    view: 'home', // home, course-details
    activeSemIdx: null,
    activeCourseIdx: null
};

// 2. محرك الحفظ والتحديث (Core Engine)
const commit = () => {
    localStorage.setItem('creators_pro_v4', JSON.stringify(state.db));
    render();
};

// 3. المكونات الذكية (Smart Components)

// مكوّن العداد الدائري (Progress Circle)
const ProgressCircle = (percent, size = 120) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;
    return `
        <div class="relative flex items-center justify-center" style="width: ${size}px; height: ${size}px">
            <svg class="transform -rotate-90 w-full h-full">
                <circle cx="50%" cy="50%" r="${radius}" stroke="rgba(255,255,255,0.05)" stroke-width="8" fill="transparent" />
                <circle cx="50%" cy="50%" r="${radius}" stroke="url(#gradientPrimary)" stroke-width="8" 
                    fill="transparent" stroke-dasharray="${circumference}" 
                    style="stroke-dashoffset: ${offset}; transition: stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)" 
                    stroke-linecap="round" />
            </svg>
            <span class="absolute text-xl font-black italic">${Math.round(percent)}%</span>
        </div>
    `;
};

// 4. منطق التحكم (Actions)
const Actions = {
    addSemester: () => {
        const name = prompt("أدخل مسمى الترم الدراسي (مثلاً: المستوى السابع):");
        if (name) {
            state.db.push({ name, courses: [] });
            commit();
        }
    },
    addCourse: (sIdx) => {
        const name = prompt("اسم المادة الجديدة:");
        if (name) {
            state.db[sIdx].courses.push({ name, syllabus: [], tasks: [] });
            commit();
        }
    },
    navigate: (view, sIdx = null, cIdx = null) => {
        const content = document.getElementById('app-content');
        content.style.opacity = '0';
        content.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            state.view = view;
            state.activeSemIdx = sIdx;
            state.activeCourseIdx = cIdx;
            render();
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
        }, 300);
    }
};

// 5. محرك الرندرة (Rendering Engine)
const render = () => {
    const container = document.getElementById('app-content');
    
    // واجهة القائمة الرئيسية (Home View)
    if (state.view === 'home') {
        container.innerHTML = `
            <div class="space-y-12 animate-fade-in">
                <div class="flex justify-between items-end">
                    <div>
                        <h2 class="text-3xl font-black italic">لوحة التحكم</h2>
                        <p class="text-white/30 text-xs font-bold uppercase tracking-widest mt-1">المسيرة الدراسية</p>
                    </div>
                    <button onclick="Actions.addSemester()" class="btn-gradient px-8 py-3 rounded-2xl text-[10px]">إضافة ترم جديد</button>
                </div>

                <div class="grid gap-10">
                    ${state.db.length === 0 ? `
                        <div class="glass-card p-20 text-center border-dashed border-2 border-white/5">
                            <i class="fa-solid fa-box-open text-5xl text-white/10 mb-6"></i>
                            <p class="text-white/20">لا يوجد بيانات حالياً، ابدأ ببناء مستقبلك.</p>
                        </div>
                    ` : state.db.map((sem, sIdx) => `
                        <div class="glass-card p-10 space-y-8 relative overflow-hidden group">
                            <div class="flex justify-between items-center relative z-10">
                                <h3 class="text-2xl font-black italic text-indigo-300">${sem.name}</h3>
                                <button onclick="Actions.addCourse(${sIdx})" class="btn-ghost text-[10px]">+ مادة</button>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                                ${sem.courses.map((c, cIdx) => `
                                    <div onclick="Actions.navigate('course-details', ${sIdx}, ${cIdx})" 
                                        class="p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all cursor-pointer group/card">
                                        <div class="flex justify-between items-start mb-4">
                                            <span class="font-black text-lg">${c.name}</span>
                                            <i class="fa-solid fa-arrow-up-right-from-square text-[10px] text-white/20 group-hover/card:text-indigo-400 transition-colors"></i>
                                        </div>
                                        <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div class="h-full bg-indigo-500" style="width: 45%"></div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } 
    
    // واجهة تفاصيل المادة (Course Details View)
    else if (state.view === 'course-details') {
        const course = state.db[state.activeSemIdx].courses[state.activeCourseIdx];
        
        // حساب الدرجة النهائية
        let finalGrade = 0;
        course.syllabus.forEach(cat => {
            if (cat.marks.length > 0) {
                let avg = cat.marks.reduce((a, b) => a + (b.score / b.max), 0) / cat.marks.length;
                finalGrade += (avg * cat.weight);
            }
        });

        container.innerHTML = `
            <div class="space-y-10 animate-fade-in">
                <button onclick="Actions.navigate('home')" class="btn-ghost text-xs"><i class="fa-solid fa-arrow-right ml-2"></i> العودة للرئيسية</button>
                
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div class="lg:col-span-2 glass-card p-12 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
                        <div class="relative z-10">
                            <h2 class="text-5xl font-black italic mb-2">${course.name}</h2>
                            <p class="text-white/40 font-bold uppercase tracking-[0.3em] text-[10px]">Current Academic Standing</p>
                            <div class="mt-8 flex gap-4">
                                <button onclick="addCategoryUI()" class="btn-gradient py-3 px-6 text-[10px]">تعديل السيلبس</button>
                            </div>
                        </div>
                        <div class="relative z-10">
                            ${ProgressCircle(finalGrade, 200)}
                        </div>
                        <div class="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-600/5 blur-[100px] rounded-full"></div>
                    </div>

                    <div class="glass-card p-8 border-pink-500/10">
                        <h3 class="text-xs font-black text-pink-500 uppercase tracking-widest mb-6">المهام القادمة</h3>
                        <div class="space-y-4" id="task-list">
                            ${course.tasks.length === 0 ? '<p class="text-white/10 text-center py-10 text-xs">لا يوجد مهام</p>' : ''}
                            ${course.tasks.map((t, idx) => `
                                <div class="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                                    <div class="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_10px_#ec4899]"></div>
                                    <span class="text-xs font-bold">${t.text}</span>
                                </div>
                            `).join('')}
                        </div>
                        <input type="text" id="new-task" onkeydown="if(event.key==='Enter')addTaskUI()" 
                            class="input-field w-full mt-6 text-xs" placeholder="+ إضافة مهمة سريعة">
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${course.syllabus.map((cat, idx) => `
                        <div class="glass-card p-8 space-y-6 group/item hover:border-indigo-500/30 transition-all">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h4 class="font-black text-lg">${cat.name}</h4>
                                    <span class="text-[10px] text-indigo-400 font-bold">${cat.weight}% من الإجمالي</span>
                                </div>
                                <button onclick="addMarkUI(${idx})" class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-indigo-500 transition-all">
                                    <i class="fa-solid fa-plus text-xs"></i>
                                </button>
                            </div>
                            <div class="space-y-2">
                                ${cat.marks.map(m => `
                                    <div class="flex justify-between p-3 bg-white/5 rounded-xl text-[10px] font-bold">
                                        <span class="text-white/30 uppercase">Entry</span>
                                        <span class="text-indigo-300">${m.score} / ${m.max}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
};

// 6. دوال الواجهة الإضافية (Helper UI Functions)
window.addCategoryUI = () => {
    const name = prompt("اسم القسم (ميد، كويز..):");
    const weight = prompt("وزن القسم من 100:");
    if(name && weight) {
        state.db[state.activeSemIdx].courses[state.activeCourseIdx].syllabus.push({
            name, weight: parseFloat(weight), marks: []
        });
        commit();
    }
};

window.addMarkUI = (idx) => {
    const score = prompt("الدرجة المحققة:");
    const max = prompt("الدرجة الكاملة:", "10");
    if(score) {
        state.db[state.activeSemIdx].courses[state.activeCourseIdx].syllabus[idx].marks.push({
            score: parseFloat(score), max: parseFloat(max)
        });
        commit();
    }
};

window.addTaskUI = () => {
    const input = document.getElementById('new-task');
    if(input.value) {
        state.db[state.activeSemIdx].courses[state.activeCourseIdx].tasks.push({ text: input.value, done: false });
        input.value = '';
        commit();
    }
};

// البداية
render();
