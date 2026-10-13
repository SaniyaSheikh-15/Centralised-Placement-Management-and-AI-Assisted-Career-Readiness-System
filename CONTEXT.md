# PROJECT & MODULE MASTER CONTEXT

> **Document Purpose**: Complete reference context for the **Centralised Placement Management & AI-Assisted Career Readiness System** with a focus on the **Student Profile Builder** module. Use this file as the primary source of truth across all future sessions.

---

## 1. Project & Repository Information

* **Project Title**: Centralised Placement Management and AI-Assisted Career Readiness System (SIH Project)
* **Central GitHub Repository**: [SaniyaSheikh-15/Centralised-Placement-Management-and-AI-Assisted-Career-Readiness-System](https://github.com/SaniyaSheikh-15/Centralised-Placement-Management-and-AI-Assisted-Career-Readiness-System)
* **Collaborator Account**: [mohduzaifahkhan](https://github.com/mohduzaifahkhan) (`uzaifkhan015@gmail.com`)
* **Assigned Module**: **Student Profile Builder**
* **Assigned Branch**: `feature/student-profile`
* **Current Active Pull Request**: [Pull Request #5](https://github.com/SaniyaSheikh-15/Centralised-Placement-Management-and-AI-Assisted-Career-Readiness-System/pull/5)

---

## 2. Team Branching Structure & GitFlow Guidelines

Defined by Team Lead **Saniya Sheikh**:

```
main (Production)
└── develop (Central Integration)
    ├── feature/auth-foundation (or feature/authentication)
    ├── feature/student-profile          <-- OUR ASSIGNED MODULE
    ├── feature/placement-workflow       <-- PR #3 (Aafreen-Khan7)
    ├── feature/analytics-dashboard      <-- PR #2 (vijayanaghate05)
    ├── feature/ai-career-analysis       <-- PR #4 (lubnakhaan09)
    └── feature/career-assistant
```

### Core Collaboration Rules:
1. **Never push directly to `main` or `develop`**.
2. All feature branches must branch off `origin/develop`.
3. Standard workflow: `Work -> Commit -> Push to feature/* -> Open PR to develop -> Review -> Merge`.
4. Keep commit authorship strictly mapped to `mohduzaifahkhan <uzaifkhan015@gmail.com>`.

---

## 3. Database Architecture (29 Relational Tables)

The overall system is designed with a frozen v1.0 schema consisting of 29 PostgreSQL tables across 6 modules:

### A. Master & Authentication Module
* `roles` (`Student`, `Recruiter`, `Placement Officer`, `System Administrator`)
* `branches` (20 engineering branches, e.g. CSE, AIDS, AIML, IT, ECE)
* `job_roles` (75 standardized career profiles, e.g. SDE, Data Scientist)
* `skills` (100+ technical and soft skills)
* `users` (User credentials, verification status, contact info)
* `user_roles` (RBAC mapping)
* `refresh_tokens` (JWT session management)
* `otps` (6-digit OTP codes for email verification & password reset)
* `tp_access_requests` (Institutional TPO onboarding & approval queue)

### B. Student Profile Module (Our Domain)
* `student_profiles` (Enrollment, CGPA, semester, backlogs, bio, readiness %)
* `student_skills` (Proficiency levels: Beginner, Intermediate, Expert)
* `projects` (Title, description, GitHub URL, live demo URL, dates)
* `project_skills` (Many-to-many link between projects and skills)
* `certifications` (Name, organization, dates, credential link)
* `resumes` (File name, storage path, version, is_default, size)

### C. Recruiter & Placement Drive Module
* `companies` (Company details, website, industry, logo)
* `recruiters` (Recruiter user link to company, designation)
* `placement_drives` (Drive title, packages LPA, vacancies, deadlines)
* `eligibility_rules` (Min CGPA, max backlogs, 10th/12th % criteria)
* `drive_branches` (Eligible academic branches per drive)
* `drive_skills` (Required skills & min proficiency)
* `drive_documents` (Drive attachments & brochures)

### D. Applications & Interviews Module
* `applications` (Student application state machine: `APPLIED` -> `SHORTLISTED` -> `SELECTED` / `REJECTED`)
* `interview_stages` (Sequence-ordered stages: Assessment, Tech 1, Tech 2, HR)
* `interview_rounds` (Schedules, meet links, scores, round status)
* `placement_results` (Final offers, CTC package, joining status)

### E. AI Career Readiness & Notification Module
* `resume_analysis` (ATS score, keyword gaps, strengths, suggestions)
* `skill_gap_reports` (Target role missing skills, recommended courses)
* `mock_interviews` (Fluency, confidence, grammar, technical score, AI feedback)
* `career_chat` (AI student career advisory Q&A history)
* `notifications` (System alerts & interview notifications)

---

## 4. Student Profile Builder — Frontend Architecture

* **Framework**: Next.js 16.3.3 (App Router with Turbopack) + React 19 + TypeScript 5
* **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`) + `src/app/globals.css` with dark mode tokens
* **State Management**: `StudentProfileContext.tsx` with full mock data (`studentProfileMockData.ts`)

### Directory Breakdown:
```
src/
├── app/
│   ├── globals.css                # Master dark-theme CSS & Tailwind v4
│   ├── layout.tsx                 # Root layout with Provider & Inter font
│   ├── page.tsx                   # Redirect -> /profile
│   └── profile/
│       ├── layout.tsx             # Sidebar + Navbar shell
│       ├── page.tsx               # Dashboard Overview (3 card rows with dividers)
│       ├── edit/page.tsx          # 9-step Edit wizard
│       ├── drives/page.tsx        # Placement Drives
│       ├── applications/page.tsx  # My Applications Tracker
│       ├── eligibility/page.tsx   # Drive Eligibility Checker
│       ├── resume/page.tsx        # Resume Analyzer & ATS checklist
│       ├── placement-match/page.tsx # AI Placement Match Scores
│       ├── skill-gap/page.tsx     # Skill Gap Analysis
│       ├── assistant/page.tsx     # AI Career Assistant
│       ├── mock-interview/page.tsx # Mock Interview Studio
│       ├── analytics/page.tsx     # Placement Readiness Analytics
│       ├── skills/page.tsx        # Skills management
│       ├── projects/page.tsx      # Projects showcase
│       └── certifications/page.tsx # Certifications
├── components/
│   ├── shared/
│   │   ├── Sidebar.tsx            # Left nav (CampusConnect logo, user card, 11 links, logout)
│   │   └── TopNavbar.tsx          # Top bar with route title, search, notifications, avatar
│   ├── student-profile/
│   │   ├── common/                # DeleteModal, Empty, Error, Skeleton (4 variants)
│   │   ├── overview/              # 7 Overview cards + HeaderBlock + EligibilityBanner
│   │   ├── edit/                  # 9 Tab components (Personal -> Resume)
│   │   ├── skills/                # AddSkillModal, SkillChip, ProficiencyBadge
│   │   ├── projects/              # ProjectCard, ProjectModal
│   │   ├── certifications/        # CertificationItem, CertificationModal
│   │   └── resume/                # ResumeUploader (drag-drop, progress, preview)
│   └── ui/                        # 17 Base-UI/shadcn primitives
├── features/
│   └── student-profile/
│       ├── context/               # StudentProfileContext.tsx (CRUD + draft + tabs)
│       ├── mock/                  # studentProfileMockData.ts (default + empty)
│       └── utils/                 # profileValidation.ts (validators + masks)
├── lib/
│   └── utils.ts                   # cn() helper
└── types/
    └── student-profile.ts         # Complete domain TypeScript types
```

---

## 5. Development & Run Commands

```bash
# Start local development server (runs on http://localhost:3000)
npm run dev

# Run TypeScript type check
npx tsc --noEmit

# Run production build validation
npm run build

# Check git status
git status
```
