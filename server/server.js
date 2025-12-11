const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5005;

const MONGODB_URI = "mongodb://localhost:27017/todos"
mongoose.connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.log("MongoDB connection error!", err));

const todoSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true
    },

    completed: {
      type: Boolean,
      default: false,
    }
  },

  {
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

const Todo = mongoose.model("Todo", todoSchema);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let todos = [];
let id = 0;

app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find({});

    res.json(todos);

  } catch (error) {
    res.status(500).json({ error: "Unable to fetch todos!" });
  }
});

app.post("/todos", async (req, res) => {
  try {
    const { text } = req.body;
    const todo = new Todo({ text });
    const savedTodo = await todo.save();

    res.json(savedTodo);

  } catch (error) {
    res.status(500).json({ error: "Unable to create todo!" })
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      res.status(404).json({ error: "Todo not found!" })
    };

    res.json({ message: "Todo deleted", deletedTodo });

  } catch (error) {
    res.status(500).json({ error: "Unable to delete todo!" })
  }
});

/*
app.delete("/todos/:id", (req, res) => {
  todos = todos.filter((t) => t.id != req.params.id);
  res.json({ message: "Todo Deleted" });
});
*/

app.put("/todos/:id", (req, res) => {
  const todo = todos.find((t) => t.id == req.params.id);
  if (todo) {
    todo.completed =
      req.body.completed !== undefined ? req.body.completed : todo.completed;
    res.json(todo);
  } else {
    res.status(404).json({ message: "todo not found" });
  }
})

app.listen(PORT, () => {
  console.log(`server working on port ${PORT}`);
});