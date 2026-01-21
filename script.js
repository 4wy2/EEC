:root {
    --bg: #0f172a;
    --card: #1e293b;
    --text: #fff;
    --accent: #22c55e;
}

.light {
    --bg: #f1f5f9;
    --card: #ffffff;
    --text: #0f172a;
}

body {
    background: var(--bg);
    color: var(--text);
    font-family: Arial;
    display: flex;
    justify-content: center;
    padding: 40px;
}

.app {
    width: 420px;
    background: var(--card);
    padding: 20px;
    border-radius: 15px;
}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.add-task {
    display: flex;
    gap: 10px;
    margin-top: 15px;
}

input {
    flex: 1;
    padding: 10px;
    border-radius: 8px;
    border: none;
}

button {
    padding: 10px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    background: var(--accent);
    color: black;
}

.filters {
    display: flex;
    justify-content: space-between;
    margin: 15px 0;
}

li {
    background: var(--bg);
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: grab;
}

.done span {
    text-decoration: line-through;
    opacity: 0.6;
}

.task-actions button {
    margin-left: 5px;
}
