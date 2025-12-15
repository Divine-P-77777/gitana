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
        labels: data.labels || [],
        datasets: [
            {
                label: "Commits",
                data: data.values || [],
                tension: 0.4,
                borderColor: "#a855f7", // Purple-500
                backgroundColor: "rgba(168, 85, 247, 0.1)",
                borderWidth: 3,
                fill: true,
                pointBackgroundColor: "#171717",
                pointBorderColor: "#a855f7",
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: "#a855f7",
                pointHoverBorderColor: "#fff",
                pointHoverBorderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 1500,
            easing: 'easeOutQuart',
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: "rgba(23, 23, 23, 0.9)", // neutral-900
                titleColor: "#fff",
                bodyColor: "#d4d4d4", // neutral-300
                borderColor: "#404040", // neutral-700
                borderWidth: 1,
                padding: 10,
                displayColors: false,
                callbacks: {
                    label: (context) => `Commits: ${context.parsed.y}`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                border: { dash: [4, 4] },
                grid: {
                    color: "#262626", // neutral-800
                    drawBorder: false,
                },
                ticks: {
                    color: "#737373", // neutral-500
                    padding: 10,
                }
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: "#737373", // neutral-500
                    padding: 10,
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
