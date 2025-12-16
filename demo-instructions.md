# Demo Instructions for Judges

**Goal**: Reproducible, offline-capable demo of the SpecMatch AI Hub end-to-end flow.

## 1. Setup

Ensure you have Docker and Docker Compose installed.

```bash
# Clone the repository
git clone <repo-url>
cd specmatch-ai-hub

# Setup Environment
cp .env.example .env

# Start the environment
docker-compose up --build
```
*Wait for standard startup logs. The frontend will be available at http://localhost:3000.*

## 2. The Demo Script (End-to-End Flow)

### Step 1: Tender Discovery & Upload
1.  Navigate to **[http://localhost:3000/demo-walkthrough](http://localhost:3000/demo-walkthrough)**.
2.  Click **"Upload New Tender"**.
3.  Select the sample file: `sample-data/industrial-pump-rfp.pdf` (or use the provided mock file `backend/sample-data/sample-tender.pdf`).
4.  *Observation*: The system acknowledges the upload and the **Master Agent** initiates the workflow.

### Step 2: SpecMatch Interpretation (Technical Agent)
1.  Observe the **SKU Matches**:
    *   Show a "High Confidence" match (Green).
    *   Show a "Low Confidence" match (Yellow) requiring validation.
2.  **Action**: Click "Validate" on the low-confidence item to simulate human-in-the-loop.

### Step 3: Pricing & Proposal (Sales/Pricing Agent)
1.  Scroll to the **Pricing** section.
2.  Observe that prices are auto-populated from the local SQLite database.
3.  **Action**: Adjust the "Target Margin" slider.
4.  Click **"Generate Proposal"**.

### Step 4: Final Output
1.  The system generates a download link.
2.  Click **"Download PDF Proposal"**.
3.  Verify the file contains the audit log and pricing details.
4.  *Verification*: Check `demo-output/` folder on your machine to see the generated file.

## 3. Demo Mode Technical Details

*   **No API Keys Needed**: The backend runs in a restricted `DEMO_MODE`.
*   **Deterministic Responses**: The Technical Agent uses a pre-computed mapping (`backend/sample-data/specmatch-mapping.json`) to ensure consistent, crash-free demos.
*   **Data Persistence**: Uses a local SQLite database (`backend/demo.db`) to store tasks and audit logs during the session.
