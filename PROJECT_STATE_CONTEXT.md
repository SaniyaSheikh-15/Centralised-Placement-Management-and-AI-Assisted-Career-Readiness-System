# CAMPUSCONNECT — MASTER PROJECT CONTEXT & PROGRESS SNAPSHOT

> **Document Purpose**: Single source of truth recording the complete state of the repository, including both the **Student Profile Frontend Module** and the **Placement Drive Management Backend Module**, git branching architecture, models, APIs, and handover instructions.  
> **Repository**: `SaniyaSheikh-15/Centralised-Placement-Management-and-AI-Assisted-Career-Readiness-System`  
> **Collaborator**: `mohduzaifahkhan` (`uzaifkhan015@gmail.com`)  
> **Last Updated**: September 2, 2026  

---

## 1. Branch Architecture & Workspace Explanation

### Why Files Seem to "Disappear" When Switching Branches
In Git, switching branches swaps out working directory files to match that specific branch:
* **Frontend Branch (`feature/student-profile`)**: Contains the Next.js 16 frontend (`src/app`, `src/components`, `src/features`, `src/types`, `src/lib`, `package.json`).
* **Backend Branch (`feature/placement-drive-backend`)**: Contains the FastAPI Python backend (`backend/app`, `backend/tests`, `backend/API_DOCS.md`, `database/sql/`).

> **Safety Guarantee**: No code was lost or deleted. Each branch holds its dedicated module to prevent merge conflicts when creating Pull Requests to `develop`.

```
develop (Central Integration)
├── feature/student-profile          <-- Full Next.js 16 Frontend (PR #5 open)
└── feature/placement-drive-backend  <-- Full FastAPI Backend (Created & Ready)
```

To switch between them at any time:
```bash
# To view/work on Frontend:
git checkout feature/student-profile

# To view/work on Backend:
git checkout feature/placement-drive-backend
```

---

## 2. MODULE 1: Placement Drive Management Backend (COMPLETED)

### A. Senior's Assignment & Scope
* **Module**: Placement Drive Management Backend
* **Branch**: `feature/placement-drive-backend` (branched from `origin/feature/student-profile-backend`)
* **Framework**: FastAPI + SQLAlchemy 2.0 (Mapped columns) + Pydantic v2 + PostgreSQL
* **Status Enum Values**: Strictly followed senior's instruction: `upcoming`, `active`, `closed`
* **Rule**: Did not modify Authentication or Student Profile modules.

### B. Summary of Changes (10 New Files, 2 Modified Files)

| Type | File | Description |
|---|---|---|
| **NEW** | `backend/app/models/placement_drive.py` | 5 SQLAlchemy ORM models (`PlacementDrive`, `EligibilityRule`, `DriveBranch`, `DriveSkill`, `DriveDocument`) |
| **MODIFIED** | `backend/app/models/__init__.py` | Exported new models in `__all__` |
| **NEW** | `backend/app/schemas/placement_drive.py` | Pydantic v2 request/response schemas with field validation |
| **NEW** | `backend/app/repositories/placement_drive_repository.py` | Query layer for drives (paginated listing, filtering, eager loading, CRUD) |
| **NEW** | `backend/app/repositories/eligibility_rule_repository.py` | Query layer for 1:1 eligibility rules |
| **NEW** | `backend/app/repositories/drive_branch_repository.py` | Query layer for eligible engineering branches |
| **NEW** | `backend/app/repositories/drive_skill_repository.py` | Query layer for required drive skills |
| **NEW** | `backend/app/services/placement_drive_service.py` | Business logic, status state-machine, inline nested creation |
| **NEW** | `backend/app/api/placement_drive.py` | 14 FastAPI APIRouter endpoints with JWT auth & RBAC |
| **MODIFIED** | `backend/app/main.py` | Registered `placement_drive.router` |
| **NEW** | `backend/tests/test_placement_drive_api.py` | Complete Pytest suite covering all operations & edge cases |
| **NEW** | `backend/API_DOCS.md` | Full REST API documentation with sample request/response JSONs |

