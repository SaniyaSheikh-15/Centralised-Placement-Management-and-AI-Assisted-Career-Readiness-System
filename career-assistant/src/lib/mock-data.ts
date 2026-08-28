import { ChatMessage } from '@/types/career-assistant';
import { InterviewQuestion, InterviewResultSummary, InterviewHistoryItem } from '@/types/mock-interview';

// ─── Career Assistant Mock Data ───────────────────────────────────────────────

export const suggestedPrompts = [
  "What should I learn for a Data Scientist role?",
  "Suggest 3 high-impact full-stack projects to build",
  "How can I improve my technical resume summary?",
  "Create a 4-week preparation plan for technical interviews",
  "What are the most in-demand skills for 2025?",
  "Compare SDE-1 vs Frontend Engineer career paths",
];

export const resumePrompts = [
  "What projects have I mentioned?",
  "What are my strongest skills?",
  "How can I improve my experience section?",
  "Rate my resume for a Software Engineer role",
  "What keywords am I missing for an ML Engineer position?",
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content: `Welcome to **CampusConnect Career Assistant**! 🚀\n\nI'm here to help you with:\n- 🎯 **Career guidance** and role recommendations\n- 📝 **Resume analysis** and improvement tips\n- 📚 **Learning roadmaps** tailored to your goals\n- 💼 **Interview preparation** strategies\n\nWhat would you like to explore today?`,
    timestamp: new Date(Date.now() - 120000).toISOString(),
  },
  {
    id: '2',
    role: 'user',
    content: 'What should I learn for a Data Scientist role?',
    timestamp: new Date(Date.now() - 60000).toISOString(),
  },
  {
    id: '3',
    role: 'assistant',
    content: `Great question! Here's a structured roadmap for becoming a **Data Scientist**:\n\n### 📊 Core Skills\n1. **Python** — NumPy, Pandas, Scikit-learn, Matplotlib\n2. **Statistics & Probability** — Hypothesis testing, distributions, Bayesian inference\n3. **Machine Learning** — Supervised & unsupervised learning, model evaluation\n4. **SQL** — Complex queries, window functions, database optimization\n\n### 🔬 Advanced Topics\n- Deep Learning (TensorFlow/PyTorch)\n- Natural Language Processing\n- Computer Vision fundamentals\n- Feature Engineering & Selection\n\n### 🛠️ Tools & Platforms\n- Jupyter Notebooks\n- Git & GitHub\n- Docker basics\n- Cloud platforms (AWS SageMaker / GCP Vertex AI)\n\n### 📈 Recommended Project Ideas\n1. **Customer Churn Prediction** — Classification with real-world data\n2. **Sentiment Analysis Dashboard** — NLP + web visualization\n3. **Image Classification App** — CNN with deployment\n\nWould you like me to create a detailed 8-week study plan?`,
    timestamp: new Date(Date.now() - 30000).toISOString(),
  },
];

// ─── Guidance Mock Data ───────────────────────────────────────────────────────

export const mockGuidanceData = {
  recommendedRole: 'Full-Stack Developer',
  reasoning: 'Based on your strong JavaScript/TypeScript skills, React projects, and Node.js experience, a Full-Stack Developer role aligns perfectly with your current skill set while offering room for growth.',
  skillsToLearn: ['System Design', 'Docker & Kubernetes', 'CI/CD Pipelines', 'GraphQL', 'Redis', 'AWS/GCP Cloud Services'],
  projectsToBuild: [
    { title: 'Real-time Collaborative Editor', description: 'Build a Google Docs-like editor using WebSockets and CRDTs for conflict resolution' },
    { title: 'Microservices E-Commerce Platform', description: 'Implement an e-commerce backend with separate services for auth, products, orders, and payments' },
    { title: 'CI/CD Dashboard', description: 'Create a deployment monitoring tool that tracks build pipelines and visualizes deployment metrics' },
  ],
  certifications: [
    'AWS Certified Developer – Associate',
    'Google Cloud Professional Cloud Developer',
    'MongoDB Certified Developer',
    'Docker Certified Associate',
  ],
  roadmap: [
    { step: 'Master TypeScript & Advanced React Patterns', order: 1 },
    { step: 'Learn System Design Fundamentals', order: 2 },
    { step: 'Build & Deploy Microservices Projects', order: 3 },
    { step: 'Get Cloud Certification (AWS/GCP)', order: 4 },
    { step: 'Contribute to Open Source Projects', order: 5 },
    { step: 'Practice DSA & System Design Interviews', order: 6 },
  ],
};

