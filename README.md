# SpecMatch AI Hub

SpecMatch AI Hub is an agentic AI orchestration platform that automates the B2B RFP lifecycle. It coordinates Sales, Technical, and Pricing agents to replace manual workflows with parallel, automated execution.

## Execution Guide

The project consists of a FastAPI backend and a React frontend. Use the provided shell script to run the entire stack locally.

### 1. Clone and Navigate

```bash
git clone <repo_url>
cd specmatch-ai-hub
```

### 2. Start the Application

```bash
./run_all.sh
```

**What this does:**
*   Sets up a Python virtual environment (`backend/.venv`) and installs dependencies.
*   Installs Node.js dependencies for the frontend.
*   Starts the **Backend API** at `http://localhost:8000`.
*   Starts the **Frontend Dashboard** at `http://localhost:3000`.

### 3. Demo Walkthrough

Once running, navigate to:
**[http://localhost:3000/demo-walkthrough](http://localhost:3000/demo-walkthrough)**

Follow the on-screen flow:
1.  **Upload Tender**: Select a sample PDF (e.g., `industrial-pump-rfp.pdf` provided in `sample-data/` or use the mock).
2.  **Validate Specs**: The Technical Agent will extract SKUs. Validate low-confidence matches.
3.  **Generate Proposal**: The Pricing Agent will calculate costs. Adjust margins and export the proposal.

## Run Individually (Optional)

**Backend Only:**
```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend Only:**
```bash
cd frontend
npm install
npm run dev
```

## Features

*   **Orchestration Layer**: Manages state and dependencies between agents.
*   **Hybrid SpecMatch**: Combines semantic search with deterministic rules.
*   **Demo Mode**: Runs entirely offline without external API keys.

For detailed architecture and context, see [CONTEXT.md](./CONTEXT.md).