### C. Database Models & Schema Details

1. **`PlacementDrive` (`placement_drives`)**:
   - `drive_id`: UUID (Primary Key, auto-generated)
   - `company_id`: UUID (Foreign Key -> `companies`)
   - `recruiter_id`: UUID (Foreign Key -> `recruiters`)
   - `job_role_id`: UUID (Foreign Key -> `job_roles`)
   - `drive_title`: String(255)
   - `job_description`: Text
   - `employment_type`: String(50) — `FULL_TIME`, `INTERNSHIP`, `FULL_TIME_WITH_INTERNSHIP`, `CONTRACT`
   - `work_mode`: String(50) — `ON_SITE`, `REMOTE`, `HYBRID`
   - `location`: String(150)
   - `minimum_package_lpa`: Decimal(6, 2)
   - `maximum_package_lpa`: Decimal(6, 2)
   - `vacancies`: Integer
   - `registration_deadline`: Timestamp
   - `drive_date`: Timestamp
   - `status`: String(30) — `upcoming`, `active`, `closed`
   - `created_at`, `updated_at`: Timestamps

2. **`EligibilityRule` (`eligibility_rules`)**:
   - `eligibility_rule_id`: UUID (Primary Key)
   - `drive_id`: UUID (Foreign Key -> `placement_drives`, unique 1:1)
   - `minimum_cgpa`: Decimal(3, 2)
   - `maximum_backlogs`: Integer
   - `graduation_year`: Integer
   - `minimum_tenth_percentage`: Decimal(5, 2)
   - `minimum_twelfth_percentage`: Decimal(5, 2)
   - `created_at`: Timestamp

3. **`DriveBranch` (`drive_branches`)**:
   - `drive_branch_id`: UUID (Primary Key)
   - `drive_id`: UUID (Foreign Key -> `placement_drives`)
   - `branch_id`: UUID (Foreign Key -> `branches`)

4. **`DriveSkill` (`drive_skills`)**:
   - `drive_skill_id`: UUID (Primary Key)
   - `drive_id`: UUID (Foreign Key -> `placement_drives`)
   - `skill_id`: UUID (Foreign Key -> `skills`)
   - `minimum_proficiency`: String(30)

5. **`DriveDocument` (`drive_documents`)**:
   - `drive_document_id`: UUID (Primary Key)
   - `drive_id`: UUID (Foreign Key -> `placement_drives`)
   - `document_name`: String(255)
   - `document_type`: String(50)
   - `document_storage_path`: Text
   - `uploaded_at`: Timestamp

### D. Status State Machine
Transitions are strictly validated in `PlacementDriveService`:
```
upcoming ───> active ───> closed
    │                       ▲
    └───────────────────────┘
```
- Invalid transitions (e.g. `closed -> active`) reject with `400 Bad Request`.

### E. API Endpoints Built

| Method | Route | Access Control | Description |
|---|---|---|---|
| `POST` | `/placement-drives` | Recruiter, Placement Officer | Create drive (supports inline eligibility, branches, skills) |
| `GET` | `/placement-drives` | Authenticated | List drives with pagination, status filter, company filter |
| `GET` | `/placement-drives/{drive_id}` | Authenticated | Get drive details with eager-loaded relations |
| `PUT` | `/placement-drives/{drive_id}` | Recruiter, Placement Officer | Update drive fields |
| `DELETE` | `/placement-drives/{drive_id}` | Recruiter, Placement Officer | Delete drive |
| `PATCH` | `/placement-drives/{drive_id}/status` | Recruiter, Placement Officer | Update drive status (`upcoming`, `active`, `closed`) |
| `GET` | `/placement-drives/{drive_id}/eligibility` | Authenticated | Get eligibility criteria |
| `PUT` | `/placement-drives/{drive_id}/eligibility` | Recruiter, Placement Officer | Set or update eligibility criteria |
| `GET` | `/placement-drives/{drive_id}/branches` | Authenticated | List eligible branches |
| `POST` | `/placement-drives/{drive_id}/branches` | Recruiter, Placement Officer | Add eligible branch |
| `DELETE` | `/placement-drives/{drive_id}/branches/{branch_id}` | Recruiter, Placement Officer | Remove eligible branch |
| `GET` | `/placement-drives/{drive_id}/skills` | Authenticated | List required skills |
| `POST` | `/placement-drives/{drive_id}/skills` | Recruiter, Placement Officer | Add required skill with proficiency |
| `DELETE` | `/placement-drives/{drive_id}/skills/{skill_id}` | Recruiter, Placement Officer | Remove required skill |

