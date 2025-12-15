import Skeleton from "./Skeleton";
import { FolderGit2, FileText, Code2, BookOpen, TestTube2 } from "lucide-react";

export default function RepoOverview({ loading, signals }) {
    if (loading || !signals) {
        return (
            <div className="rounded-xl bg-neutral-900 p-6 border border-neutral-800">
                <h2 className="text-xl font-semibold mb-4">Overview</h2>
                <div className="space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-5 w-1/2" />
                </div>
            </div>
        );
    }

    const items = [
        {
            label: "Language",
            value: signals.primary_language,
            icon: <Code2 className="w-4 h-4 text-blue-400" />
        },
        {
            label: "Files",
            value: signals.file_count,
            icon: <FileText className="w-4 h-4 text-emerald-400" />
        },
        {
            label: "Folders Depth",
            value: signals.folder_depth,
            icon: <FolderGit2 className="w-4 h-4 text-yellow-400" />
        },
        {
            label: "README",
            value: signals.readme_present ? "Present" : "Missing",
            icon: <BookOpen className={`w-4 h-4 ${signals.readme_present ? "text-green-400" : "text-red-400"}`} />
        },
        {
            label: "Tests",
            value: signals.has_tests_folder ? "Found" : "Missing",
            icon: <TestTube2 className={`w-4 h-4 ${signals.has_tests_folder ? "text-green-400" : "text-red-400"}`} />
        },
    ];

    return (
        <div className="rounded-xl bg-neutral-900 p-6 border border-neutral-800 hover:border-neutral-700 transition-colors">
            <h2 className="text-xl font-semibold mb-4 text-neutral-200">
                Repository DNA
            </h2>
            <ul className="space-y-3">
                {items.map((item, idx) => (
                    <li key={idx} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-neutral-400">
                            {item.icon}
                            <span>{item.label}</span>
                        </div>
                        <span className="font-medium text-neutral-200">{item.value}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
