<div align="center">

# SpecMatch AI Hub

[![CI](https://img.shields.io/github/actions/workflow/status/ak8057/specmatch-ai-hub/ci.yml?label=CI)](https://github.com/ak8057/specmatch-ai-hub/actions) [![Python](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/) [![FastAPI](https://img.shields.io/badge/fastapi-0.100+-teal.svg)](https://fastapi.tiangolo.com/) [![React](https://img.shields.io/badge/react-18+-61dafb.svg)](https://react.dev/) [![TypeScript](https://img.shields.io/badge/typescript-5+-3178c6.svg)](https://www.typescriptlang.org/) [![Docker](https://img.shields.io/badge/docker-ready-2496ed.svg)](https://www.docker.com/)

</div>

SpecMatch AI Hub is an Agentic AI Orchestration Platform designed to automate the B2B RFP (Request for Proposal) lifecycle in industrial manufacturing and electrical infrastructure. It replaces slow, manual, waterfall-style workflows with a parallel, AI-driven, and auditable system.

## Features

- **Multi-Agent Orchestration**: Master Agent coordinates Sales, Technical, and Pricing agents
- **Hybrid SpecMatch Engine**: Combines semantic search with deterministic rule validation
- **Human-in-the-Loop**: Low-confidence matches are flagged for engineer validation
- **Audit Trail**: All decisions are logged with timestamps for compliance
- **Demo Mode**: Runs entirely offline without external API keys

---

## Table of Contents

1.  [Quick Start](#quick-start)
2.  [Demo Walkthrough](#demo-walkthrough)
3.  [Running Services Individually](#running-services-individually)
4.  [Docker Deployment](#docker-deployment)
5.  [Verification Commands](#verification-commands)

---

## Quick Start

### Prerequisites

*   Python 3.9+
*   Node.js 18+
*   (Optional) Docker and Docker Compose

### 1. Clone and Navigate

```bash
git clone <repo_url>
cd specmatch-ai-hub
```

### 2. Start the Application

The provided shell script sets up and starts both the backend and frontend.

```bash
chmod +x run_all.sh
./run_all.sh
```

This script will:
*   Create a Python virtual environment in `backend/.venv` and install dependencies.
*   Install Node.js dependencies for the frontend.
*   Start the Backend API at `http://localhost:8000`.
*   Start the Frontend Dashboard at `http://localhost:3000`.

---

## Demo Walkthrough

Once the application is running, navigate to the demo page:

**URL: [http://localhost:3000/demo-walkthrough](http://localhost:3000/demo-walkthrough)**

![Demo Walkthrough](demo.gif)

### Step 1: Tender Discovery and Upload

1.  Click the file input under "Tender Discovery and Upload".
2.  Select the sample PDF located at `backend/sample-data/sample-tender.pdf`.
3.  The system will process the file and display the results.

### Step 2: Technical Agent Analysis

1.  Observe the SKU matches returned by the Technical Agent.
2.  Items with **high confidence** (green) are auto-approved.
3.  Items with **low confidence** (yellow) require manual validation.
4.  Click the "Validate Match" button on any low-confidence item to simulate engineer approval.

### Step 3: Pricing Agent and Proposal Generation

1.  Use the "Target Margin Strategy" slider to set a profit margin.
2.  Click "Generate Proposal".
3.  The system will calculate pricing and generate a downloadable proposal file.
4.  The file is saved to the `backend/demo-output/` directory.

---

## Running Services Individually

### Backend Only

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API documentation will be available at `http://localhost:8000/docs`.

### Frontend Only

```bash
cd frontend
npm install
npm run dev
```

The dashboard will be available at `http://localhost:3000`.

---

## Docker Deployment

For a containerized deployment, use Docker Compose.

### 1. Setup Environment

```bash
cp .env.example .env
```

### 2. Build and Run

```bash
docker-compose up --build
```

### 3. Access the Application

*   **Frontend**: `http://localhost:3000`
*   **Backend API Docs**: `http://localhost:8000/docs`

---

## Verification Commands

### Run Backend Tests

```bash
cd backend
pip install -r requirements.txt
pytest
```

### Check Service Health

```bash
curl http://localhost:8000/health
```

Expected response: `{"status": "ok", "mode": "DEMO"}`

---

For detailed technical context, architecture, and file responsibilities, see [CONTEXT.md](./CONTEXT.md).
