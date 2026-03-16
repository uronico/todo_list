//API base URL
const API_URL = 'http://localhost:3000/api/tasks';

//DOM elements
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const addBtn = document.getElementById('addBtn');
const clearBtn = document.getElementById('clearBtn');
const completedCountEl = document.getElementById('completedCount');
const totalCountEl = document.getElementById('totalCount');

//Add task via API
async function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    try {
        const response = await fetch(API_URL, {  
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        if (response.ok) {
            taskInput.value = '';             
            loadTasks();                      
        }
    } catch (error) {
        console.error('Add task failed:', error);
    }
}

//Load all tasks from API
async function loadTasks() {
    try {
        const response = await fetch(API_URL);    
        const tasks = await response.json();
        renderTasks(tasks);                      
    } catch (error) {
        console.error('Load tasks failed:', error);
    }
}

//Render tasks to DOM
function renderTasks(tasks) {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        if (task.completed) li.classList.add('completed');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.onchange = () => toggleTask(task.id);

        const span = document.createElement('span');
        span.textContent = task.text;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '❌';
        deleteBtn.className = 'delete';
        deleteBtn.onclick = () => deleteTask(task.id);

        li.append(checkbox, span, deleteBtn);
        taskList.appendChild(li);
    });
    updateCounters(tasks);
}

//Toggle task status
async function toggleTask(id) {
    try {
        await fetch(`${API_URL}/${id}`, {    
            method: 'PUT'
        });
        loadTasks();
    } catch (error) {
        console.error('Toggle failed:', error);
    }
}

//Delete task
async function deleteTask(id) {
    try {
        await fetch(`${API_URL}/${id}`, {     
            method: 'DELETE'
        });
        loadTasks();
    } catch (error) {
        console.error('Delete failed:', error);
    }
}

//Update stats
function updateCounters(tasks) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    completedCountEl.textContent = completed;
    totalCountEl.textContent = total;
}

//= EVENT LISTENERS =
addBtn.onclick = addTask;
clearBtn.onclick = async () => {
    const tasks = await loadTasks();     
    loadTasks();
};

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

//Initialize app
taskInput.focus();
loadTasks();                              

console.log('Node.js To-Do App Connected!');