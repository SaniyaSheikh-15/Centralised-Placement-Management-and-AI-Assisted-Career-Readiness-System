# CAMPUSCONNECT — CODEBASE STATE & PROGRESS SNAPSHOT

> **Context Snapshot Date**: October 13, 2026  
> **Repository**: `SaniyaSheikh-15/Centralised-Placement-Management-and-AI-Assisted-Career-Readiness-System`  
> **Collaborator**: `mohduzaifahkhan` (`uzaifkhan015@gmail.com`)  
> **Module**: **Student Profile Builder & Placement Dashboard** (`feature/student-profile`)  
> **Pull Request**: [PR #13](https://github.com/SaniyaSheikh-15/Centralised-Placement-Management-and-AI-Assisted-Career-Readiness-System/pull/13) — Pushed (8 commits) & under review  
> **Purpose**: Master context file recording all completed work, architecture, design system, type definitions, component status, routes, and git state for seamless model handover.

---

## 1. Project Overview & Architecture

### System Goal
A centralised placement management and AI-assisted career readiness portal built for universities, students, recruiters, and placement officers (TPOs).

### Technology Stack
- **Framework**: Next.js 16.3.3 (App Router with Turbopack)
- **Runtime / UI**: React 19.2.8 + React DOM 19.2.8
- **Language**: TypeScript 5 (Strict mode)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`) + `tw-animate-css`
- **UI Primitives**: Base UI (`@base-ui/react` ^1.7.0) + shadcn/ui patterns + `class-variance-authority` + `clsx` + `tailwind-merge`
- **Icons**: `lucide-react` (^1.35.0) — Verified compatible icons used across all modules.
- **Database**: PostgreSQL with 29 frozen relational tables across 6 modules (schema located at `database/sql/placement_management_v1.sql`).

### Git & Branching Rules
- **Branch**: `feature/student-profile` (module branch)
- **Rule**: Nobody pushes directly to `main` or `develop`. All work goes to feature branches, then PR → review → merge into `develop`.
- **Authorship**: Strictly mapped to `mohduzaifahkhan <uzaifkhan015@gmail.com>`.

---

## 2. Completed Work & Features

### A. Configuration & Setup
- [x] `package.json` — Next.js 16.3.3, React 19, Tailwind v4, Base UI, Lucide React, TypeScript
- [x] `tsconfig.json` — Configured with path aliases (`@/*` -> `./src/*`)
- [x] `components.json` — shadcn UI component configuration (Base UI preset)
- [x] `postcss.config.mjs` & `eslint.config.mjs` — Configured for Tailwind v4 and Next.js ESLint

### B. Styling & Design Tokens (`src/app/globals.css`)
- [x] Full dark theme color palette matching original `#050B14` design system
- [x] CSS variables for cards (`--bg-card: #0F1D32`), borders (`--border-card: #1E3045`), primary accents (`--accent-primary: #1683FF`), secondary accents (`--accent-secondary: #7C5CFC`), and status indicators
- [x] Custom animations: `fadeIn`, `slideUp`, `slideInLeft`, `skeleton-pulse`
- [x] Custom scrollbar styling and utility classes (`gradient-text`, `animate-skeleton`, etc.)

### C. Types (`src/types/student-profile.ts`)
- [x] Complete TypeScript interfaces matching Section 6 PRD & 29-table DB schema:
  - `PersonalInfo` (Core identity, family, IDs, branch, phone, email, addresses)
  - `AcademicInfo` (Enrollment, degree, SSC, HSC, CGPA, backlogs, graduation year)
  - `PlacementReadiness` (Interests, aptitude, English communication, relocation)
  - `TechnicalSkill`, `Certification`, `Internship`, `Project`, `Achievement`
  - `OnlinePresence` (GitHub, LinkedIn, Portfolio, Coding Profile)
  - `Resume` (File, name, size, upload date)
  - `StudentProfile` (Root consolidated interface)

### D. State Management & Context (`src/features/student-profile/`)
- [x] `context/StudentProfileContext.tsx`:
  - Full React Context provider managing `profile` and `editDraft` state
  - CRUD operations for: Skills, Projects, Certifications, Internships, Achievements, Resume, Soft Skills
  - Form section updates for Personal, Academic, Placement Readiness, Online Presence
  - Multi-step draft management (`saveDraft()`, `resetDraft()`)
  - Tab navigation state (`activeEditTab`, `setActiveEditTab`)
  - UI simulators (`simulateLoading()`, `simulateError()`, `clearError()`)
- [x] `mock/studentProfileMockData.ts`:
  - Rich, realistic default student profile mock data (`defaultMockProfile`)
  - Empty profile (`emptyMockProfile`) for testing empty states
- [x] `utils/profileValidation.ts`:
  - Validation routines for CGPA (0.00-10.00), percentages, URLs, email, phone, dates, Aadhaar (12-digit), PAN (ABCDE1234F), resume files (PDF <= 5MB)
  - Input masks: `maskPhone`, `maskAadhaar`, `maskPAN`, `maskNumericOnly`

### E. Shell & Navigation (CampusConnect UI Specification)
- [x] **`src/components/shared/Sidebar.tsx`**:
  - **Brand Header**: 4-pointed cyan star icon (`#38BDF8`) with bold `CampusConnect` branding.
  - **User Account Card**: Placed directly beneath logo with gradient avatar circle (`AS`), student full name (`Aryan Sharma`), and `"Student account"` subtitle.
  - **11 Menu Navigation Items**:
    1. `Dashboard` (`/profile`) — `LayoutGrid`
    2. `Profile` (`/profile/edit`) — `CircleDot`
    3. `Placement Drives` (`/profile/drives`) — `Building2`
    4. `Applications` (`/profile/applications`) — `FileText`
    5. `Eligibility` (`/profile/eligibility`) — `Check`
    6. `Resume Analyzer` (`/profile/resume`) — `Sparkles`
    7. `Placement Match` (`/profile/placement-match`) — `Target` *(Active glowing blue pill styling)*
    8. `Skill Gap` (`/profile/skill-gap`) — `Zap`
    9. `Assistant` (`/profile/assistant`) — `Bot`
    10. `Mock Interview` (`/profile/mock-interview`) — `Radio`
    11. `Analytics` (`/profile/analytics`) — `TrendingUp`
  - **Footer Action**: Divider line with clean `Logout` button.
- [x] **`src/components/shared/TopNavbar.tsx`**:
  - Dynamic page title mapping matching all 14 active routes.
  - Global drive/skill search bar, notification counter badge, and synchronized student profile avatar chip.

### F. Profile Overview & Feature Cards (`src/components/student-profile/`)
- [x] **`overview/`** — 7 Core Cards + Header Block + Eligibility:
  - `ProfileHeaderBlock.tsx` — Avatar with gradient initials, name, branch, degree, "Edit Profile" link
  - `EligibilityBanner.tsx` — Campus drive eligibility summary and criteria readiness
  - `PersonalInfoCard.tsx` — DOB, Gender, Phone, Email, Category, Father's Name, Income
  - `AcademicInfoCard.tsx` — Enrollment, College, Degree, SSC, HSC, CGPA, Backlogs
  - `PlacementReadinessCard.tsx` — TP Activities, Placement, Aptitude, English Rating, Relocation
  - `ProfessionalSummaryCard.tsx` — Technical Skills, Projects, Certifications, Achievements
  - `OnlinePresenceCard.tsx` — GitHub, LinkedIn, Portfolio, Coding profile badge links
  - `ResumeSummaryCard.tsx` — Resume file info or "Upload Resume" link
- [x] **`edit/`** — 9 Edit Wizard Tabs:
  - `TabPersonal.tsx`, `TabAcademic.tsx`, `TabSkills.tsx`, `TabProjects.tsx`, `TabInternships.tsx`, `TabCertifications.tsx`, `TabAchievements.tsx`, `TabSocialLinks.tsx`, `TabResume.tsx`
- [x] **Sub-components**:
  - `skills/`: `AddSkillModal.tsx`, `SkillChip.tsx`, `SkillProficiencyBadge.tsx`
  - `projects/`: `ProjectCard.tsx`, `ProjectModal.tsx`
  - `certifications/`: `CertificationItem.tsx`, `CertificationModal.tsx`
  - `resume/`: `ResumeUploader.tsx` (drag-drop, PDF validation, progress simulation, preview)
  - `common/`: `DeleteConfirmModal.tsx`, `ProfileEmptyState.tsx`, `ProfileErrorState.tsx`, `ProfileSkeletonLoader.tsx`

### G. App Router Pages (`src/app/profile/`) ✅
All routes are verified, statically generated, and connected to the dark theme design system:
1. `/profile` — **Dashboard Overview**: Header block, eligibility banner, 3 separated card rows with dividers.
2. `/profile/edit` — **Student Profile Builder**: 9-step tabbed wizard with stepper navigation and draft saving.
3. `/profile/drives` — **Placement Drives**: Filterable campus drives with eligibility badges and application flows.
4. `/profile/applications` — **My Applications**: Application tracking, rounds progression, and interview statuses.
5. `/profile/eligibility` — **Drive Eligibility**: Live academic and backlog eligibility criteria evaluation engine.
6. `/profile/resume` — **Resume Analyzer**: ATS checklist, PDF uploader, score preview, and recruiter optimization tips.
7. `/profile/placement-match` — **Placement Match**: Company match scores, missing skill flags, and one-click application.
8. `/profile/skill-gap` — **Skill Gap Analysis**: Current verified skills vs. industry benchmarks and targeted learning paths.
9. `/profile/assistant` — **AI Career Assistant**: Interactive chat interface with quick suggestion chips.
10. `/profile/mock-interview` — **Mock Interview Studio**: Practice modules for DSA, Full Stack, and HR rounds.
11. `/profile/analytics` — **Placement Analytics**: Distribution benchmarks, aptitude rankings, and preparation index.
12. `/profile/skills` — **Skills Management**: Dedicated skills CRUD management page.
13. `/profile/projects` — **Projects**: Dedicated project portfolio showcase page.
14. `/profile/certifications` — **Certifications**: Dedicated credentials and licenses page.

---

## 3. TypeScript & Build Verification ✅

- [x] **TypeScript Check** (`npx tsc --noEmit`): **0 errors**
- [x] **Production Build** (`npm run build`): Compiled successfully via Turbopack, all 18 routes statically generated:
  ```
  Route (app)
  ┌ ○ /
  ├ ○ /_not-found
  ├ ○ /profile
  ├ ○ /profile/analytics
  ├ ○ /profile/applications
  ├ ○ /profile/assistant
  ├ ○ /profile/certifications
  ├ ○ /profile/drives
  ├ ○ /profile/edit
  ├ ○ /profile/eligibility
  ├ ○ /profile/mock-interview
  ├ ○ /profile/placement-match
  ├ ○ /profile/projects
  ├ ○ /profile/resume
  ├ ○ /profile/skill-gap
  └ ○ /profile/skills

  ○ (Static) prerendered as static content
  ```

---

## 4. Notes on Machine Learning / XGBoost Prototypes

- Earlier experimental client-side and backend Python XGBoost prototypes were **completely discarded and cleanly removed** from the repository per user request.
- The working tree contains **zero** uncommitted or dangling XGBoost files/scripts.
- The SQL database seed (`database/sql/06_seed_data.sql`) retains standard text catalog entries for skills (e.g. `'XGBoost'`), which are harmless static seed rows.

---

## 5. Current Git Working Tree Status
 
- **Branch**: `feature/student-profile` (tracking `origin/feature/student-profile`)
- **Active Pull Request**: [PR #13](https://github.com/SaniyaSheikh-15/Centralised-Placement-Management-and-AI-Assisted-Career-Readiness-System/pull/13) (8 total commits)
- **Latest Commit**: `25214eb` (`feat(student-profile): implement placement portal sub-pages and update navigation`)
- **Remote Push Status**: Up to date with `origin/feature/student-profile`
- **Active Local Dev Server**: Next.js 16.3.3 (Turbopack) running on `http://localhost:3000`
- **TypeScript Health**: `npx tsc --noEmit` passing with 0 errors
- **Working Tree**: Clean (all feature routes and navigation updates committed and pushed)
