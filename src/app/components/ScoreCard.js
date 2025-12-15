import Skeleton from "./Skeleton";

export default function ScoreCard({ loading, score, level }) {
    if (loading && !score) {
        return (
            <div className="rounded-xl bg-neutral-900 p-6 border border-neutral-800 flex flex-col justify-between">
                <h2 className="text-xl font-semibold mb-2">Score</h2>
                <div className="space-y-2">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-4 w-16" />
                </div>
            </div>
        );
    }

    // Color coding based on score
    const getScoreColor = (s) => {
        const num = parseInt(s);
        if (isNaN(num)) return "text-white";
        if (num >= 90) return "text-emerald-400";
        if (num >= 70) return "text-blue-400";
        if (num >= 50) return "text-yellow-400";
        return "text-red-400";
    };

    return (
        <div className="rounded-xl bg-neutral-900 p-6 border border-neutral-800 flex flex-col justify-between hover:border-neutral-700 transition-colors">
            <h2 className="text-xl font-semibold mb-2 text-neutral-200">Repository Score</h2>

            <div className="flex flex-col gap-2">
                <div className="flex items-baseline gap-3">
                    <p className={`text-5xl font-bold tracking-tighter ${getScoreColor(score)}`}>
                        {score}
                    </p>
                    <span className="text-neutral-500 text-sm font-medium">/ 100</span>
                </div>

                {level && (
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-neutral-300 border border-white/10 w-fit capitalize">
                        {level}
                    </div>
                )}
            </div>
        </div>
    );
}
