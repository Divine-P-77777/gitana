# 🚀 Gitana — AI GitHub Repository Analyzer

**Gitana** is an AI-powered system that evaluates GitHub repositories and converts them into a **Score, Summary, and Personalized Roadmap** — just like feedback from a senior developer or recruiter.

🌐 **Live Demo:** https://git-ana.vercel.app 

---

## 🎯 Problem Statement

A GitHub repository is a developer’s real portfolio, but most students don’t know:
- How clean their code looks
- Whether their project structure is industry-ready
- What exactly they should improve next

Gitana acts as a **“Repository Mirror”**, reflecting strengths, weaknesses, and actionable improvements using AI.

---

## 🧠 Core Idea & Approach

Gitana follows a **signal-based evaluation approach** instead of reading raw code line by line.

### 🔹 Step-by-Step Approach

1. **User submits a GitHub repository URL**
   - Public repositories can be analyzed without login
   - Logged-in users can view history and analyze private repos (GitHub OAuth)

2. **Backend fetches repository data using GitHub APIs**
   - Repository metadata
   - Languages used
   - File & folder structure
   - README & documentation
   - Commit history and frequency
   - Tooling (tests, CI/CD, linting)

3. **Raw GitHub data is converted into structured signals**
   - File count & folder depth
   - Presence of `src/`, `tests/`, `docs/`
   - README quality
   - Commit consistency
   - Automation & tooling indicators

4. **AI evaluates the repository**
   - The AI does **not parse raw source code**
   - It reasons on repository signals like a mentor or recruiter
   - Generates:
     - Score (0–100)
     - Short evaluation summary
     - Personalized improvement roadmap

5. **Visual Insights**
   - Commit history & streaks displayed using charts
   - Helps understand development consistency

---

## 🧩 Tech Stack

- **Frontend:** Next.js (App Router)
- **Authentication:** Clerk
- **Database:** MongoDB
- **AI:** GitHub Marketplace LLM (OpenAI)
- **Charts:** Graph.js
- **APIs:** GitHub REST API

---

## 🔐 Authentication & Tokens

### 🔹 GitHub Personal Access Token (Required)

Gitana uses the GitHub API to fetch repository data.  
You need to generate a **GitHub Personal Access Token (PAT)**.

#### How to Create a GitHub Token:
1. Go to **GitHub → Settings**
2. Open **Developer settings**
3. Click **Personal access tokens**
4. Generate a new token (classic)
5. Enable scopes:
   - `repo` (for private repositories)
   - `read:user`
6. Copy and store the token securely

Add it to your environment variables:

```env
GITHUB_TOKEN=your_personal_access_token
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key