const express = require('express');
const app = express();
app.use(express.json());

let tasks = [];
let nextId = 1;

app.post('/tasks', (req, res) => {
  const text = req.body.text;
  if (!text) {
    return res.status(400).send('text is required');
  }
  const task = { id: nextId++, text: text, done: false };
  tasks.push(task);
  res.json(task);
});

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.put('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id == req.params.id);
  if (!task) {
    return res.status(404).send('not found');
  }
  task.done = true;
  res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id == req.params.id);
  if (index === -1) {
    return res.status(404).send('not found');
  }
  tasks.splice(index, 1);
  res.sendStatus(200);
});

app.listen(3001, () => {
  console.log('Task list API running on port 3001');
});
