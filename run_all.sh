#!/bin/bash

# Kill background processes on exit
trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT

echo "Starting SpecMatch AI Hub..."

# Backend Setup
echo "--- Setting up Backend ---"
cd backend
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
fi
source .venv/bin/activate
pip install -r requirements.txt
# Start Backend in background
PORT=8000 uvicorn main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
echo "Backend running on PID $BACKEND_PID"
cd ..

# Frontend Setup
echo "--- Setting up Frontend ---"
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi
# Start Frontend
echo "Starting Frontend..."
VITE_API_URL="http://localhost:8000" npm run dev -- --port 3000 &
FRONTEND_PID=$!
echo "Frontend running on PID $FRONTEND_PID"
cd ..

echo "------------------------------------------------"
echo "SpecMatch Hub is running!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:8000"
echo "Press Ctrl+C to stop."
echo "------------------------------------------------"

wait
