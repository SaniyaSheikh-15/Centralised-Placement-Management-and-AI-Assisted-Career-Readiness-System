# Application Management API

All endpoints use the existing `/api/v1` mock API convention. The authenticated student is currently represented by `student_001`; replace this boundary with the application authentication context when it is available.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/placement-drives/:driveId/applications` | Apply to a drive |
| GET | `/applications/me` | List the student's applications; supports `status`, `company`, `role` |
| GET | `/applications/:applicationId` | Get application details |
| GET | `/applications/:applicationId/status` | Get lightweight current status |
| PATCH | `/applications/:applicationId/status` | Update lifecycle status |
| GET | `/applications/:applicationId/timeline` | Get lifecycle milestones and immutable history |
| PATCH | `/applications/:applicationId/withdraw` | Withdraw a non-terminal application |

## Apply

`POST /api/v1/placement-drives/:driveId/applications`

Optional body: `{ "resumeName": "Aafreen_Khan_Resume.pdf" }`. A duplicate student/drive application returns `409`; closed, cancelled, or past-deadline drives return `422`.

The application is always created as `APPLIED`. Application Management deliberately does **not** calculate academic or skills eligibility.

## Status updates and Eligibility Engine integration

`PATCH /api/v1/applications/:applicationId/status` requires `x-actor-role: PLACEMENT_OFFICER` or `x-actor-role: ELIGIBILITY_ENGINE` until production authentication is connected.

Officer example:

```json
{ "status": "ASSESSMENT", "remarks": "Assessment scheduled.", "scheduledAt": "2026-09-20T10:00:00.000Z" }
```

Eligibility Engine callback example:

```http
x-actor-role: ELIGIBILITY_ENGINE
```

```json
{ "eligibilityResult": "ELIGIBLE", "remarks": "Eligibility Engine verification completed." }
```

An eligible result transitions `APPLIED → ELIGIBILITY_VERIFIED`; a not-eligible result transitions `APPLIED → REJECTED`. The module consumes that outcome only—it contains no eligibility rules or calculations.

Valid progression is `APPLIED → ELIGIBILITY_VERIFIED → SHORTLISTED → ASSESSMENT → TECHNICAL_INTERVIEW → HR_INTERVIEW → SELECTED`; rejection and withdrawal are allowed before a terminal state. Invalid skips and updates after `SELECTED`, `REJECTED`, or `WITHDRAWN` return `422` or `409`.

## Persistence model

`applications` stores the current status. `application_timeline` stores one row per lifecycle milestone. Run [07_application_management.sql](../database/sql/07_application_management.sql) after the existing SQL files to add `application_status_history`, which records every status transition with its actor/source and timestamp.
