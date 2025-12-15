import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Skeleton from "./Skeleton";
import { Map, CheckCircle2 } from "lucide-react";

export default function Roadmap({ loading, roadmap }) {
    if (loading && !roadmap) {
        return (
            <div className="rounded-xl bg-neutral-900 p-6 border border-neutral-800 md:col-span-2">
                <h2 className="text-xl font-semibold mb-2">Improvement Roadmap</h2>
                <div className="space-y-4">
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </div>
        );
    }

    // Custom renderer for list items to add check icons
    const components = {
        li: ({ children }) => (
            <li className="flex items-start gap-3 mb-3">
                <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <span className="text-neutral-300">{children}</span>
            </li>
        ),
        ul: ({ children }) => <ul className="pl-0 list-none">{children}</ul>,
        ol: ({ children }) => <ol className="pl-0 list-none">{children}</ol>,
        h3: ({ children }) => <h3 className="text-lg font-semibold text-white mt-6 mb-3 flex items-center gap-2">{children}</h3>
    };

    return (
        <div className="rounded-xl bg-neutral-900 p-6 border border-neutral-800 md:col-span-2 hover:border-neutral-700 transition-colors">
            <h2 className="text-xl font-semibold mb-6 text-neutral-200 flex items-center gap-2">
                <Map className="w-5 h-5 text-pink-400" />
                Improvement Roadmap
            </h2>

            <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={components}
                >
                    {roadmap}
                </ReactMarkdown>
            </div>
        </div>
    );
}
