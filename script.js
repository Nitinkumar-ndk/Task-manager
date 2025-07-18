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

function addTask() {
  const input = document.getElementById('taskInput');
  const dateInput = document.getElementById('dueDateInput');
  const priorityInput = document.getElementById('priorityInput');
  const text = input.value.trim();
  const dueDate = dateInput.value;
  const priority = priorityInput.value;

  if (text === '') return;

  tasks.push({
    text,
    completed: false,
    dueDate,
    priority
  });

  input.value = '';
  dateInput.value = '';
  priorityInput.value = 'medium';

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

function editTask(index, newText) {
  tasks[index].text = newText;
  saveTasks();
  renderTasks();
}

function completeAll() {
  tasks.forEach(task => task.completed = true);
  saveTasks();
  renderTasks();
}

function clearCompleted() {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
}

function toggleDarkMode() {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
}

function loadDarkMode() {
  const enabled = localStorage.getItem('darkMode') === 'true';
  if (enabled) document.body.classList.add('dark');
}

function renderTasks() {
  const list = document.getElementById('taskList');
  const searchQuery = document.getElementById('searchInput')?.value?.toLowerCase() || '';
  list.innerHTML = '';

  tasks.forEach((task, index) => {
    const matchesFilter =
      currentFilter === 'all' ||
      (currentFilter === 'completed' && task.completed) ||
      (currentFilter === 'pending' && !task.completed);

    const matchesSearch = task.text.toLowerCase().includes(searchQuery);

    if (!matchesFilter || !matchesSearch) return;

    const li = document.createElement('li');
    li.className = `priority-${task.priority} ${task.completed ? 'completed' : ''}`;

    const header = document.createElement('div');
    header.className = 'task-header';

    const info = document.createElement('div');
    info.className = 'task-info';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.onchange = () => toggleComplete(index);

    const span = document.createElement('span');
    span.textContent = task.text;
    span.contentEditable = true;
    span.spellcheck = false;
    span.onblur = () => editTask(index, span.textContent);

    info.appendChild(checkbox);
    info.appendChild(span);
    header.appendChild(info);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteTask(index);

    header.appendChild(deleteBtn);

    li.appendChild(header);

    if (task.dueDate) {
      const due = document.createElement('small');
      due.textContent = `Due: ${task.dueDate}`;
      li.appendChild(due);
    }

    list.appendChild(li);
  });

  updateCount();
}

// Initialize
loadDarkMode();
renderTasks();
