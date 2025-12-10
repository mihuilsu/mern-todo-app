const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const bodyParser = require("body-parser");

const app = express();
const PORT = 5005;

const MONGODB_URL = "mongodb://localhost:27017/todos"
mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log("MongoDB connection error!!!", err));


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
    res.status(404).json({ message: 'todo not found' });
  }
})

app.listen(PORT, () => {
  console.log(`server working on port ${PORT}`);
});