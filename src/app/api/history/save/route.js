import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/mongodb";
import Analysis from "@/models/RepoAnalysis";

export async function POST(req) {
    try {
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const {
            repo,
            signals,
            ai,
        } = await req.json();

        if (!repo || !signals || !ai) {
            return NextResponse.json(
                { error: "Invalid payload" },
                { status: 400 }
            );
        }

        await connectDB();

        // Extract numeric score
        const scoreMatch = ai.score?.match(/\d+/);
        const scoreValue = scoreMatch ? Number(scoreMatch[0]) : null;

        const analysis = await Analysis.create({
            userId,
            repo,
            signals,
            ai,
            scoreValue,
        });

        return NextResponse.json({
            success: true,
            id: analysis._id,
        });
    } catch (err) {
        console.error("Save history error:", err);
        return NextResponse.json(
            { error: "Failed to save analysis" },
            { status: 500 }
        );
    }
}
