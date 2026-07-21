from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import sqlite3

app = FastAPI(title="Todo API")

# --- CORS: allows your React frontend (running on a different port) to call this API ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for the assessment, "*" is fine. Tighten in real prod apps.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_FILE = "app.db"


def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            completed BOOLEAN NOT NULL DEFAULT 0
        )
        """
    )
    conn.commit()
    conn.close()


init_db()


# --- Schemas ---
class TodoCreate(BaseModel):
    title: str
    completed: Optional[bool] = False


class TodoUpdate(BaseModel):
    title: Optional[str] = None
    completed: Optional[bool] = None


# --- Routes ---
@app.get("/")
def root():
    return {"status": "API is running"}


@app.get("/todos")
def list_todos():
    conn = get_db()
    rows = conn.execute("SELECT * FROM todos").fetchall()
    conn.close()
    return [dict(row) for row in rows]


@app.get("/todos/completed")
def list_todos_completed():
    conn = get_db()
    rows = conn.execute("SELECT * FROM todos WHERE completed = '1'").fetchall()
    conn.close()
    return [dict(row) for row in rows]


@app.get("/todos/{todo_id}")
def get_todo(todo_id: int):
    conn = get_db()
    row = conn.execute("SELECT * FROM todos WHERE id = ?", (todo_id,)).fetchone()
    conn.close()
    if row is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return dict(row)


@app.post("/todos", status_code=201)
def create_todo(todo: TodoCreate):
    conn = get_db()
    cur = conn.execute(
        "INSERT INTO todos (title, completed) VALUES (?, ?)",
        (todo.title, todo.completed),
    )
    conn.commit()
    new_id = cur.lastrowid
    conn.close()
    return {"id": new_id, **todo.dict()}


@app.put("/todos/{todo_id}")
def update_todo(todo_id: int, todo: TodoUpdate):
    conn = get_db()
    existing = conn.execute("SELECT * FROM todos WHERE id = ?", (todo_id,)).fetchone()
    if existing is None:
        conn.close()
        raise HTTPException(status_code=404, detail="Todo not found")

    title = todo.title if todo.title is not None else existing["title"]
    completed = (
        todo.completed if todo.completed is not None else existing["completed"]
    )

    conn.execute(
        "UPDATE todos SET title = ?, completed = ? WHERE id = ?",
        (title, completed, todo_id),
    )
    conn.commit()
    conn.close()
    return {"id": todo_id, "title": title, "completed": bool(completed)}


@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int):
    conn = get_db()
    existing = conn.execute("SELECT * FROM todos WHERE id = ?", (todo_id,)).fetchone()
    if existing is None:
        conn.close()
        raise HTTPException(status_code=404, detail="Todo not found")
    conn.execute("DELETE FROM todos WHERE id = ?", (todo_id,))
    conn.commit()
    conn.close()
    return {"detail": "Todo deleted"}
