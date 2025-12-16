import sqlite3
import os
import json
from datetime import datetime

DB_PATH = "demo.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    # Audit Log Table
    c.execute('''CREATE TABLE IF NOT EXISTS audit_log
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  task_id TEXT,
                  action TEXT,
                  details TEXT,
                  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)''')
    # Task State Table (Simple persistence)
    c.execute('''CREATE TABLE IF NOT EXISTS tasks
                 (task_id TEXT PRIMARY KEY,
                  status TEXT,
                  filename TEXT,
                  created_at TEXT,
                  result_json TEXT,
                  pricing_json TEXT)''')
    conn.commit()
    conn.close()

def log_action(task_id: str, action: str, details: str = ""):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("INSERT INTO audit_log (task_id, action, details) VALUES (?, ?, ?)",
              (task_id, action, details))
    conn.commit()
    conn.close()

def save_task(task_data: dict):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''INSERT OR REPLACE INTO tasks (task_id, status, filename, created_at, result_json, pricing_json)
                 VALUES (?, ?, ?, ?, ?, ?)''',
              (task_data["task_id"], 
               task_data["status"], 
               task_data["filename"], 
               task_data["created_at"],
               json.dumps(task_data.get("result")),
               json.dumps(task_data.get("pricing"))))
    conn.commit()
    conn.close()

def get_task(task_id: str):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT * FROM tasks WHERE task_id = ?", (task_id,))
    row = c.fetchone()
    conn.close()
    if row:
        return {
            "task_id": row["task_id"],
            "status": row["status"],
            "filename": row["filename"],
            "created_at": row["created_at"],
            "result": json.loads(row["result_json"]) if row["result_json"] else None,
            "pricing": json.loads(row["pricing_json"]) if row["pricing_json"] else None
        }
    return None

def get_all_tasks():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT * FROM tasks ORDER BY created_at DESC")
    rows = c.fetchall()
    conn.close()
    tasks = []
    for row in rows:
        tasks.append({
            "task_id": row["task_id"],
            "status": row["status"],
            "filename": row["filename"],
            "created_at": row["created_at"],
            "result": json.loads(row["result_json"]) if row["result_json"] else None,
            "pricing": json.loads(row["pricing_json"]) if row["pricing_json"] else None
        })
    return tasks
