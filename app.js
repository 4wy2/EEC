// 1. قاعدة البيانات (LocalStorage)
let db = JSON.parse(localStorage.getItem('engineer_db')) || [];

// 2. مراجع العناصر في HTML
const mainContent = document.getElementById('main-content');

// 3. دالة حفظ البيانات
const saveDB = () => {
    localStorage.setItem('engineer_db', JSON.stringify(db));
    render(); // إعادة رسم الواجهة عند كل تغيير
};

// 4. دالة التبديل بين الفورم والمحتوى
const toggleForm = (id) => {
    const el = document.getElementById(id);
    el.classList.toggle('hidden');
};

// 5. إضافة ترم دراسي جديد
const addSemester = () => {
    const name = document.getElementById('sem-name-input').value;
    if (name.trim()) {
        db.push({ name: name, courses: [] });
        saveDB();
    }
};

// 6. إضافة مادة داخل ترم معين
const addCourse = (semIndex) => {
    const courseName = prompt("أدخل اسم المادة الجديدة:"); // بنطورها لتكون Inline في الخطوة الجاية
    if (courseName) {
        db[semIndex].courses.push({
            name: courseName,
            syllabus: [],
            tasks: []
        });
        saveDB();
    }
};

// 7. رسم الواجهة (The Master Render)
const render = () => {
    if (db.length === 0) {
        mainContent.innerHTML = `
            <div class="glass-card p-16 text-center space-y-6">
                <i class="fa-solid fa-folder-open text-5xl text-indigo-500/30"></i>
                <p class="text-white/40 font-bold">لا توجد أترام دراسية حالياً، ابدأ بإضافة أول ترم لك.</p>
                <button onclick="toggleForm('sem-add-form')" class="btn-grad text-xs">إضافة ترم دراسي</button>
            </div>
            <div id="sem-add-form" class="hidden glass-card p-8 mt-6 animate-fade-in">
                <input type="text" id="sem-name-input" class="input-field w-full mb-4" placeholder="مثلاً: الفصل الأول 2026">
                <button onclick="addSemester()" class="btn-grad w-full">تأكيد الإضافة</button>
            </div>
        `;
        return;
    }

    mainContent.innerHTML = `
        <div class="grid gap-8">
            ${db.map((sem, sIdx) => `
                <div class="glass-card p-8 animate-fade-in">
                    <div class="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
                        <h3 class="text-2xl font-black italic tracking-tighter">${sem.name}</h3>
                        <button onclick="addCourse(${sIdx})" class="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-4 py-2 rounded-full hover:bg-indigo-500 hover:text-white transition-all">
                            + مادة جديدة
                        </button>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${sem.courses.map((course, cIdx) => `
                            <div class="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/40 cursor-pointer transition-all flex justify-between items-center group">
                                <div>
                                    <span class="font-bold block">${course.name}</span>
                                    <span class="text-[9px] text-white/20 uppercase tracking-widest">عرض التفاصيل</span>
                                </div>
                                <i class="fa-solid fa-chevron-left text-indigo-500 transform group-hover:-translate-x-2 transition-all"></i>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
            
            <button onclick="toggleForm('sem-add-form')" class="w-full py-6 rounded-[2rem] border-2 border-dashed border-white/5 text-white/20 hover:text-indigo-400 font-bold transition-all">
                + إضافة ترم دراسي آخر
            </button>
            <div id="sem-add-form" class="hidden glass-card p-8 mt-6">
                <input type="text" id="sem-name-input" class="input-field w-full mb-4" placeholder="اسم الترم الجديد">
                <button onclick="addSemester()" class="btn-grad w-full">حفظ</button>
            </div>
        </div>
    `;
};

// تشغيل المحرك لأول مرة
render();