// ─── Mock Interview Mock Data ─────────────────────────────────────────────────

export const mockInterviewQuestions: InterviewQuestion[] = [
  {
    id: 'q1',
    questionNumber: 1,
    questionText: 'Explain the difference between REST and GraphQL APIs. When would you choose one over the other?',
    category: 'Technical',
    userAnswer: 'REST uses fixed endpoints with different HTTP methods, while GraphQL has a single endpoint where clients specify exactly what data they need. I would choose REST for simple CRUD APIs and GraphQL when clients need flexible queries or when dealing with complex, interconnected data.',
    aiSuggestedAnswer: 'REST (Representational State Transfer) uses multiple endpoints mapped to resources, with standard HTTP methods (GET, POST, PUT, DELETE). GraphQL uses a single endpoint with a query language that lets clients request exactly the data they need, avoiding over-fetching and under-fetching. Choose REST for simple, well-defined APIs with caching needs. Choose GraphQL for complex data relationships, mobile apps needing bandwidth efficiency, or when multiple clients need different data shapes from the same API.',
    feedback: 'Good foundational understanding. Consider mentioning caching strategies, versioning differences, and N+1 query problems in GraphQL.',
    score: 78,
  },
  {
    id: 'q2',
    questionNumber: 2,
    questionText: 'Describe a challenging project you worked on. What was your role and how did you handle obstacles?',
    category: 'Behavioral',
    userAnswer: 'I led the frontend development of a real-time dashboard for monitoring server health. The main challenge was handling WebSocket connections that would frequently drop. I implemented an exponential backoff reconnection strategy and added a local message queue to prevent data loss during disconnections.',
    aiSuggestedAnswer: 'A strong answer should follow the STAR method: Situation (project context), Task (your specific responsibility), Action (steps you took), Result (measurable outcome). Include specific technologies, team size, timeline, and quantifiable results like performance improvements or user satisfaction metrics.',
    feedback: 'Excellent use of specific technical details. Could improve by adding quantifiable results and team dynamics.',
    score: 85,
  },
  {
    id: 'q3',
    questionNumber: 3,
    questionText: 'What is the time complexity of searching in a balanced BST vs a hash table? Explain trade-offs.',
    category: 'Technical',
    userAnswer: 'A balanced BST has O(log n) search time while a hash table has O(1) average case. However, hash tables can degrade to O(n) with many collisions. BSTs maintain ordered data which is useful for range queries, while hash tables are better for exact lookups.',
    aiSuggestedAnswer: 'Balanced BST: O(log n) guaranteed for search, insert, delete. Maintains sorted order, supports range queries and in-order traversal efficiently. Hash Table: O(1) average, O(n) worst case. Better for exact key lookups. Trade-offs include: memory usage (hash tables may waste space), ordering (BSTs naturally ordered), worst case guarantees (BSTs more predictable), and cache performance (arrays in hash tables may be more cache-friendly).',
    feedback: 'Strong understanding of both data structures. Mentioning cache performance and memory trade-offs would elevate the answer.',
    score: 82,
  },
  {
    id: 'q4',
    questionNumber: 4,
    questionText: 'How do you ensure code quality in a team environment?',
    category: 'Behavioral',
    userAnswer: 'I believe in a multi-layered approach: comprehensive code reviews, automated testing (unit and integration), linting rules enforced in CI, and pair programming for complex features. I also advocate for clear documentation and consistent coding standards.',
    aiSuggestedAnswer: 'Code quality in teams requires: 1) Automated pipelines (linting, formatting, type checking in CI/CD), 2) Testing strategy (unit, integration, E2E with coverage thresholds), 3) Code review culture (constructive feedback, PR templates), 4) Documentation (ADRs, README, inline comments for complex logic), 5) Pair/mob programming for knowledge sharing, 6) Regular refactoring sessions and tech debt tracking.',
    feedback: 'Well-rounded answer covering multiple aspects. Consider adding specific tools and metrics you track.',
    score: 80,
  },
  {
    id: 'q5',
    questionNumber: 5,
    questionText: 'Design a URL shortener service. Discuss the high-level architecture and key decisions.',
    category: 'Technical',
    userAnswer: 'I would use a base62 encoding of an auto-incrementing ID to generate short URLs. The architecture would include an API gateway, a URL service for CRUD operations, a Redis cache for hot URLs, and a relational database for persistence. For analytics, I would use a separate event-driven pipeline.',
    aiSuggestedAnswer: 'Key components: 1) API layer for create/redirect/analytics, 2) ID generation (auto-increment, UUID, or distributed ID generator like Snowflake), 3) Base62 encoding for short codes, 4) Storage: SQL for metadata + Redis for caching hot URLs, 5) Redirect: 301 (permanent) vs 302 (temporary) trade-offs, 6) Analytics pipeline using Kafka + async processing, 7) Rate limiting and abuse prevention. Scale considerations: read-heavy workload, eventual consistency acceptable for analytics.',
    feedback: 'Solid architecture covering most key components. Discuss 301 vs 302 redirects and rate limiting for a more complete answer.',
    score: 75,
  },
];

