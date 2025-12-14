"use client";

import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Filler
);

export default function CommitChart({ data }) {
    if (!data || !data.values || data.values.length === 0) {
        return <div className="text-neutral-500 text-sm flex items-center justify-center h-full">No commit history available</div>;
    }

    // Expecting data.commit_history to be an array of { week: string, count: number }
    // OR based on previous logic, just a raw number was passed? 
    // Let's stick to the previous logic but improve it if possible, 
    // but looking at `api/fetch/route.js`, it calculated `avg_commits_per_week`.
    // The user said "commit graph didn't reflection".
    // To make a REAL graph we need time-series data. 
    // I will check `api/fetch/route.js` again to see if we can get better data.
    // For now, I will assume we might need to modify `api/fetch/route.js` to return `weekly_commits` array,
    // but first I will implement this component to handle an array of numbers.

    // Wait, the previous implementation in dashboard/page.js was:
    // labels: ["Avg Commits / Week"], data: [signals.avg_commits_per_week]
    // That's a point, not a line graph. 

    // Let's handle both. If it's a single number, it's boring. 
    // I'll make it accepting `labels` and `values` props.

    const chartData = {
        labels: data.labels || ["Average"],
        datasets: [
            {
                label: "Commits",
                data: data.values || [],
                tension: 0.4,
                borderColor: "#a855f7", // Purple-500
                backgroundColor: "rgba(168, 85, 247, 0.2)",
                fill: true,
                pointBackgroundColor: "#fff",
                pointBorderColor: "#a855f7",
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: "#171717",
                titleColor: "#fff",
                bodyColor: "#a3a3a3",
                borderColor: "#404040",
                borderWidth: 1,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: "#262626",
                },
                ticks: {
                    color: "#737373",
                }
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: "#737373",
                }
            }
        }
    };

    return (
        <div className="w-full h-64">
            <Line data={chartData} options={options} />
        </div>
    );
}
