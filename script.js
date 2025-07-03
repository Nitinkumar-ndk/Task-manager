let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateCount() {
    const count = tasks.filter(task => !task.completed).length;
    document.getElementById('pendingCount').textContent = `Pending Tasks: ${count}`;
}

function setFilter(filter) {
    currentFilter = filter;
    renderTasks();
}

function renderTasks() {
    const list = document.getElementById('taskList');
    list.innerHTML = '';

    tasks.forEach((task, index) => {
        const shouldShow =
            currentFilter === 'all' ||
            (currentFilter === 'completed' && task.completed) ||
            (currentFilter === 'pending' && !task.completed);

        if (!shouldShow) return;

        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.onchange = () => toggleComplete(index);

        const span = document.createElement('span');
        span.textContent = task.text;

        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.onclick = () => deleteTask(index);

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(delBtn);
        list.appendChild(li);
    });

    updateCount();
}

function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();
    if (text === '') return;

    tasks.push({ text, completed: false });
    input.value = '';
    saveTasks();
    renderTasks();
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

renderTasks();
