from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
import shutil
import os
import uuid
import json
from datetime import datetime

# Local imports
from demo_specmatch_stub import specmatch_engine
import db_utils

app = FastAPI(title="SpecMatch AI Hub API (Demo Mode)", version="1.0.0")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, set this to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
UPLOAD_DIR = "uploads"
OUTPUT_DIR = "demo-output"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Initialize DB
db_utils.init_db()

class TaskResponse(BaseModel):
    task_id: str
    status: str
    filename: str
    created_at: str
    result: Optional[dict] = None
    pricing: Optional[dict] = None

class ValidationRequest(BaseModel):
    match_index: int
    approved: bool
    notes: Optional[str] = None

class PricingRequest(BaseModel):
    margin_percent: float

@app.get("/health")
def health_check():
    return {"status": "ok", "mode": "DEMO"}

@app.get("/api/version")
def api_version():
    return {"version": "1.0.0"}

@app.post("/tenders/upload", response_model=TaskResponse)
async def upload_tender(file: UploadFile = File(...)):
    task_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{task_id}_{file.filename}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Process
    result = specmatch_engine.process_pdf(file_path)
    
    task_data = {
        "task_id": task_id,
        "status": "specmatch_completed",
        "filename": file.filename,
        "created_at": datetime.now().isoformat(),
        "result": result,
        "pricing": None
    }
    
    db_utils.save_task(task_data)
    db_utils.log_action(task_id, "UPLOAD", f"File {file.filename} uploaded and processed.")
    
    return task_data

@app.get("/tasks", response_model=List[TaskResponse])
def get_tasks():
    return db_utils.get_all_tasks()

@app.get("/tasks/{task_id}")
def get_task(task_id: str):
    task = db_utils.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.post("/tasks/{task_id}/validate")
def validate_match(task_id: str, request: ValidationRequest):
    task = db_utils.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    result = task["result"]
    if request.match_index >= len(result["matches"]):
        raise HTTPException(status_code=400, detail="Invalid match index")
    
    # Update match
    result["matches"][request.match_index]["validated"] = True
    result["matches"][request.match_index]["validation_note"] = request.notes or "Auto-approved"
    
    # Update DB
    task["result"] = result
    db_utils.save_task(task)
    db_utils.log_action(task_id, "VALIDATE", f"Match index {request.match_index} validated.")
    
    return {"status": "success"}

@app.post("/tasks/{task_id}/generate-proposal")
def generate_proposal(task_id: str, request: PricingRequest):
    task = db_utils.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    matches = task["result"]["matches"]
    
    # Calculate pricing
    total_base_cost = 0
    items = []
    for m in matches:
        base_cost = 1000.0 if "Pump" in m["name"] else 500.0
        sell_price = base_cost * (1 + request.margin_percent / 100)
        items.append({
            "sku": m["sku"],
            "description": m["name"],
            "base_cost": base_cost,
            "sell_price": sell_price
        })
        total_base_cost += base_cost
    
    total_value = total_base_cost * (1 + request.margin_percent / 100)
    
    # Generate Proposal PDF (Stub: Text file)
    proposal_filename = f"Proposal_{task_id}_{datetime.now().strftime('%Y%m%d')}.txt"
    proposal_path_abs = os.path.join(OUTPUT_DIR, proposal_filename)
    
    with open(proposal_path_abs, "w") as f:
        f.write(f"PROPOSAL FOR TENDER {task['filename']}\n")
        f.write(f"Generated At: {datetime.now().isoformat()}\n")
        f.write(f"Task ID: {task_id}\n")
        f.write("-" * 40 + "\n")
        for item in items:
            f.write(f"Item: {item['sku']} - {item['description']}\n")
            f.write(f"Price: ${item['sell_price']:.2f}\n")
        f.write("-" * 40 + "\n")
        f.write(f"Total Value: ${total_value:.2f}\n")
        f.write(f"Margin: {request.margin_percent}%\n")
    
    # Update Task
    proposal_data = {
        "generated_at": datetime.now().isoformat(),
        "total_value": total_value,
        "margin": request.margin_percent,
        "items": items,
        "file_path": proposal_filename,
        "download_url": f"/export/download/{proposal_filename}"
    }
    
    task["pricing"] = proposal_data
    task["status"] = "proposal_generated"
    db_utils.save_task(task)
    db_utils.log_action(task_id, "PROPOSAL", f"Proposal generated. Value: ${total_value:.2f}")
    
    return proposal_data

@app.get("/export/download/{filename}")
def download_file(filename: str):
    file_path = os.path.join(OUTPUT_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, filename=filename)
