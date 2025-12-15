import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Skeleton from "./Skeleton";
import { MessageSquareQuote } from "lucide-react";

export default function MentorFeedback({ loading, summary }) {
    if (loading && !summary) {
        return (
            <div className="rounded-xl bg-neutral-900 p-6 border border-neutral-800 md:col-span-2">
                <h2 className="text-xl font-semibold mb-2">Mentor Feedback</h2>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl bg-neutral-900 p-6 border border-neutral-800 md:col-span-2 relative overflow-hidden group hover:border-neutral-700 transition-colors">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <MessageSquareQuote size={64} />
            </div>

            <h2 className="text-xl font-semibold mb-4 text-neutral-200 flex items-center gap-2">
                <MessageSquareQuote className="w-5 h-5 text-purple-400" />
                Mentor Feedback
            </h2>

            <div className="text-neutral-300 prose prose-invert max-w-none prose-p:leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {summary}
                </ReactMarkdown>
            </div>
        </div>
    );
}
