from fastapi.testclient import TestClient
from main import app
import os
import shutil

client = TestClient(app)

def setup_module(module):
    """Setup before tests"""
    os.makedirs("uploads", exist_ok=True)
    os.makedirs("demo-output", exist_ok=True)

def teardown_module(module):
    """Cleanup after tests"""
    # Clean up DB if needed, but keeping for debug might be good
    pass

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "mode": "DEMO"}

def test_api_version():
    response = client.get("/api/version")
    assert response.status_code == 200
    assert response.json()["version"] == "1.0.0"

def test_end_to_end_demo_flow():
    # 1. Upload
    filename = "end_to_end_test.pdf"
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
        task_id = data["task_id"]
        assert data["status"] == "specmatch_completed"
        
        # 2. Get Task
        response = client.get(f"/tasks/{task_id}")
        assert response.status_code == 200
        result = response.json()["result"]
        assert len(result["matches"]) > 0
        
        # 3. Validate
        response = client.post(f"/tasks/{task_id}/validate", json={
            "match_index": 0,
            "approved": True,
            "notes": "Test Note"
        })
        assert response.status_code == 200
        
        # 4. Generate Proposal
        response = client.post(f"/tasks/{task_id}/generate-proposal", json={
            "margin_percent": 20.0
        })
        assert response.status_code == 200
        proposal_data = response.json()
        assert "download_url" in proposal_data
        
        # 5. Check File Existence
        output_file = proposal_data["file_path"]
        assert os.path.exists(os.path.join("demo-output", output_file))
        
    finally:
        if os.path.exists(filename):
            os.remove(filename)
