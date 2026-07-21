import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8000";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Fetch all todos on load ---
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/todos`);
      if (!res.ok) throw new Error("Failed to fetch todos");
      const data = await res.json();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // --- Add a new todo ---
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, completed: false }),
      });
      setTitle("");
      fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  // --- Toggle completed checkbox ---
  const handleToggle = async (todo) => {
    try {
      await fetch(`${API_URL}/todos/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  // --- Delete ---
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/todos/${id}`, { method: "DELETE" });
      fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  // --- Edit title (inline) ---
  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  };

  const saveEdit = async (id) => {
    if (!editingTitle.trim()) return;
    try {
      await fetch(`${API_URL}/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editingTitle }),
      });
      setEditingId(null);
      setEditingTitle("");
      fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Todo List</h1>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <form onSubmit={handleAdd} style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit">Add</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : todos.length === 0 ? (
        <p>No todos yet. Add one above.</p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {todos.map((todo) => (
              <li
                key={todo.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  padding: 10,
                  marginBottom: 6,
                }}
              >
                <input
                  type="checkbox"
                  checked={!!todo.completed}
                  onChange={() => handleToggle(todo)}
                />

                {editingId === todo.id ? (
                  <>
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      style={{ flex: 1, padding: 4 }}
                    />
                    <button onClick={() => saveEdit(todo.id)}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <span
                      style={{
                        flex: 1,
                        textDecoration: todo.completed ? "line-through" : "none",
                        color: todo.completed ? "#999" : "#000",
                      }}
                    >
                      {todo.title}
                    </span>
                    <button onClick={() => startEdit(todo)}>Edit</button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      style={{ color: "red" }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
          <p style={{ color: "#666" }}>{remaining} item(s) remaining</p>
        </>
      )}
    </div>
  );
}

export default App;
