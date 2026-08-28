# CAMPUSCONNECT — CODEBASE STATE & PROGRESS SNAPSHOT

> **Context Snapshot Date**: August 2026  
> **Repository**: `SaniyaSheikh-15/Centralised-Placement-Management-and-AI-Assisted-Career-Readiness-System`  
> **Collaborator**: `mohduzaifahkhan` (`uzaifkhan015@gmail.com`)  
> **Module**: **Student Profile Builder** (`feature/student-profile`)  
> **Purpose**: Master context file recording all completed work, architecture, design system, type definitions, component status, and pending tasks for seamless model handover.

---

## 1. Project Overview & Architecture

### System Goal
A centralised placement management and AI-assisted career readiness portal built for universities, students, recruiters, and placement officers (TPOs).

### Technology Stack
- **Framework**: Next.js 16.3.3 (App Router)
- **Runtime / UI**: React 19.2.8 + React DOM 19.2.8
- **Language**: TypeScript 5 (Strict mode)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`) + `tw-animate-css`
- **UI Primitives**: Base UI (`@base-ui/react` ^1.7.0) + shadcn/ui patterns + `class-variance-authority` + `clsx` + `tailwind-merge`
- **Icons**: `lucide-react` (^1.35.0)
- **Database**: PostgreSQL with 29 frozen relational tables across 6 modules (schema located at `database/sql/placement_management_v1.sql`).

---

## 2. Completed Work & File Inventory

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
  - `PersonalInfo` (Core identity, family, IDs, branch)
  - `AcademicInfo` (Enrollment, degree, SSC, HSC, CGPA, backlogs)
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
  - UI simulators (`simulateLoading()`, `simulateError()`, `clearError()`)
- [x] `mock/studentProfileMockData.ts`:
  - Rich, realistic default student profile mock data (`defaultMockProfile`)
- [x] `utils/profileValidation.ts`:
  - Validation routines for CGPA (0.00-10.00), percentages, URLs (GitHub, LinkedIn, live demo), email, phone, dates, and resume files (PDF <= 5MB)

### E. UI Primitives (`src/components/ui/`)
- [x] 17 Base-UI / shadcn components created:
  - `alert-dialog.tsx`, `alert.tsx`, `avatar.tsx`, `badge.tsx`, `button.tsx`, `card.tsx`, `dialog.tsx`, `input.tsx`, `label.tsx`, `progress.tsx`, `radio-group.tsx`, `select.tsx`, `separator.tsx`, `skeleton.tsx`, `tabs.tsx`, `textarea.tsx`, `tooltip.tsx`

### F. Shell & Shared Layout (`src/components/shared/` & `src/app/`)
- [x] `src/components/shared/Sidebar.tsx` — Left fixed navigation with active state styling
- [x] `src/components/shared/TopNavbar.tsx` — Top header with dynamic route title, search, notification counter, student avatar
- [x] `src/app/layout.tsx` — Root layout with `Inter` font, `dark` theme class, `StudentProfileProvider`, `TooltipProvider`
- [x] `src/app/page.tsx` — Root redirect to `/profile`
- [x] `src/app/profile/layout.tsx` — Profile layout wrapping Sidebar + TopNavbar + main content area

### G. Converted Profile Feature Components (`src/components/student-profile/`)
- [x] `overview/`:
  - `AcademicInfoCard.tsx`
  - `PersonalInfoCard.tsx`
  - `PlacementReadinessCard.tsx`
  - `ProfessionalSummaryCard.tsx`
  - `OnlinePresenceCard.tsx`
  - `ProfileHeaderBlock.tsx`
  - `ResumeSummaryCard.tsx`
- [x] `skills/`:
  - `AddSkillModal.tsx` (Autocomplete suggestions + proficiency selector)
  - `SkillChip.tsx`
  - `SkillProficiencyBadge.tsx`
- [x] `projects/`:
  - `ProjectCard.tsx`
  - `ProjectModal.tsx` (Add/Edit project with tech stack tags)
- [x] `certifications/`:
  - `CertificationItem.tsx`
  - `CertificationModal.tsx`
- [x] `resume/`:
  - `ResumeUploader.tsx` (Drag-and-drop, simulated upload progress bar, PDF preview iframe, download/replace actions)
- [x] `common/`:
  - `DeleteConfirmModal.tsx`
  - `ProfileEmptyState.tsx`
  - `ProfileErrorState.tsx`
  - `ProfileSkeletonLoader.tsx`

---

## 3. Pending Work (What Remains To Execute Next)

### Step 1: Create 9 Edit Wizard Tab Components (`src/components/student-profile/edit/`)
Need to create TypeScript versions for the 9-step profile editor:
1. `TabPersonal.tsx` — Full personal information form (full name, phone, email, addresses, family details, Aadhaar, PAN, ABC ID, branch).
2. `TabAcademic.tsx` — Academic information (enrollment, college, degree, SSC %, HSC %, CGPA, backlogs toggle & details).
3. `TabSkills.tsx` — Technical skills list with proficiency selector + soft skills tag input.
4. `TabProjects.tsx` — Project manager within the edit wizard (title, tech stack tags, description, repo link, live link).
5. `TabInternships.tsx` — Work experience / internship manager (organization, role, duration, description).
6. `TabCertifications.tsx` — Certification credentials manager (name, organization, issue date, credential URL).
7. `TabAchievements.tsx` — Extracurricular & academic achievements manager (title, date, description).
8. `TabSocialLinks.tsx` — Online profiles form (GitHub, LinkedIn, Portfolio, LeetCode / Coding Profile URLs with validation).
9. `TabResume.tsx` — Resume upload step within the edit wizard using `ResumeUploader`.

### Step 2: Create Next.js App Router Pages (`src/app/profile/`)
1. `src/app/profile/page.tsx` — Overview dashboard (renders `ProfileHeaderBlock` + 2-column grid of 6 overview cards + skeleton/error states).
2. `src/app/profile/edit/page.tsx` — 9-step tabbed wizard with stepper navigation, draft preservation, "Save Draft" & "Save & Next" buttons.
3. `src/app/profile/skills/page.tsx` — Dedicated skills management page with `AddSkillModal` and `DeleteConfirmModal`.
4. `src/app/profile/projects/page.tsx` — Dedicated projects showcase page with `ProjectCard` grid and `ProjectModal`.
5. `src/app/profile/certifications/page.tsx` — Dedicated certifications page with `CertificationItem` list and `CertificationModal`.
6. `src/app/profile/resume/page.tsx` — Dedicated resume page with `ResumeUploader`.

### Step 3: Minor Type & Icon Fixes
- Fix `lucide-react` icon names (e.g. replacing `Github`/`Linkedin` with SVG or valid lucide icon identifiers).
- Replace any `<Button asChild>` usage with standard `<Link>` buttons or proper `asChild` support.
- Run `npx tsc --noEmit` and `npm run build` to verify clean build with zero errors.

---

## 4. Quick Architecture Reference

```
src/
├── app/
│   ├── globals.css                # Master dark-theme CSS & Tailwind v4
│   ├── layout.tsx                 # Root layout with Provider
│   ├── page.tsx                   # Redirect -> /profile
│   └── profile/
│       ├── layout.tsx             # Sidebar + Navbar shell
│       ├── page.tsx               # [PENDING] Overview page
│       ├── edit/page.tsx          # [PENDING] 9-step Edit wizard
│       ├── skills/page.tsx        # [PENDING] Skills page
│       ├── projects/page.tsx      # [PENDING] Projects page
│       ├── certifications/page.tsx# [PENDING] Certifications page
│       └── resume/page.tsx        # [PENDING] Resume page
├── components/
│   ├── shared/
│   │   ├── Sidebar.tsx
│   │   └── TopNavbar.tsx
│   ├── student-profile/
│   │   ├── common/                # Loader, Empty, Error, DeleteModal
│   │   ├── overview/              # 7 Overview cards + header
│   │   ├── skills/                # AddSkillModal, SkillChip, Badge
│   │   ├── projects/              # ProjectCard, ProjectModal
│   │   ├── certifications/        # CertificationItem, Modal
│   │   ├── resume/                # ResumeUploader
│   │   └── edit/                  # [PENDING] 9 Tab components
│   └── ui/                        # 17 Base-UI/shadcn primitives
├── features/
│   └── student-profile/
│       ├── context/               # StudentProfileContext.tsx
│       ├── mock/                  # studentProfileMockData.ts
│       └── utils/                 # profileValidation.ts
├── lib/
│   └── utils.ts                   # cn() helper
└── types/
    └── student-profile.ts         # Complete domain TypeScript types
```
