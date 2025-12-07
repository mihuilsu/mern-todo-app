const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5005;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let todos = [];
let id = 0;

app.get('/todos', (req, res) => {
  res.json(todos);
});

app.post('/todos', (req, res) => {
  const todo = { id: ++id, text: req.body.text, completed: false };
  todos.push(todo);
  res.json(todo);
});

app.delete('/todos/:id', (req, res) => {
  todos = todos.filter((t) => t.id != req.params.id);
  res.json({ message: 'Todo Deleted' });
});

app.put('/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id == req.params.id);
  if (todo) {
    todo.completed =
      req.body.completed !== undefined ? req.body.completed : todo.completed;
      res.json(todo);
  } else {
    res.status(404).json({message : 'todo not found'});
  }
})

app.listen(PORT, () => {
  console.log(`server working on port ${PORT}`);
});