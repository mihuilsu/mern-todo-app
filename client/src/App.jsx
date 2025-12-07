import { useState, useEffect } from 'react'
import axios from "axios";
import './App.css'

const API_URL = "http://localhost:5005/todos";

function App() {
  const [todos, setTodos] = useState([])
  const [text, setText] = useState("")
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await axios.get(API_URL);
    setTodos(response.data)
  }

  const addTodo = async () => {
    if (text.trim()) {
      const response = await axios.post(API_URL, { text })
      setTodos([...todos, response.data]);
      setText("");
    }
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    setTodos(todos.filter((t) => t.id !== id));
  };

  const toggleComplete = async (id) => {
    const todo = todos.find((t) => t.id == id);

    const response = await axios.put(`${API_URL}/${id}`, {
      completed: !todo.completed,
    });

    setTodos(
      todos.map((t) =>
        t.id === id ? { ...t, completed: response.data.completed } : t
      )
    );
  };

  return (
    <>
      <input
        type="text"
        placeholder="Add new todo"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={addTodo} style={{ marginLeft: '10px' }}>Add</button>
      <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
        {todos.map((todo) => (
          <li key={todo.id} style={{ marginTop: '10px' }}>
            <span
              onClick={() => toggleComplete(todo.id)}
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                cursor: 'pointer'
              }}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)} style={{ marginLeft: '10px' }}>Delete</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App
