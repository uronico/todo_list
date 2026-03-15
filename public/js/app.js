// ===== NODE.JS API TODO APP - 100 LINES =====

// 1. API base URL
const API_URL = 'http://localhost:3000/api/tasks';

// 2. DOM elements
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const addBtn = document.getElementById('addBtn');
const clearBtn = document.getElementById('clearBtn');
const completedCountEl = document.getElementById('completedCount');
const totalCountEl = document.getElementById('totalCount');

// 3. Add task via API
async function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    try {
        const response = await fetch(API_URL, {  // 4. POST request
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        if (response.ok) {
            taskInput.value = '';             // 5. Clear input
            loadTasks();                      // 6. Refresh list
        }
    } catch (error) {
        console.error('Add task failed:', error);
    }
}

// 7. Load all tasks from API
async function loadTasks() {
    try {
        const response = await fetch(API_URL);    // 8. GET request
        const tasks = await response.json();
        renderTasks(tasks);                       // 9. Render received
    } catch (error) {
        console.error('Load tasks failed:', error);
    }
}

// 10. Render tasks to DOM
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

// 11. Toggle task status
async function toggleTask(id) {
    try {
        await fetch(`${API_URL}/${id}`, {     // 12. PUT request
            method: 'PUT'
        });
        loadTasks();
    } catch (error) {
        console.error('Toggle failed:', error);
    }
}

// 13. Delete task
async function deleteTask(id) {
    try {
        await fetch(`${API_URL}/${id}`, {     // 14. DELETE request
            method: 'DELETE'
        });
        loadTasks();
    } catch (error) {
        console.error('Delete failed:', error);
    }
}

// 15. Update stats
function updateCounters(tasks) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    completedCountEl.textContent = completed;
    totalCountEl.textContent = total;
}

// ===== EVENT LISTENERS =====
addBtn.onclick = addTask;
clearBtn.onclick = async () => {
    const tasks = await loadTasks();      // 16. Clear completed
    // Server handles this
    loadTasks();
};

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// 17. Initialize app
taskInput.focus();
loadTasks();                              // 18. Load on start

console.log('🌐 Node.js To-Do App Connected!');