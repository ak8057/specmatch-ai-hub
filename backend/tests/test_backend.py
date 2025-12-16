from fastapi.testclient import TestClient
from main import app
import os

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "mode": "DEMO"}

def test_upload_flow():
    # Create a dummy file
    filename = "test_upload.pdf"
    with open(filename, "wb") as f:
        f.write(b"dummy pdf content")
    
    try:
        with open(filename, "rb") as f:
            response = client.post(
                "/tenders/upload",
                files={"file": (filename, f, "application/pdf")}
            )
        
        assert response.status_code == 200
        data = response.json()
        assert "task_id" in data
        assert data["filename"] == filename
        
        task_id = data["task_id"]
        
        # Check task retrieval
        task_response = client.get(f"/tasks/{task_id}")
        assert task_response.status_code == 200
        assert task_response.json()["id"] == task_id
        
    finally:
        if os.path.exists(filename):
            os.remove(filename)
