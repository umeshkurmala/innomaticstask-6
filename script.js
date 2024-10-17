document.addEventListener('DOMContentLoaded', loadTasks);

const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filter-btn');
const dueDateInput = document.getElementById('due-date');
const prioritySelect = document.getElementById('priority');

addTaskBtn.addEventListener('click', addTask);
taskList.addEventListener('click', handleTaskActions);
filterButtons.forEach(btn => btn.addEventListener('click', filterTasks));

// Add Task
function addTask() {
  const taskText = taskInput.value;
  const dueDate = dueDateInput.value;
  const priority = prioritySelect.value;

  if (taskText === '') return;

  const task = {
    text: taskText,
    completed: false,
    dueDate: dueDate,
    priority: priority
  };

  saveTask(task);
  renderTask(task);

  taskInput.value = '';
  dueDateInput.value = '';
}

// Render Task
function renderTask(task) {
  const taskItem = document.createElement('li');
  taskItem.classList.add('task');
  if (task.completed) taskItem.classList.add('completed');

  taskItem.innerHTML = `
    <span>${task.text}</span>
    <span class="due-date">${task.dueDate || ''}</span>
    <span class="priority-${task.priority}">${task.priority}</span>
    <button class="complete-btn">✔️</button>
    <button class="delete-btn">❌</button>
  `;

  taskList.appendChild(taskItem);
}

// Handle Task Actions (Complete/Delete)
function handleTaskActions(e) {
  if (e.target.classList.contains('delete-btn')) {
    const taskItem = e.target.parentElement;
    removeTask(taskItem);
    taskItem.remove();
  }

  if (e.target.classList.contains('complete-btn')) {
    const taskItem = e.target.parentElement;
    taskItem.classList.toggle('completed');
    toggleTaskCompletion(taskItem);
  }
}

// Filter Tasks
function filterTasks(e) {
  const filter = e.target.dataset.filter;

  filterButtons.forEach(btn => btn.classList.remove('active'));
  e.target.classList.add('active');

  const tasks = taskList.childNodes;
  tasks.forEach(task => {
    switch (filter) {
      case 'all':
        task.style.display = 'flex';
        break;
      case 'completed':
        if (task.classList.contains('completed')) {
          task.style.display = 'flex';
        } else {
          task.style.display = 'none';
        }
        break;
      case 'pending':
        if (!task.classList.contains('completed')) {
          task.style.display = 'flex';
        } else {
          task.style.display = 'none';
        }
        break;
    }
  });
}

// LocalStorage Functions
function saveTask(task) {
  let tasks = getTasks();
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasks() {
  return localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
}

function loadTasks() {
  let tasks = getTasks();
  tasks.forEach(task => renderTask(task));
}

function removeTask(taskItem) {
  let tasks = getTasks();
  const taskText = taskItem.firstChild.textContent;
  tasks = tasks.filter(task => task.text !== taskText);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function toggleTaskCompletion(taskItem) {
  let tasks = getTasks();
  const taskText = taskItem.firstChild.textContent;
  tasks = tasks.map(task => {
    if (task.text === taskText) {
      task.completed = !task.completed;
    }
    return task;
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
