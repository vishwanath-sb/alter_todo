# Todo App — FastAPI + React

### 1. Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Check it works: open http://localhost:8000/docs

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Check it works: open http://localhost:5173 


## Why this stack

- **FastAPI**: you already know it, and it's fast to extend
- **SQLite**: zero setup — no DB server to install or configure under time pressure
- **React (Vite)**: minimal config, instant hot reload

