# CAMPUSCONNECT — CODEBASE STATE & PROGRESS SNAPSHOT

> **Context Snapshot Date**: August 29, 2026  
> **Repository**: `SaniyaSheikh-15/Centralised-Placement-Management-and-AI-Assisted-Career-Readiness-System`  
> **Collaborator**: `mohduzaifahkhan` (`uzaifkhan015@gmail.com`)  
> **Module**: **Student Profile Builder** (`feature/student-profile`)  
> **Pull Request**: [PR #5](https://github.com/SaniyaSheikh-15/Centralised-Placement-Management-and-AI-Assisted-Career-Readiness-System/pull/5) — Pushed & under review  
> **Purpose**: Master context file recording all completed work, architecture, design system, type definitions, component status, and git state for seamless model handover.

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
- **Icons**: `lucide-react` (^1.35.0) — Note: `Github` and `Linkedin` icons do NOT exist in this version; use `Code2`, `ExternalLink`, `Globe` instead.
- **Database**: PostgreSQL with 29 frozen relational tables across 6 modules (schema located at `database/sql/placement_management_v1.sql`).

### Git & Branching Rules
- **Branch**: `feature/student-profile` (module branch)
- **Rule**: Nobody pushes directly to `main` or `develop`. All work goes to feature branches, then PR → review → merge into `develop`.
- **Current State**: All work committed and pushed. PR #5 is open targeting `develop`.

---

## 2. ALL WORK COMPLETED ✅

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
  - Tab navigation state (`activeEditTab`, `setActiveEditTab`)
  - UI simulators (`simulateLoading()`, `simulateError()`, `clearError()`)
- [x] `mock/studentProfileMockData.ts`:
  - Rich, realistic default student profile mock data (`defaultMockProfile`)
  - Empty profile (`emptyMockProfile`) for testing empty states
- [x] `utils/profileValidation.ts`:
  - Validation routines for CGPA (0.00-10.00), percentages, URLs, email, phone, dates, Aadhaar (12-digit), PAN (ABCDE1234F), resume files (PDF <= 5MB)
  - Input masks: `maskPhone`, `maskAadhaar`, `maskPAN`, `maskNumericOnly`

### E. UI Primitives (`src/components/ui/`)
- [x] 17 Base-UI / shadcn components:
  - `alert-dialog.tsx`, `alert.tsx`, `avatar.tsx`, `badge.tsx`, `button.tsx`, `card.tsx`, `dialog.tsx`, `input.tsx`, `label.tsx`, `progress.tsx`, `radio-group.tsx`, `select.tsx`, `separator.tsx`, `skeleton.tsx`, `tabs.tsx`, `textarea.tsx`, `tooltip.tsx`
- **Known Base UI quirks**:
  - `<Button asChild>` is NOT supported — use styled `<Link>` elements instead
  - `<AlertDialogDescription asChild>` is NOT supported — put children directly inside
  - `<Select>` value prop type is `string | undefined` (not `string | null`)
  - `<Select>` `onValueChange` callback type is `(v: string | null) => void` — use `v ?? ''` to coerce

### F. Shell & Shared Layout (`src/components/shared/` & `src/app/`)
- [x] `src/components/shared/Sidebar.tsx` — Left fixed navigation with active state styling
- [x] `src/components/shared/TopNavbar.tsx` — Top header with dynamic route title, search, notification counter, student avatar
- [x] `src/app/layout.tsx` — Root layout with `Inter` font, `dark` theme class, `StudentProfileProvider`, `TooltipProvider`
- [x] `src/app/page.tsx` — Root redirect to `/profile`
- [x] `src/app/profile/layout.tsx` — Profile layout wrapping Sidebar + TopNavbar + main content area (padding: `p-10`)

### G. Profile Feature Components (`src/components/student-profile/`)

#### `overview/` — 7 Overview Cards
- [x] `ProfileHeaderBlock.tsx` — Avatar with gradient initials, name, branch, degree, "Edit Profile" link
- [x] `PersonalInfoCard.tsx` — DOB, Gender, Phone, Email, Category, Father's Name, Income
- [x] `AcademicInfoCard.tsx` — Enrollment, College, Degree, SSC, HSC, CGPA, Backlogs
- [x] `PlacementReadinessCard.tsx` — TP Activities, Placement, Aptitude, English Rating (stars), Relocation
- [x] `ProfessionalSummaryCard.tsx` — Technical Skills (badges), Projects (list), Certifications (list), Achievements (list)
- [x] `OnlinePresenceCard.tsx` — GitHub, LinkedIn, Portfolio, Coding profile (badge links)
- [x] `ResumeSummaryCard.tsx` — Resume file info or "Upload Resume" link

#### `edit/` — 9 Edit Wizard Tabs ✅
- [x] `TabPersonal.tsx` — Core identity, family details, gov IDs (PAN/Aadhaar/ABC ID), branch, phone, email, addresses
- [x] `TabAcademic.tsx` — Enrollment, college, degree, SSC/HSC percentages, CGPA, conditional backlog details
- [x] `TabSkills.tsx` — Technical skills (SkillChip + AddSkillModal) + soft skills (tag input with removable badges)
- [x] `TabProjects.tsx` — Project CRUD (reuses ProjectCard + ProjectModal + DeleteConfirmModal)
- [x] `TabInternships.tsx` — Inline add/edit form + card list with role/org/duration + delete
- [x] `TabCertifications.tsx` — Reuses CertificationItem + CertificationModal + DeleteConfirmModal
- [x] `TabAchievements.tsx` — Inline add/edit form + card list with title/date/description + delete
- [x] `TabSocialLinks.tsx` — GitHub, LinkedIn, Portfolio, Coding Profile URL inputs + recruiter tip
- [x] `TabResume.tsx` — Wraps ResumeUploader + ATS tip banner

#### `skills/` — Skill Management
- [x] `AddSkillModal.tsx` — Dialog with autocomplete suggestions + proficiency selector
- [x] `SkillChip.tsx` — Inline skill display with edit/remove buttons on hover
- [x] `SkillProficiencyBadge.tsx` — Color-coded badge (Beginner/Intermediate/Advanced)

#### `projects/` — Project Showcase
- [x] `ProjectCard.tsx` — Card with tech stack badges, GitHub/Live URL links, edit/delete buttons
- [x] `ProjectModal.tsx` — Dialog form with tech stack tag input, URL fields, validation

#### `certifications/` — Credential Cards
- [x] `CertificationItem.tsx` — Card with organization, date, credential link, edit/delete on hover
- [x] `CertificationModal.tsx` — Dialog form with name, org, date, URL fields, validation

#### `resume/` — Resume Upload
- [x] `ResumeUploader.tsx` — Drag-and-drop, PDF validation, simulated upload progress, iframe preview, download/replace

#### `common/` — Shared Utilities
- [x] `DeleteConfirmModal.tsx` — AlertDialog with danger styling and confirm/cancel actions
- [x] `ProfileEmptyState.tsx` — Centered empty state with icon, title, description, and CTA button
- [x] `ProfileErrorState.tsx` — Error state with retry button
- [x] `ProfileSkeletonLoader.tsx` — 4 variants: `overview`, `cards`, `list`, `form`

### H. App Router Pages (`src/app/profile/`) ✅
- [x] `page.tsx` — Overview dashboard with ProfileHeaderBlock + 3 separated card rows (2-col grid) with dividers
- [x] `edit/page.tsx` — 9-step tabbed wizard with stepper nav, tab content renderer, save draft, previous/next/complete buttons
- [x] `skills/page.tsx` — Skills management with add/edit/delete modal flows and empty state
- [x] `projects/page.tsx` — Projects showcase with card grid, add/edit modal, delete confirmation, empty state
- [x] `certifications/page.tsx` — Certifications with list, add/edit modal, delete confirmation, empty state
- [x] `resume/page.tsx` — Resume upload with ResumeUploader and loading/error states

---

## 3. TypeScript & Build Verification ✅

- [x] `npx tsc --noEmit` — **ZERO errors**
- [x] `npm run build` — Compiled successfully, all 8 routes statically generated:
  ```
  Route (app)
  ┌ ○ /
  ├ ○ /_not-found
  ├ ○ /profile
  ├ ○ /profile/certifications
  ├ ○ /profile/edit
  ├ ○ /profile/projects
  ├ ○ /profile/resume
  └ ○ /profile/skills
  ```
- [x] Git committed & pushed to `origin feature/student-profile`
- [x] Pull Request #5 open, no conflicts with base branch, 1 pending review

---

## 4. Bug Fixes Applied

| File | Issue | Fix |
|---|---|---|
| `OnlinePresenceCard.tsx` | `Github`/`Linkedin` icons don't exist in lucide-react 1.35 | Replaced with `Code2`/`ExternalLink` |
| `ProjectCard.tsx` | `Github` icon doesn't exist | Replaced with `Code2` |
| `ProfileHeaderBlock.tsx` | `<Button asChild>` not supported by Base UI | Replaced with styled `<Link>` |
| `ResumeSummaryCard.tsx` | `<Button asChild>` not supported by Base UI | Replaced with styled `<Link>` |
| `DeleteConfirmModal.tsx` | `<AlertDialogDescription asChild>` not supported | Removed `asChild`, used `<span>` children |
| `TabPersonal.tsx` / `TabAcademic.tsx` | Select `onValueChange` type `string|null` vs `string` | Added `(v: string | null) => ... v ?? ''` |

---

## 5. Architecture Reference (Final)

```
src/
├── app/
│   ├── globals.css                # Master dark-theme CSS & Tailwind v4
│   ├── layout.tsx                 # Root layout with Provider
│   ├── page.tsx                   # Redirect -> /profile
│   └── profile/
│       ├── layout.tsx             # Sidebar + Navbar shell (p-10)
│       ├── page.tsx               # ✅ Overview (3 card rows with dividers)
│       ├── edit/page.tsx          # ✅ 9-step Edit wizard
│       ├── skills/page.tsx        # ✅ Skills management
│       ├── projects/page.tsx      # ✅ Projects showcase
│       ├── certifications/page.tsx# ✅ Certifications
│       └── resume/page.tsx        # ✅ Resume upload
├── components/
│   ├── shared/
│   │   ├── Sidebar.tsx            # Left nav, 260px fixed
│   │   └── TopNavbar.tsx          # Top bar, 60px fixed
│   ├── student-profile/
│   │   ├── common/                # DeleteModal, Empty, Error, Skeleton (4 variants)
│   │   ├── overview/              # 7 Overview cards + ProfileHeaderBlock
│   │   ├── edit/                  # ✅ 9 Tab components (Personal→Resume)
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

## 6. UI Spacing Notes (Latest)

Cards use consistent padding pattern:
- **CardHeader**: `pb-4 pt-6 px-6`
- **CardContent**: `px-6 pb-6`
- **InfoRow**: `py-3` for comfortable row height
- **Grid gaps**: `gap-8` between cards
- **Horizontal dividers**: `border-t border-[var(--border-card)]` between card row groups
- **Main content padding**: `p-10` (mobile: `p-4`)
- **ProfileHeaderBlock**: `p-10` with `gap-8`
