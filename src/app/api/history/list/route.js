import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import Analysis from "@/models/RepoAnalysis";

export async function GET() {
    try {
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        const history = await Analysis.find({ userId })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

        return NextResponse.json({
            success: true,
            history,
        });
    } catch (err) {
        console.error("Fetch history error:", err);
        return NextResponse.json(
            { error: "Failed to fetch history" },
            { status: 500 }
        );
    }
}
