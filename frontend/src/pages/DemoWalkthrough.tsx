import { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';

// Simple API wrapper
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface Match {
    sku: string;
    name: string;
    confidence: number;
    reason: string;
    category: string;
    validated?: boolean;
}

interface Task {
    task_id: string;
    status: string;
    filename: string;
    result?: {
        matches: Match[];
    };
    pricing?: {
        total_value: number;
        download_url: string;
        generated_at?: string;
    };
}

export default function DemoWalkthrough() {
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [margin, setMargin] = useState(15);

    // Step 1: Upload
    const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('file', e.target.files[0]);

        try {
            const res = await fetch(`${API_BASE}/tenders/upload`, {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            setTask(data);
        } catch (err) {
            console.error("Upload failed", err);
            alert("Demo Mode: Backend not reachable? Check if docker-compose is running.");
        } finally {
            setUploading(false);
        }
    };

    // Step 2: Validate
    const handleValidate = async (index: number) => {
        if (!task) return;
        try {
            await fetch(`${API_BASE}/tasks/${task.task_id}/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ match_index: index, approved: true }),
            });
            // Optimistic update
            const newMatches = [...(task.result?.matches || [])];
            newMatches[index].validated = true;
            setTask({
                ...task,
                result: { ...task.result!, matches: newMatches }
            });
        } catch (err) {
            console.error("Validation failed", err);
        }
    };

    // Step 3: Pricing
    const handleGenerateProposal = async () => {
        if (!task) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/tasks/${task.task_id}/generate-proposal`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ margin_percent: margin }),
            });
            const data = await res.json();
            setTask({ ...task, pricing: data });
        } catch (err) {
            console.error("Pricing failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-4xl">
            <header className="mb-8 border-b pb-4">
                <h1 className="text-3xl font-bold text-slate-800">SpecMatch AI Hub <span className="text-xs bg-amber-500 text-white px-2 py-1 rounded ml-2">DEMO MODE</span></h1>
                <p className="text-slate-500 mt-2">End-to-End Orchestration Demo</p>
            </header>

            {/* Step 1: Upload */}
            <section className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h2 className="text-xl font-semibold mb-4">1. Tender Discovery & Upload</h2>
                <div className="flex items-center gap-4">
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleUpload}
                        className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
                    />
                    {uploading && <span className="text-blue-600 animate-pulse">Processing Agent Active...</span>}
                </div>
            </section>

            {task && (
                <>
                    {/* Step 2: SpecMatch Results */}
                    <section className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                        <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
                            2. Technical Agent Analysis
                            <span className="text-sm font-normal text-slate-500">Task ID: {task.task_id.slice(0, 8)}</span>
                        </h2>

                        <div className="space-y-4">
                            {task.result?.matches.map((match, idx) => (
                                <div key={idx} className={`p-4 border rounded-lg flex justify-between items-start ${match.confidence > 0.8 ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono font-bold">{match.sku}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded ${match.confidence > 0.8 ? 'bg-green-200 text-green-800' : 'bg-amber-200 text-amber-800'}`}>
                                                {(match.confidence * 100).toFixed(0)}% Match
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium mt-1">{match.name}</p>
                                        <p className="text-xs text-slate-600 mt-1">{match.reason}</p>
                                    </div>

                                    <div className="flex flex-col items-end">
                                        {match.confidence < 0.8 && !match.validated && (
                                            <button
                                                onClick={() => handleValidate(idx)}
                                                className="text-xs bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded transition-colors"
                                            >
                                                Validate Match
                                            </button>
                                        )}
                                        {match.validated && (
                                            <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                                                ✓ Engineer Approved
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Step 3: Pricing */}
                    <section className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                        <h2 className="text-xl font-semibold mb-4">3. Pricing Agent & Commercial</h2>

                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Target Margin Strategy</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="5"
                                        max="50"
                                        value={margin}
                                        onChange={(e) => setMargin(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <span className="font-bold text-lg w-16">{margin}%</span>
                                </div>
                            </div>

                            <div className="flex items-end justify-end">
                                <button
                                    onClick={handleGenerateProposal}
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Calculating...' : 'Generate Proposal'}
                                </button>
                            </div>
                        </div>

                        {task.pricing && (
                            <div className="mt-8 p-4 bg-slate-900 text-white rounded-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-lg">Proposal Summary</h3>
                                    <span className="text-green-400 font-mono text-xl">${task.pricing.total_value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                                Generated at: {task.pricing.generated_at ? new Date(task.pricing.generated_at).toLocaleString() : 'Just now'}
                                <a href={`${API_BASE}${task.pricing.download_url}`} target="_blank" rel="noreferrer" className="block w-full text-center bg-white text-slate-900 hover:bg-slate-100 font-bold py-2 rounded transition-colors">
                                    ⇩ Download PDF Proposal
                                </a>
                            </div>
                        )}
                    </section>
                </>
            )}
        </div >
    );
}
