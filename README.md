# Todo App — FastAPI + React

Pre-built, tested Todo application. Backend and frontend already talk to each
other with a working CRUD example (add/edit/delete/toggle-complete/list todos).

## Before the assessment (do this now)

### 1. Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
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
Check it works: open http://localhost:5173 — you should see "Mini Project" with
a form. Add an item, edit it, delete it. If all three work, you're set.

### 3. Push to GitHub
```bash
git init
git add .
git commit -m "Initial scaffold: FastAPI + React CRUD skeleton"
git branch -M main
git remote add origin <your-empty-repo-url>
git push -u origin main
```

## On assessment day (1 PM)

1. Read the brief carefully — figure out the actual entity/domain
   (e.g. "tasks", "students", "orders") and required fields.
2. In `backend/main.py`:
   - Rename `items` table/routes to match the domain
   - Update the `CREATE TABLE` columns and Pydantic schemas (`ItemCreate`, `ItemUpdate`)
3. In `frontend/src/App.jsx`:
   - Update the field names in the form (`title`/`description`) to match
   - Update what's displayed in the list
4. Add any extra features the brief specifically asks for (auth, filtering, sorting, etc.)
5. Test end-to-end locally, then commit + push before the deadline.

## Why this stack

- **FastAPI**: you already know it, and it's fast to extend
- **SQLite**: zero setup — no DB server to install or configure under time pressure
- **React (Vite)**: minimal config, instant hot reload
- No AI assistants used or needed at this point — this is just boilerplate you're
  allowed to prepare beforehand per the instructions.

## Troubleshooting

- **Frontend can't reach backend / CORS error**: make sure backend is running on
  port 8000 (`API_URL` in `App.jsx` expects this). CORS is already enabled in `main.py`.
- **`uvicorn` not found**: activate your venv first (`source venv/bin/activate`).
- **Port already in use**: kill the old process or run on a different port and
  update `API_URL` in `App.jsx` to match.
