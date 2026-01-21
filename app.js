/**
 * بوابة المهندس الأكاديمية - المحرك المتكامل (v3.0)
 * نظام إدارة الأداء، المهام، وحساب المعدلات التلقائي
 */

// 1. إدارة البيانات (Storage Management)
let db = JSON.parse(localStorage.getItem('engineer_pro_db')) || [];
let activeSem = null;
let activeCourse = null;

// 2. دوال الحفظ والتحديث (Core Core Logic)
const saveDB = () => {
    localStorage.setItem('engineer_pro_db', JSON.stringify(db));
    render(); 
};

// 3. التنقل بين الواجهات (Navigation Engine)
const showView = (viewFunc) => {
    const mainContent = document.getElementById('main-content');
    mainContent.classList.add('opacity-0'); // أنيميشن خروج ناعم
    setTimeout(() => {
        viewFunc();
        mainContent.classList.remove('opacity-0');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
};

const toggleForm = (id) => {
    const el = document.getElementById(id);
    el.classList.toggle('hidden');
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

// 4. منطق الأترام والمواد (Semesters & Courses)
const addSemester = () => {
    const input = document.getElementById('sem-input');
    if (input.value.trim()) {
        db.push({ name: input.value, courses: [] });
        input.value = '';
        saveDB();
    }
};

const addCourse = (sIdx) => {
    const name = prompt("ما هو اسم المادة الجديدة؟");
    if (name) {
        db[sIdx].courses.push({ name, syllabus: [], tasks: [] });
        saveDB();
    }
};

// 5. منطق الدرجات والمهام (Syllabus & Tasks)
const addCategory = () => {
    const n = document.getElementById('cat-name').value;
    const w = parseFloat(document.getElementById('cat-weight').value);
    if (n && !isNaN(w)) {
        db[activeSem].courses[activeCourse].syllabus.push({ name: n, weight: w, marks: [] });
        saveDB();
        showView(renderCourseDetails);
    }
};

const addMark = (catIdx) => {
    const score = parseFloat(prompt("الدرجة التي حصلت عليها:"));
    const max = parseFloat(prompt("من كم؟ (الدرجة العظمى):", "100"));
    if (!isNaN(score)) {
        db[activeSem].courses[activeCourse].syllabus[catIdx].marks.push({ score, max });
        saveDB();
        showView(renderCourseDetails);
    }
};

const addTask = () => {
    const taskInput = document.getElementById('task-input');
    if (taskInput.value.trim()) {
        db[activeSem].courses[activeCourse].tasks.push({ text: taskInput.value, done: false });
        taskInput.value = '';
        saveDB();
        showView(renderCourseDetails);
    }
};

const toggleTask = (tIdx) => {
    db[activeSem].courses[activeCourse].tasks[tIdx].done = !db[activeSem].courses[activeCourse].tasks[tIdx].done;
    saveDB();
    showView(renderCourseDetails);
};

// 6. دوال الرسم والواجهات (Rendering UI)

// --- واجهة الأترام الرئيسية ---
const render = () => {
    const mainContent = document.getElementById('main-content');
    if (db.length === 0) {
        mainContent.innerHTML = `
            <div class="glass-card p-20 text-center space-y-8 animate-fade-in">
                <div class="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <i class="fa-solid fa-layer-group text-4xl text-indigo-500"></i>
                </div>
                <div>
                    <h2 class="text-2xl font-black italic">أهلاً بك أيها المبدع</h2>
                    <p class="text-white/30 text-sm mt-2">ابدأ بتنظيم رحلتك الأكاديمية بإضافة أول ترم دراسي</p>
                </div>
                <button onclick="toggleForm('sem-form')" class="btn-grad text-xs px-10">إضافة ترم دراسي</button>
                <div id="sem-form" class="hidden glass-card p-6 mt-6 border-indigo-500/20">
                    <input type="text" id="sem-input" class="input-field w-full mb-4" placeholder="مثلاً: خريف 2026">
                    <button onclick="addSemester()" class="btn-grad w-full py-3">تأكيد الحفظ</button>
                </div>
            </div>
        `;
        return;
    }

    mainContent.innerHTML = `
        <div class="grid gap-10">
            ${db.map((sem, sIdx) => `
                <div class="glass-card p-8 space-y-6 border-white/5">
                    <div class="flex justify-between items-center border-b border-white/5 pb-6">
                        <h3 class="text-3xl font-black italic tracking-tighter text-white/90">${sem.name}</h3>
                        <button onclick="addCourse(${sIdx})" class="px-5 py-2 rounded-full bg-indigo-500/5 text-indigo-400 font-black text-[10px] hover:bg-indigo-500 hover:text-white transition-all">+ مادة</button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${sem.courses.map((c, cIdx) => `
                            <div onclick="activeSem=${sIdx}; activeCourse=${cIdx}; showView(renderCourseDetails)" 
                                 class="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/[0.03] cursor-pointer transition-all group relative overflow-hidden">
                                <span class="text-lg font-black block">${c.name}</span>
                                <span class="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mt-2 block">فتح الملف الأكاديمي</span>
                                <i class="fa-solid fa-arrow-left absolute left-6 bottom-6 opacity-0 group-hover:opacity-100 group-hover:-translate-x-2 transition-all text-xs"></i>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
            <button onclick="toggleForm('sem-form')" class="w-full py-10 rounded-[2.5rem] border-2 border-dashed border-white/10 text-white/20 hover:border-indigo-500/40 hover:text-indigo-400 transition-all font-black text-sm uppercase tracking-widest">
                + إضافة ترم جديد
            </button>
            <div id="sem-form" class="hidden glass-card p-8 border-indigo-500/20">
                <input type="text" id="sem-input" class="input-field w-full mb-4" placeholder="اسم الترم الدراسي">
                <button onclick="addSemester()" class="btn-grad w-full py-4">حفظ الترم</button>
            </div>
        </div>
    `;
};

// --- واجهة تفاصيل المادة (The Master Course View) ---
const renderCourseDetails = () => {
    const course = db[activeSem].courses[activeCourse];
    const mainContent = document.getElementById('main-content');
    
    // حساب المعدل
    let totalGrade = 0;
    course.syllabus.forEach(cat => {
        if (cat.marks.length > 0) {
            let avg = cat.marks.reduce((a, b) => a + (b.score / b.max), 0) / cat.marks.length;
            totalGrade += (avg * cat.weight);
        }
    });

    mainContent.innerHTML = `
        <div class="space-y-8 animate-fade-in">
            <div class="flex justify-between items-center bg-white/5 p-4 rounded-3xl border border-white/5">
                <button onclick="showView(render)" class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
                    <i class="fa-solid fa-arrow-right"></i>
                </button>
                <div class="text-center">
                    <h2 class="text-2xl font-black italic">${course.name}</h2>
                    <p class="text-[9px] text-indigo-400 font-bold tracking-widest uppercase">Course Performance Dashboard</p>
                </div>
                <div class="text-2xl font-black italic btn-grad px-6 py-2 rounded-2xl shadow-lg shadow-indigo-500/20">
                    ${totalGrade.toFixed(1)}%
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${course.syllabus.map((cat, idx) => `
                            <div class="glass-card p-6 border-white/5 space-y-4">
                                <div class="flex justify-between items-center">
                                    <div>
                                        <h4 class="font-black text-md">${cat.name}</h4>
                                        <span class="text-[9px] text-indigo-400 font-bold uppercase tracking-widest">${cat.weight}% Weight</span>
                                    </div>
                                    <button onclick="addMark(${idx})" class="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                                        <i class="fa-solid fa-plus text-xs"></i>
                                    </button>
                                </div>
                                <div class="space-y-2">
                                    ${cat.marks.map(m => `
                                        <div class="flex justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[10px]">
                                            <span class="text-white/40 font-bold italic tracking-tighter uppercase">Mark Entry</span>
                                            <span class="font-black text-indigo-400">${m.score} / ${m.max}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <button onclick="toggleForm('cat-form')" class="w-full py-6 rounded-3xl border-2 border-dashed border-white/5 text-white/20 hover:text-indigo-400 font-bold text-xs">+ إضافة قسم للسيلبس</button>
                    <div id="cat-form" class="hidden glass-card p-6 border-indigo-500/20 space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <input type="text" id="cat-name" class="input-field" placeholder="اسم القسم">
                            <input type="number" id="cat-weight" class="input-field" placeholder="الوزن %">
                        </div>
                        <button onclick="addCategory()" class="btn-grad w-full py-3">حفظ القسم</button>
                    </div>
                </div>

                <div class="glass-card p-8 space-y-6 border-pink-500/10">
                    <h3 class="text-xs font-black text-pink-500 uppercase tracking-widest flex items-center gap-2 italic">
                        <i class="fa-solid fa-fire-flame-curved"></i> قائمة المهام
                    </h3>
                    <div class="space-y-4">
                        ${course.tasks.map((t, i) => `
                            <div class="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 ${t.done ? 'opacity-40 line-through' : ''}">
                                <div onclick="toggleTask(${i})" class="w-6 h-6 rounded-lg border border-white/20 flex items-center justify-center cursor-pointer hover:border-indigo-500 transition-all">
                                    ${t.done ? '<i class="fa-solid fa-check text-[10px] text-indigo-500"></i>' : ''}
                                </div>
                                <span class="text-xs font-bold text-white/80">${t.text}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="pt-4 border-t border-white/5 space-y-3">
                        <input type="text" id="task-input" class="input-field w-full text-xs" placeholder="اكتب مهمة جديدة...">
                        <button onclick="addTask()" class="w-full py-3 rounded-xl bg-pink-600/10 text-pink-500 font-black text-[10px] uppercase hover:bg-pink-600 hover:text-white transition-all">إضافة للمسودة</button>
                    </div>
                </div>
            </div>
        </div>
    `;
};

// تشغيل المحرك الرئيسي
render();