export const mockInterviewResult: InterviewResultSummary = {
  interviewId: 'int-001',
  role: 'Full-Stack Developer',
  date: '2025-01-15T10:30:00Z',
  difficulty: 'Intermediate',
  overallScore: 82,
  scoreBreakdown: {
    technical: 85,
    communication: 78,
    confidence: 81,
    relevance: 88,
  },
  strengths: [
    'Strong technical fundamentals in data structures and system design',
    'Clear and structured communication with specific examples',
    'Good understanding of modern development practices and tools',
    'Effective use of the STAR method in behavioral responses',
    'Demonstrates practical experience with real-world problem solving',
  ],
  improvements: [
    'Include more quantifiable metrics when discussing project outcomes',
    'Deepen knowledge of distributed systems and scalability patterns',
    'Practice time management — some answers were overly detailed',
    'Mention error handling and edge cases in system design answers',
    'Strengthen knowledge of cloud services and deployment strategies',
  ],
  questions: mockInterviewQuestions,
};

export const mockInterviewHistory: InterviewHistoryItem[] = [
  {
    sessionId: 'int-001',
    date: '2025-01-15',
    role: 'Full-Stack Developer',
    difficulty: 'Intermediate',
    overallScore: 82,
    technical: 85,
    communication: 78,
  },
  {
    sessionId: 'int-002',
    date: '2025-01-10',
    role: 'Frontend Engineer',
    difficulty: 'Advanced',
    overallScore: 76,
    technical: 80,
    communication: 72,
  },
  {
    sessionId: 'int-003',
    date: '2025-01-05',
    role: 'Data Scientist',
    difficulty: 'Beginner',
    overallScore: 91,
    technical: 88,
    communication: 95,
  },
  {
    sessionId: 'int-004',
    date: '2024-12-28',
    role: 'SDE-1',
    difficulty: 'Intermediate',
    overallScore: 68,
    technical: 72,
    communication: 65,
  },
  {
    sessionId: 'int-005',
    date: '2024-12-20',
    role: 'Cloud Architect',
    difficulty: 'Advanced',
    overallScore: 45,
    technical: 42,
    communication: 50,
  },
];

// ─── Role options for interview setup ─────────────────────────────────────────

export const roleOptions = [
  'Frontend Engineer',
  'Backend Engineer',
  'Full-Stack Developer',
  'Data Scientist',
  'ML Engineer',
  'SDE-1',
  'SDE-2',
  'Cloud Architect',
  'DevOps Engineer',
  'Mobile Developer',
  'Product Manager',
  'UI/UX Designer',
];
