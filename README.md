# Centralised Placement Management and AI-Assisted Career Readiness System

AI-powered Centralised Placement Management and Career Readiness System built using Next.js, React, TypeScript, Tailwind CSS, and PostgreSQL.

## Placement Workflow Module

Implemented student-facing routes:

- `/student/placement-drives`
- `/student/placement-drives/[driveId]`
- `/student/eligibility`
- `/student/applications`
- `/student/applications/[applicationId]`

Mock backend endpoints are included under `/api/v1/...` so the UI can run against realistic placement-drive, eligibility, and application data.

## Local Run

```bash
npm install
npm run dev
```

## Notes

- The module keeps eligibility and application rules on the backend side of the mock API layer.
- The UI follows the dark SaaS placement workflow design from the PRD.
