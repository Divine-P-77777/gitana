"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CommitChart from "../components/CommitChart";
import Skeleton from "../components/Skeleton";

export default function DashboardPage() {
    const { user } = useUser();
    const [repoUrl, setRepoUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [signals, setSignals] = useState(null);
    const [score, setScore] = useState("");
    const [summary, setSummary] = useState("");
    const [roadmap, setRoadmap] = useState("");
    const [level, setLevel] = useState("");

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
        setSummary("");
        setRoadmap("");
        setLevel("");

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
            const [scoreRes, summaryRes, roadmapRes, understandingRes] = await Promise.all([
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
                fetch("/api/analyze", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ task: "understanding", signals: repoSignals }),
                }),
            ]);

            const scoreData = await scoreRes.json();
            const summaryData = await summaryRes.json();
            const roadmapData = await roadmapRes.json();
            const understandingData = await understandingRes.json();

            setScore(scoreData.output);
            setSummary(summaryData.output);
            setRoadmap(roadmapData.output);

            // understandingData.output is a JSON string, we need to parse it
            try {
                const understandingJson = JSON.parse(understandingData.output);
                setLevel(understandingJson.maturity_level || "Unknown");
            } catch (e) {
                console.error("Failed to parse understanding JSON", e);
                setLevel("Unknown");
            }

            const repoDetails = fetchData.signals ? {
                owner: fetchData.owner,
                name: fetchData.repo,
                url: repoUrl,
            } : null;

            if (user && repoDetails) {
                // FIRE AND FORGET - save history without blocking UI
                fetch("/api/history/save", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        repo: repoDetails,
                        signals: repoSignals,
                        ai: {
                            score: scoreData.output,
                            summary: summaryData.output,
                            roadmap: roadmapData.output,
                        },
                    }),
                }).catch(err => console.error("Failed to save history:", err));
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try another repo.");
        } finally {
            setLoading(false);
        }
    }

    // Prepare chart data using the weekly_commits from backend if available
    const chartData = signals?.weekly_commits
        ? {
            labels: signals.weekly_commits.map((_, i) => `Week ${i + 1}`),
            values: signals.weekly_commits,
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

                {/* Results - Show either Loading Skeletons or Actual Data */}
                {(loading || signals) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Score */}
                        <div className="rounded-xl bg-neutral-900 p-6 border border-neutral-800">
                            <h2 className="text-xl font-semibold mb-2">Score</h2>
                            {loading && !score ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-10 w-24" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                            ) : (
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-baseline gap-3">
                                        <p className="text-4xl font-bold">{score}</p>
                                        <span className="text-neutral-500 text-sm">/ 100</span>
                                    </div>
                                    {level && (
                                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 w-fit">
                                            {level}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Signals Snapshot */}
                        <div className="rounded-xl bg-neutral-900 p-6 border border-neutral-800">
                            <h2 className="text-xl font-semibold mb-4">
                                Repository Overview
                            </h2>
                            {loading && !signals ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            ) : (
                                signals && (
                                    <ul className="text-sm space-y-1 text-neutral-300">
                                        <li>Primary Language: {signals.primary_language}</li>
                                        <li>Files: {signals.file_count}</li>
                                        <li>Folders Depth: {signals.folder_depth}</li>
                                        <li>README Present: {signals.readme_present ? "Yes" : "No"}</li>
                                        <li>Tests Folder: {signals.has_tests_folder ? "Yes" : "No"}</li>
                                    </ul>
                                )
                            )}
                        </div>

                        {/* Summary */}
                        <div className="rounded-xl bg-neutral-900 p-6 border border-neutral-800 md:col-span-2">
                            <h2 className="text-xl font-semibold mb-2">Mentor Feedback</h2>
                            {loading && !summary ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            ) : (
                                <div className="text-neutral-300 prose prose-invert max-w-none">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {summary}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>

                        {/* Roadmap */}
                        <div className="rounded-xl bg-neutral-900 p-6 border border-neutral-800 md:col-span-2">
                            <h2 className="text-xl font-semibold mb-2">
                                Improvement Roadmap
                            </h2>
                            {loading && !roadmap ? (
                                <div className="space-y-4">
                                    <Skeleton className="h-6 w-1/3 mb-2" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            ) : (
                                <div className="text-neutral-300 prose prose-invert max-w-none text-sm">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {roadmap}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>

                        {/* Chart */}
                        <div className="rounded-xl bg-neutral-900 p-6 border border-neutral-800 md:col-span-2">
                            <h2 className="text-xl font-semibold mb-4">
                                Commit Activity
                            </h2>
                            {loading && !chartData ? (
                                <Skeleton className="h-64 w-full" />
                            ) : (
                                chartData && <CommitChart data={chartData} />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
