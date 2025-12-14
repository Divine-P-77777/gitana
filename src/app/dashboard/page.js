"use client";

import { useState } from "react";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";


import { useUser } from "@clerk/nextjs";

const { user } = useUser();

ChartJS.register(
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip
);

export default function DashboardPage() {
    const [repoUrl, setRepoUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [signals, setSignals] = useState(null);
    const [score, setScore] = useState("");
    const [summary, setSummary] = useState("");
    const [roadmap, setRoadmap] = useState("");


    if (user) {
        await fetch("/api/history/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                repo: {
                    owner,
                    name: repo,
                    url: repoUrl,
                },
                signals,
                ai: {
                    score,
                    summary,
                    roadmap,
                },
            }),
        });
    }

    // -----------------------------
    // Main handler
    // -----------------------------
    async function analyzeRepo() {
        if (!repoUrl.trim()) {
            setError("Please enter a GitHub repository URL");
            return;
        }

        setError("");
        setLoading(true);
        setSignals(null);
        setScore("");
        setSummary("");
        setRoadmap("");

        try {
            // STEP 1: Fetch signals
            const fetchRes = await fetch("/api/fetch", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ repoUrl }),
            });

            const fetchData = await fetchRes.json();
            if (!fetchData.success) throw new Error("Failed to fetch repo");

            const repoSignals = fetchData.signals;
            setSignals(repoSignals);

            // STEP 2: AI calls (parallel)
            const [scoreRes, summaryRes, roadmapRes] = await Promise.all([
                fetch("/api/analyze", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ task: "score", signals: repoSignals }),
                }),
                fetch("/api/analyze", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ task: "summary", signals: repoSignals }),
                }),
                fetch("/api/analyze", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ task: "roadmap", signals: repoSignals }),
                }),
            ]);

            const scoreData = await scoreRes.json();
            const summaryData = await summaryRes.json();
            const roadmapData = await roadmapRes.json();

            setScore(scoreData.output);
            setSummary(summaryData.output);
            setRoadmap(roadmapData.output);
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try another repo.");
        } finally {
            setLoading(false);
        }
    }

    // -----------------------------
    // Commit activity chart
    // -----------------------------
    const chartData = signals
        ? {
            labels: ["Avg Commits / Week"],
            datasets: [
                {
                    label: "Commit Activity",
                    data: [signals.avg_commits_per_week],
                    tension: 0.4,
                },
            ],
        }
        : null;

    return (
        <div className="min-h-screen bg-neutral-950 text-white px-6 py-10">
            <div className="max-w-6xl mx-auto space-y-10">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Gitana Repository Analyzer
                    </h1>
                    <p className="text-neutral-400">
                        Get mentor-style feedback on any public GitHub repository.
                    </p>
                </div>

                {/* Input */}
                <div className="flex gap-4 flex-col sm:flex-row">
                    <input
                        type="text"
                        placeholder="https://github.com/user/repo"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        className="flex-1 rounded-lg bg-neutral-900 border border-neutral-800 px-4 py-3 outline-none focus:border-neutral-600"
                    />
                    <button
                        onClick={analyzeRepo}
                        disabled={loading}
                        className="rounded-lg bg-white text-black px-6 py-3 font-medium hover:bg-neutral-200 disabled:opacity-50"
                    >
                        {loading ? "Analyzing..." : "Analyze"}
                    </button>
                </div>

                {error && (
                    <div className="text-red-400 text-sm">{error}</div>
                )}

                {/* Results */}
                {signals && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Score */}
                        <div className="rounded-xl bg-neutral-900 p-6 border border-neutral-800">
                            <h2 className="text-xl font-semibold mb-2">Score</h2>
                            <p className="text-4xl font-bold">{score}</p>
                        </div>

                        {/* Signals Snapshot */}
                        <div className="rounded-xl bg-neutral-900 p-6 border border-neutral-800">
                            <h2 className="text-xl font-semibold mb-4">
                                Repository Overview
                            </h2>
                            <ul className="text-sm space-y-1 text-neutral-300">
                                <li>Primary Language: {signals.primary_language}</li>
                                <li>Files: {signals.file_count}</li>
                                <li>Folders Depth: {signals.folder_depth}</li>
                                <li>README Present: {signals.readme_present ? "Yes" : "No"}</li>
                                <li>Tests Folder: {signals.has_tests_folder ? "Yes" : "No"}</li>
                            </ul>
                        </div>

                        {/* Summary */}
                        <div className="rounded-xl bg-neutral-900 p-6 border border-neutral-800 md:col-span-2">
                            <h2 className="text-xl font-semibold mb-2">Mentor Feedback</h2>
                            <p className="text-neutral-300 whitespace-pre-line">
                                {summary}
                            </p>
                        </div>

                        {/* Roadmap */}
                        <div className="rounded-xl bg-neutral-900 p-6 border border-neutral-800 md:col-span-2">
                            <h2 className="text-xl font-semibold mb-2">
                                Improvement Roadmap
                            </h2>
                            <pre className="text-neutral-300 whitespace-pre-wrap text-sm">
                                {roadmap}
                            </pre>
                        </div>

                        {/* Chart */}
                        <div className="rounded-xl bg-neutral-900 p-6 border border-neutral-800 md:col-span-2">
                            <h2 className="text-xl font-semibold mb-4">
                                Commit Activity
                            </h2>
                            {chartData && <Line data={chartData} />}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
