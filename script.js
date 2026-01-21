let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

const list = document.getElementById("taskList");

function save() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function setFilter(f) {
    filter = f;
    renderTasks();
}

function addTask() {
    const input = document.getElementById("taskInput");
    if (!input.value.trim()) return;

    tasks.push({
        text: input.value,
        done: false,
        id: Date.now()
    });

    input.value = "";
    save();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    save();
    renderTasks();
}

function toggleDone(id) {
    const task = tasks.find(t => t.id === id);
    task.done = !task.done;
    save();
    renderTasks();
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    const newText = prompt("عدل المهمة:", task.text);
    if (newText) {
        task.text = newText;
        save();
        renderTasks();
    }
}

function renderTasks() {
    const search = document.getElementById("search").value.toLowerCase();
    list.innerHTML = "";

    tasks
        .filter(t =>
            (filter === "all") ||
            (filter === "done" && t.done) ||
            (filter === "todo" && !t.done)
        )
        .filter(t => t.text.toLowerCase().includes(search))
        .forEach(task => {
            const li = document.createElement("li");
            li.draggable = true;
            li.dataset.id = task.id;
            li.className = task.done ? "done" : "";

            li.innerHTML = `
                <span>${task.text}</span>
                <div class="task-actions">
                    <button onclick="toggleDone(${task.id})">✔</button>
                    <button onclick="editTask(${task.id})">✏</button>
                    <button onclick="deleteTask(${task.id})">🗑</button>
                </div>
            `;
            list.appendChild(li);
        });
}

document.getElementById("themeToggle").onclick = () => {
    document.body.classList.toggle("light");
};

let dragged;

list.addEventListener("dragstart", e => {
    dragged = e.target;
});

list.addEventListener("dragover", e => e.preventDefault());

list.addEventListener("drop", e => {
    if (e.target.tagName === "LI") {
        const from = dragged.dataset.id;
        const to = e.target.dataset.id;

        const fromIndex = tasks.findIndex(t => t.id == from);
        const toIndex = tasks.findIndex(t => t.id == to);

        tasks.splice(toIndex, 0, tasks.splice(fromIndex, 1)[0]);
        save();
        renderTasks();
    }
});

renderTasks();
