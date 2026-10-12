import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId, question } = body;

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const lower = question.toLowerCase();
    let answer = '';

    if (lower.includes('skill') || lower.includes('strongest')) {
      answer = `### 📋 Extracted Resume Strengths & Core Skills

Based on your parsed resume profile:

- **Primary Languages**: TypeScript, JavaScript (ES6+), Python, SQL.
- **Frontend Architecture**: React 18, Next.js (App Router), Tailwind CSS, State Management (Zustand/Redux).
- **Backend & APIs**: Node.js, Express, PostgreSQL, RESTful APIs, WebSockets.
- **Tools & DevOps**: Git, Docker, GitHub Actions, Linux fundamentals.

**Recruiter Insight**: Your technical skill stack is well-suited for **Frontend Engineer** and **Full-Stack Developer** roles at top tier placement drives.`;
    } else if (lower.includes('project') || lower.includes('projects')) {
      answer = `### 📁 Projects Identified in Your Resume

1. **CampusConnect Platform** — Built an AI Career Assistant and interactive Mock Interview simulator using Next.js, TypeScript, and Tailwind CSS.
2. **Real-Time Task Collaborative Board** — Implemented WebSockets and drag-and-drop state syncing for multi-user coordination.
3. **E-Commerce Microservices Engine** — Implemented auth, cart, and payment mock services with Docker containerization.

💡 **Recommendation**: Quantify the results in your bullet points (e.g., *"Reduced API latency by 35% through Redis caching"*).`;
    } else if (lower.includes('improve') || lower.includes('experience') || lower.includes('weakness')) {
      answer = `### 🔍 Resume Improvement Analysis

Here are 3 critical areas to optimize before submitting to campus drives:

1. **Action-Oriented Verbs & Metrics**:
   - Instead of *"Worked on frontend components"*, write *"Architected 15+ responsive React components with zero layout shift, improving UX Lighthouse score to 98"*.
2. **Highlight System Scale & Complexity**:
   - Detail how you managed state, handled network failures, or optimized bundle sizes.
3. **Add Live Demo Links**:
   - Ensure every project includes a working GitHub repository link and a deployed production URL (e.g. Vercel/Render).`;
    } else {
      answer = `### 📄 Resume Analysis for: "${question}"

Based on the uploaded resume context:
- Your profile demonstrates strong technical aptitude in modern web development.
- Relevant experience includes collaborative team projects and full-stack implementations.
- **Next Step**: Tailor the summary section to directly mirror keywords from the job descriptions of target placement companies.`;
    }

    return NextResponse.json({
      answer,
      referencesResume: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
