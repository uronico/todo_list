const express = require('express');       
const path = require('path');             
const cors = require('cors');             

const app = express();                    
const PORT = 3000;                       

//Middleware setup
app.use(cors());                          
app.use(express.json());                  
app.use(express.static('public'));        

//In-memory tasks (replace with database later)
let tasks = [];
let nextId = 1;

// ===== API ROUTES =====
//GET all tasks
app.get('/api/tasks', (req, res) => {
    res.json(tasks);                     
});

//POST new task
app.post('/api/tasks', (req, res) => {
    const { text } = req.body;            
    if (!text || text.trim() === '') {
        return res.status(400).json({ error: 'Task text required' });
    }
    
    const task = {                        
        id: nextId++,
        text: text.trim(),
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(task);                    
    res.status(201).json(task);           
});

//PUT toggle task
app.put('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);   
    const task = tasks.find(t => t.id === id);
    
    if (!task) return res.status(404).json({ error: 'Task not found' });
    
    task.completed = !task.completed;      
    res.json(task);                       
});

//DELETE task
app.delete('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = tasks.findIndex(t => t.id === id);
    
    if (index === -1) return res.status(404).json({ error: 'Task not found' });
    
    tasks.splice(index, 1);              
    res.json({ message: 'Task deleted' }); 
});

//Start server
app.listen(PORT, () => {
    console.log(`🚀 To-Do App running at http://localhost:${PORT}`);
    console.log(`📱 API: http://localhost:${PORT}/api/tasks`);
});