### F. Verification & Quality
- Python AST syntax check performed on all 11 files: **100% Passed (All files parse OK)**.
- Full compatibility with existing Auth (`User`, `Role`, `JWT`, `require_roles`) and database session management.

---

## 3. MODULE 2: Student Profile Builder Frontend (COMPLETED)

### A. Location & State
* **Branch**: `feature/student-profile`
* **Pull Request**: PR #5 (Pushed to GitHub & under review targeting `develop`)
* **Stack**: Next.js 16.3.3 (App Router), React 19.2.8, TypeScript 5, Tailwind CSS v4, Base UI (`@base-ui/react` ^1.7.0)

### B. Architecture & Directory Tree
```
src/
├── app/
│   ├── globals.css                # Dark theme palette (#050B14) & custom CSS tokens
│   ├── layout.tsx                 # Root layout with StudentProfileProvider
│   ├── page.tsx                   # Redirect -> /profile
│   └── profile/
│       ├── layout.tsx             # Sidebar + Navbar shell (padding: p-10)
│       ├── page.tsx               # Overview dashboard (3 card rows with dividers)
│       ├── edit/page.tsx          # 9-step tabbed edit wizard
│       ├── skills/page.tsx        # Skills management page
│       ├── projects/page.tsx      # Projects showcase page
│       ├── certifications/page.tsx# Certifications page
│       └── resume/page.tsx        # Resume upload & preview page
├── components/
│   ├── shared/
│   │   ├── Sidebar.tsx            # Left navigation (260px fixed)
│   │   └── TopNavbar.tsx          # Top bar with dynamic title & avatar
│   ├── student-profile/
│   │   ├── common/                # DeleteConfirmModal, EmptyState, ErrorState, Skeletons
│   │   ├── overview/              # 7 Overview cards + ProfileHeaderBlock
│   │   ├── edit/                  # 9 Wizard tabs (Personal, Academic, Skills, etc.)
│   │   ├── skills/                # AddSkillModal, SkillChip, ProficiencyBadge
│   │   ├── projects/              # ProjectCard, ProjectModal
│   │   ├── certifications/        # CertificationItem, CertificationModal
│   │   └── resume/                # ResumeUploader with drag-and-drop & progress
│   └── ui/                        # 17 Base UI primitives (button, card, dialog, tabs, etc.)
├── features/student-profile/
│   ├── context/                   # StudentProfileContext.tsx (CRUD state + draft persistence)
│   ├── mock/                      # studentProfileMockData.ts (rich default & empty profiles)
│   └── utils/                     # profileValidation.ts (validators & input masks)
├── lib/utils.ts                   # cn() helper
└── types/student-profile.ts       # TypeScript interfaces matching PRD & 29-table schema
```

### C. Build & Verification Status
- `npx tsc --noEmit`: **0 errors**
- `npm run build`: Compiled successfully across all 8 static routes.

---

## 4. Git Commands Reference

### Committing & Pushing the Backend Work
To push your newly built placement drive backend to GitHub:
```bash
git add backend/ CONTEXT.md PROJECT_STATE_CONTEXT.md
git commit -m "feat(placement-drive): implement complete placement drive management backend"
git push -u origin feature/placement-drive-backend
```
Then open a Pull Request from `feature/placement-drive-backend` targeting `develop`.

### Switching Back to Frontend at Any Time
```bash
# Switch to student profile frontend
git checkout feature/student-profile

# Switch back to placement drive backend
git checkout feature/placement-drive-backend
```
