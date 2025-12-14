import { NextResponse } from "next/server";

const GITHUB_API = "https://api.github.com";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN_FINE;

// ------------------
// Utility: Parse repo URL
// ------------------
function parseRepoUrl(url) {
    try {
        const clean = url.replace("https://github.com/", "").replace(/\/$/, "");
        const [owner, repo] = clean.split("/");
        if (!owner || !repo) return null;
        return { owner, repo };
    } catch {
        return null;
    }
}

// ------------------
// Utility: GitHub fetch
// ------------------
async function ghFetch(path) {
    const res = await fetch(`${GITHUB_API}${path}`, {
        headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json",
        },
        next: { revalidate: 0 },
    });

    if (!res.ok) throw new Error(`GitHub API failed: ${path}`);
    return res.json();
}

// ------------------
// Build deterministic signals
// ------------------
function buildSignals({
    repo,
    languages,
    tree,
    commits,
    readme,
}) {
    const files = tree.tree.filter((f) => f.type === "blob");
    const folders = tree.tree.filter((f) => f.type === "tree");

    const languageList = Object.keys(languages || {});
    const primaryLanguage = languageList[0] || "Unknown";

    const readmeText = readme
        ? Buffer.from(readme.content, "base64").toString("utf-8")
        : "";

    const commitDates = commits.map(
        (c) => new Date(c.commit.author.date)
    );

    const weeks = {};
    commitDates.forEach((d) => {
        const week = `${d.getFullYear()}-${Math.ceil(d.getDate() / 7)}`;
        weeks[week] = (weeks[week] || 0) + 1;
    });

    const commitsPerWeek = Object.values(weeks);
    const avgCommitsPerWeek =
        commitsPerWeek.reduce((a, b) => a + b, 0) /
        (commitsPerWeek.length || 1);

    return {
        repo_name: repo.name,
        visibility: repo.private ? "private" : "public",

        primary_language: primaryLanguage,
        languages_used: languageList,

        file_count: files.length,
        folder_depth: Math.max(
            ...folders.map((f) => f.path.split("/").length),
            0
        ),

        has_src_folder: folders.some((f) => f.path === "src"),
        has_tests_folder: folders.some((f) =>
            f.path.includes("test")
        ),
        has_docs_folder: folders.some((f) =>
            f.path.includes("docs")
        ),

        readme_present: Boolean(readme),
        readme_word_count: readmeText.split(/\s+/).length,
        readme_has_setup: /install|setup|usage/i.test(readmeText),

        linting_configured: files.some((f) =>
            f.path.includes("eslint")
        ),
        ci_pipeline_present: files.some((f) =>
            f.path.includes(".github/workflows")
        ),

        commit_count: commits.length,
        avg_commits_per_week: Number(avgCommitsPerWeek.toFixed(2)),
        commit_consistency:
            avgCommitsPerWeek > 3
                ? "consistent"
                : avgCommitsPerWeek > 1
                    ? "moderate"
                    : "irregular",

        project_category:
            files.some((f) => f.path === "package.json")
                ? "web application"
                : "general project",

        // New: Raw commit history for graphing
        weekly_commits: commitsPerWeek.reverse(), // Reverse to show chronological order if needed (GitHub API returns newest first usually, but check logic)
    };
}

// ------------------
// POST handler
// ------------------
export async function POST(req) {
    try {
        const { repoUrl } = await req.json();

        if (!repoUrl || typeof repoUrl !== "string") {
            return NextResponse.json(
                { error: "Valid GitHub repo URL required" },
                { status: 400 }
            );
        }

        const parsed = parseRepoUrl(repoUrl);
        if (!parsed) {
            return NextResponse.json(
                { error: "Invalid GitHub repo URL format" },
                { status: 400 }
            );
        }

        const { owner, repo } = parsed;

        // -------- GitHub API calls (RAW DATA) --------
        const repoInfo = await ghFetch(`/repos/${owner}/${repo}`);
        const languages = await ghFetch(
            `/repos/${owner}/${repo}/languages`
        );
        const commits = await ghFetch(
            `/repos/${owner}/${repo}/commits?per_page=100`
        );
        const tree = await ghFetch(
            `/repos/${owner}/${repo}/git/trees/${repoInfo.default_branch}?recursive=1`
        );

        let readme = null;
        try {
            readme = await ghFetch(
                `/repos/${owner}/${repo}/readme`
            );
        } catch {
            readme = null;
        }

        // -------- Build signals --------
        const signals = buildSignals({
            repo: repoInfo,
            languages,
            tree,
            commits,
            readme,
        });

        return NextResponse.json({
            success: true,
            owner,
            repo,
            signals,
        });
    } catch (err) {
        console.error("Fetch API error:", err);
        return NextResponse.json(
            { success: false, error: "Failed to fetch repository" },
            { status: 500 }
        );
    }
}
