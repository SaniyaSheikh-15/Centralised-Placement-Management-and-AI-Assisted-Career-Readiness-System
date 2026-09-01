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

* **Framework**: React 19 + Vite 8 + React Router DOM v7
* **Styling**: Vanilla CSS Design System with dark mode, glassmorphism, and responsive tokens (`src/index.css`)
* **State Management**: `StudentProfileContext.jsx` with full mock data (`studentProfileMockData.js`)

### Directory Breakdown (`src/features/student-profile/`):
```
src/
├── App.jsx (Root router & layout frame)
├── main.jsx (Entry point)
├── index.css (Core design tokens & theme)
├── components/
│   └── shared/ (Sidebar.jsx, TopNavbar.jsx)
└── features/student-profile/
    ├── context/
    │   └── StudentProfileContext.jsx (Global profile state & draft persistence)
    ├── mock/
    │   └── studentProfileMockData.js (Realistic student dataset)
    ├── utils/
    │   └── profileValidation.js (Form validations for CGPA, URLs, dates)
    ├── pages/
    │   ├── StudentProfileOverviewPage.jsx (/profile)
    │   ├── EditProfilePage.jsx (/profile/edit - 9-step tabbed wizard)
    │   ├── ResumeUploadPage.jsx (/profile/resume - Drag & drop uploader)
    │   ├── SkillsManagementPage.jsx (/profile/skills - Skill chips & proficiencies)
    │   ├── ProjectsPage.jsx (/profile/projects - Project showcase modals)
    │   └── CertificationsPage.jsx (/profile/certifications - Credential cards)
    └── components/
        ├── overview/ (AcademicInfoCard, PersonalInfoCard, PlacementReadinessCard, ProfessionalSummaryCard, OnlinePresenceCard, ProfileHeaderBlock, ResumeSummaryCard)
        ├── edit/ (TabPersonal, TabAcademic, TabSkills, TabProjects, TabInternships, TabCertifications, TabAchievements, TabSocialLinks, TabResume)
        ├── skills/ (AddSkillModal, SkillChip, SkillProficiencyBadge)
        ├── projects/ (ProjectCard, ProjectModal)
        ├── resume/ (ResumeUploader)
        ├── certifications/ (CertificationItem, CertificationModal)
        └── common/ (DeleteConfirmModal, ProfileEmptyState, ProfileErrorState, ProfileSkeletonLoader)
```

---

## 5. Active Git Status & Pull Request Log

* **Current Branch**: `feature/student-profile`
* **Tracking**: `origin/feature/student-profile`
* **Base**: `origin/develop`
* **Merge Conflicts with develop**: **Zero (0)**

### Commit History on Feature Branch:
1. `3d798ba` — `feat(student-profile): add complete student profile builder module, components, and pages`
   - Added all 58 core files and 6,289 lines of code.
2. `6cf3056` — `fix(student-profile): add react dependencies, client-side routing links, and save draft on step navigation`
   - Resolved Copilot review points:
     - Added explicit `"react": "^19.2.0"` and `"react-dom": "^19.2.0"` in `package.json`.
     - Replaced internal `<a>` tags with React Router `<Link>` components across overview cards.
     - Updated `handleNext` in `EditProfilePage.jsx` to execute `saveDraft()` before tab transitions.

---

## 6. Development & Run Commands

```bash
# Start local development server (runs on http://localhost:5173)
npm run dev

# Run production build validation
npx vite build

# Check git status
git status

# Push any future changes to the active PR
git push origin feature/student-profile
```
