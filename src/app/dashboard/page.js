"use client";

import { useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { Download } from "lucide-react";
import { toPng } from "html-to-image";

// Components
import CommitChart from "../components/CommitChart";
import Skeleton from "../components/Skeleton";
import ScoreCard from "../components/ScoreCard";
import RepoOverview from "../components/RepoOverview";
import MentorFeedback from "../components/MentorFeedback";
import Roadmap from "../components/Roadmap";

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

    const reportRef = useRef(null);

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

    // Prepare chart data
    const chartData = signals?.weekly_commits
        ? {
            labels: signals.weekly_commits.map((_, i) => `Week ${i + 1}`),
            values: signals.weekly_commits,
        }
        : null;

    // Download handler
    const handleDownload = async () => {
        if (!reportRef.current) return;

        try {
            const dataUrl = await toPng(reportRef.current, {
                backgroundColor: "#0a0a0a",
                cacheBust: true,
                pixelRatio: 2,
            });

            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = `gitana-report-${new Date().toISOString().slice(0, 10)}.png`;
            link.click();
        } catch (err) {
            console.error("Download failed:", err);
            alert("Failed to download report. Please check the console for details.");
        }
    };

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
                        className="flex-1 rounded-lg bg-neutral-900 border border-neutral-800 px-4 py-3 outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-700 transition-all placeholder:text-neutral-600"
                    />
                    <button
                        onClick={analyzeRepo}
                        disabled={loading}
                        className="rounded-lg bg-white text-black px-6 py-3 font-medium hover:bg-neutral-200 disabled:opacity-50 transition-colors"
                    >
                        {loading ? "Analyzing..." : "Analyze"}
                    </button>
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Results Section */}
                {(loading || signals) && (
                    <div className="space-y-6">
                        {/* Download Prompt */}
                        {!loading && score && (
                            <div className="flex justify-end">
                                <button
                                    onClick={handleDownload}
                                    className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    Download Report
                                </button>
                            </div>
                        )}

                        {/* Report Container (captured for download) */}
                        <div ref={reportRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-950 p-4 rounded-xl">
                            <ScoreCard loading={loading} score={score} level={level} />

                            <RepoOverview loading={loading} signals={signals} />

                            <MentorFeedback loading={loading} summary={summary} />

                            <Roadmap loading={loading} roadmap={roadmap} />

                            {/* Chart */}
                            <div className="rounded-xl bg-neutral-900 p-6 border border-neutral-800 md:col-span-2">
                                <h2 className="text-xl font-semibold mb-4 text-neutral-200">
                                    Commit Activity
                                </h2>
                                {loading && !chartData ? (
                                    <Skeleton className="h-64 w-full" />
                                ) : (
                                    chartData && <CommitChart data={chartData} />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
