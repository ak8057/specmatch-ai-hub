from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import shutil
import os
import uuid
from datetime import datetime
from demo_specmatch_stub import specmatch_engine

app = FastAPI(title="SpecMatch AI Hub API (Demo Mode)", version="1.0.0")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for demo (simple state management)
TASKS = {}

# Directories
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class TaskResponse(BaseModel):
    task_id: str
    status: str
    filename: str
    created_at: str
    result: Optional[dict] = None

class ValidationRequest(BaseModel):
    match_index: int
    approved: bool
    notes: Optional[str] = None

class PricingRequest(BaseModel):
    margin_percent: float

@app.get("/health")
def health_check():
    return {"status": "ok", "mode": "DEMO"}

@app.post("/tenders/upload", response_model=TaskResponse)
async def upload_tender(file: UploadFile = File(...)):
    task_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{task_id}_{file.filename}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Run SpecMatch (Synchronous for simple demo, or background)
    # Using background for realism, but returning task immediately
    # For this demo, let's just process it immediately to avoid polling complexity in frontend stub
    result = specmatch_engine.process_pdf(file_path)
    
    TASKS[task_id] = {
        "id": task_id,
        "status": "completed", # Simulated instant completion
        "filename": file.filename,
        "created_at": datetime.now().isoformat(),
        "result": result,
        "pricing": None # To be filled later
    }
    
    return {
        "task_id": task_id,
        "status": "completed",
        "filename": file.filename,
        "created_at": TASKS[task_id]["created_at"],
        "result": result
    }

@app.get("/tasks", response_model=List[TaskResponse])
def get_tasks():
    return [
        {
            "task_id": k, 
            "status": v["status"], 
            "filename": v["filename"], 
            "created_at": v["created_at"],
            "result": v["result"]
        } 
        for k, v in TASKS.items()
    ]

@app.get("/tasks/{task_id}")
def get_task(task_id: str):
    if task_id not in TASKS:
        raise HTTPException(status_code=404, detail="Task not found")
    return TASKS[task_id]

@app.post("/tasks/{task_id}/validate")
def validate_match(task_id: str, request: ValidationRequest):
    if task_id not in TASKS:
        raise HTTPException(status_code=404, detail="Task not found")
    
    matches = TASKS[task_id]["result"]["matches"]
    if request.match_index >= len(matches):
        raise HTTPException(status_code=400, detail="Invalid match index")
    
    # Update match status simulated
    matches[request.match_index]["validated"] = True
    matches[request.match_index]["validation_note"] = request.notes if request.notes else "Auto-approved"
    
    return {"status": "success", "message": "Match validated"}

@app.post("/tasks/{task_id}/generate-proposal")
def generate_proposal(task_id: str, request: PricingRequest):
    if task_id not in TASKS:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = TASKS[task_id]
    matches = task["result"]["matches"]
    
    # Simple pricing calculation stub
    total_base_cost = 0
    items = []
    
    for m in matches:
        # Fake lookup logic based on match confidence/name
        base_cost = 1000.0 if "Pump" in m["name"] else 500.0
        sell_price = base_cost * (1 + request.margin_percent / 100)
        items.append({
            "sku": m["sku"],
            "base_cost": base_cost,
            "sell_price": sell_price
        })
        total_base_cost += base_cost
        
    total_sell_price = total_base_cost * (1 + request.margin_percent / 100)
    
    proposal = {
        "generated_at": datetime.now().isoformat(),
        "total_value": total_sell_price,
        "margin": request.margin_percent,
        "items": items,
        "download_url": f"/exports/proposal-{task_id}.pdf" # Mock URL
    }
    
    task["pricing"] = proposal
    return proposal
