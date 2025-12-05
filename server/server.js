const express = require('express');
const cors = require('cors');

const app = express();
const port = 5005;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// initialize with some todos

let todos = [
  { id: 1, text: "Buy groceries", completed: false },
  { id: 2, text: "Walk the dog", completed: true },
  { id: 3, text: "Clean house", completed: false },
]

let id = 3;

app.get('/', (req, res) => {
  res.json(todos);
});


app.listen(port)