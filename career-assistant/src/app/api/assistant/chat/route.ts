import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId, message, conversationId } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const convId = conversationId || `conv-${Date.now()}`;
    const reply = generateAiCareerReply(message);

    return NextResponse.json({
      conversationId: convId,
      reply,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

function generateAiCareerReply(prompt: string): string {
  const lower = prompt.toLowerCase();

  if (lower.includes('data scientist') || lower.includes('data science')) {
    return `### 📊 Data Scientist Career Blueprint

To build a high-impact profile for **Data Science & ML**, here is the recommended structure:

1. **Foundational Mathematics & Stats**:
   - Probability distributions, hypothesis testing, Bayesian inference, and linear algebra.
2. **Core Python Ecosystem**:
   - \`NumPy\`, \`Pandas\`, \`Scikit-learn\`, \`Statsmodels\`, and \`Matplotlib\`/\`Seaborn\`.
3. **Advanced Machine Learning & AI**:
   - Tree models (XGBoost, LightGBM), Neural Networks (PyTorch/TensorFlow), and NLP/LLM fine-tuning.
4. **Data Infrastructure**:
   - Advanced SQL (window functions, query plans), Docker, and MLflow for experiment tracking.

\`\`\`python
# Example: Production ML Pipeline Skeleton
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import GradientBoostingClassifier

pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('model', GradientBoostingClassifier(n_estimators=100, learning_rate=0.05))
])
\`\`\`

Would you like me to construct an 8-week structured daily learning roadmap for this role?`;
  }

  if (lower.includes('project') || lower.includes('projects')) {
    return `### 🚀 3 High-Impact Technical Projects to Stand Out

Here are three industry-grade projects that impress recruiters and placement interviewers:

1. **Distributed Real-time Collaboration Engine**
   - **Tech Stack**: Next.js, Node.js, WebSockets, Redis Pub/Sub, CRDTs.
   - **Key Feature**: Real-time collaborative document editing with conflict resolution.

2. **AI-Powered Code Review & Security Scanner**
   - **Tech Stack**: TypeScript, Python, AST Parsers, OpenAI/Anthropic API, Docker.
   - **Key Feature**: Pull request automated analysis flagging vulnerabilities and cyclomatic complexity.

3. **High-Throughput Event-Driven Analytics Pipeline**
   - **Tech Stack**: Go/Node.js, Apache Kafka, ClickHouse/PostgreSQL, Grafana.
   - **Key Feature**: Ingestion of 10,000+ events/sec with real-time metric visualization.

Would you like the architecture diagram and database schema for any of these?`;
  }

  if (lower.includes('interview') || lower.includes('prep') || lower.includes('plan')) {
    return `### 🎯 4-Week Placement Interview Master Plan

| Week | Focus Area | Daily Target | Key Deliverable |
| :--- | :--- | :--- | :--- |
| **Week 1** | DSA Fundamentals | 3 Medium LeetCode (Arrays, Trees, DP) | 20 Solved Problems |
| **Week 2** | System Design & Arch | Read 2 Real-world System Architectures | Design URL Shortener & Chat App |
| **Week 3** | Core CS & DBs | Operating Systems, DBMS indexing, Networks | 100 Flashcards reviewed |
| **Week 4** | Mock Interviews | 1 AI Mock Interview daily + Behavioral STAR prep | 5 Mock Interviews Completed |

👉 **Pro-tip**: Hop over to the **Mock Interview** tab in the sidebar to test your live answers against our AI interviewer!`;
  }

  return `### 💡 Career Guidance & Strategic Advice

Here is targeted guidance regarding **"${prompt}"**:

1. **Master High-Demand Fundamentals**:
   - Strong problem-solving skills (DSA) combined with modern framework mastery give you the highest competitive advantage.
2. **Build Proof of Competence**:
   - Replace generic tutorial clones on your resume with deployed, production-ready full-stack systems that solve actual problems.
3. **Practice Technical Articulation**:
   - In campus placements, communicating your technical reasoning clearly is just as critical as writing correct code.

How else can I help you prepare for your upcoming placement opportunities?`;
}
