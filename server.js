// Node.js Express Server for To-Do App
const express = require('express');       // 1. Import Express
const path = require('path');             // 2. File path utility
const cors = require('cors');             // 3. CORS middleware

const app = express();                    // 4. Create app instance
const PORT = 3000;                        // 5. Server port

// 6. Middleware setup
app.use(cors());                          // 7. Enable CORS
app.use(express.json());                  // 8. Parse JSON
app.use(express.static('public'));        // 9. Serve static files

// 10. In-memory tasks (replace with database later)
let tasks = [];
let nextId = 1;

// ===== API ROUTES =====
// 11. GET all tasks
app.get('/api/tasks', (req, res) => {
    res.json(tasks);                      // 12. Return tasks array
});

// 13. POST new task
app.post('/api/tasks', (req, res) => {
    const { text } = req.body;            // 14. Extract text
    if (!text || text.trim() === '') {
        return res.status(400).json({ error: 'Task text required' });
    }
    
    const task = {                        // 15. Create task
        id: nextId++,
        text: text.trim(),
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(task);                     // 16. Add to array
    res.status(201).json(task);           // 17. Return new task
});

// 18. PUT toggle task
app.put('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);   // 19. Parse ID
    const task = tasks.find(t => t.id === id);
    
    if (!task) return res.status(404).json({ error: 'Task not found' });
    
    task.completed = !task.completed;      // 20. Toggle status
    res.json(task);                       // 21. Return updated
});

// 22. DELETE task
app.delete('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = tasks.findIndex(t => t.id === id);
    
    if (index === -1) return res.status(404).json({ error: 'Task not found' });
    
    tasks.splice(index, 1);               // 23. Remove task
    res.json({ message: 'Task deleted' }); // 24. Success response
});

// 25. Start server
app.listen(PORT, () => {
    console.log(`🚀 To-Do App running at http://localhost:${PORT}`);
    console.log(`📱 API: http://localhost:${PORT}/api/tasks`);
});