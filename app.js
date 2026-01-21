/* ================= SAFE STORAGE ================= */
let safeDB = [];
try {
    safeDB = JSON.parse(localStorage.getItem("creators_engine_v41")) || [];
} catch {
    safeDB = [];
}

let state = {
    db: safeDB,
    sem: null,
    course: null
};

const save = () =>
    localStorage.setItem("creators_engine_v41", JSON.stringify(state.db));

const toggle = id =>
    document.getElementById(id).classList.toggle("hidden");

/* ================= SEMESTERS ================= */
function addSemester() {
    const name = semName.value.trim();
    if (!name) return alert("أدخل اسم الترم");

    state.db.push({ name, courses: [] });
    semName.value = "";
    toggle("semForm");
    save();
    renderHome();
}

function renderHome() {
    semesterList.innerHTML = "";
    state.db.forEach((s, i) => {
        semesterList.innerHTML += `
        <div class="glass space-y-4">
            <div class="flex justify-between">
                <h3 class="font-black text-xl">${s.name}</h3>
                <button onclick="addCourse(${i})" class="text-indigo-400 text-sm">+ مادة</button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                ${s.courses.map((c,j)=>`
                <div onclick="openCourse(${i},${j})"
                     class="p-4 rounded-xl bg-white/5 hover:bg-indigo-500/10 cursor-pointer">
                    ${c.name}
                </div>
                `).join("")}
            </div>
        </div>`;
    });
}

/* ================= COURSES ================= */
function addCourse(i) {
    const name = prompt("اسم المادة");
    if (!name) return;

    state.db[i].courses.push({ name, categories: [] });
    save();
    renderHome();
}

function openCourse(s, c) {
    state.sem = s;
    state.course = c;
    homeView.classList.add("hidden");
    courseView.classList.remove("hidden");
    renderCourse();
}

function goHome() {
    courseView.classList.add("hidden");
    homeView.classList.remove("hidden");
    renderHome();
}

/* ================= CATEGORIES ================= */
function addCategory() {
    const name = catName.value.trim();
    const weight = Number(catWeight.value);

    if (!name || weight <= 0) return alert("بيانات غير صحيحة");

    const course = state.db[state.sem].courses[state.course];
    const used = course.categories.reduce((a,c)=>a+c.weight,0);

    if (used + weight > 100)
        return alert("مجموع الأوزان لا يتجاوز 100%");

    course.categories.push({ name, weight, items: [] });
    catName.value = "";
    catWeight.value = "";
    save();
    renderCourse();
}

/* ================= ITEMS ================= */
function addItem(i) {
    const name = prompt("اسم المهمة");
    const score = Number(prompt("درجتك"));
    const max = Number(prompt("من كم"));

    if (!name || isNaN(score) || isNaN(max)) return;

    state.db[state.sem].courses[state.course]
        .categories[i].items.push({ name, score, max });

    save();
    renderCourse();
}

/* ================= RENDER COURSE ================= */
function renderCourse() {
    const course = state.db[state.sem].courses[state.course];
    courseTitle.innerText = course.name;

    let total = 0;
    let used = 0;
    categoryList.innerHTML = "";

    course.categories.forEach((cat,i)=>{
        used += cat.weight;

        let score = 0, max = 0;
        cat.items.forEach(it => {
            score += it.score;
            max += it.max;
        });

        const avg = max ? (score / max) * cat.weight : 0;
        total += avg;

        categoryList.innerHTML += `
        <div class="glass space-y-3">
            <div class="flex justify-between">
                <h4 class="font-black">${cat.name}</h4>
                <span class="text-indigo-400 text-xs">${cat.weight}%</span>
            </div>
            <button onclick="addItem(${i})"
                    class="btn-primary w-full">
                إضافة درجة
            </button>
            ${cat.items.map(it=>`
                <div class="flex justify-between text-sm bg-white/5 p-3 rounded-xl">
                    <span>${it.name}</span>
                    <span>${it.score}/${it.max}</span>
                </div>
            `).join("")}
        </div>`;
    });

    finalScore.innerText = total.toFixed(1) + "%";
    weightInfo.innerText = `المستخدم ${used}% من السيلبس`;
}

/* INIT */
renderHome();
