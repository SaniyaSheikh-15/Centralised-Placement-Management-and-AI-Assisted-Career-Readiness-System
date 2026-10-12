# Application Management integration

The placement workflow frontend calls the FastAPI service directly through `lib/application-management-client.ts`. The `NEXT_PUBLIC_API_BASE_URL` value is the FastAPI origin; calls written as `/api/v1/...` by the UI have that frontend prefix removed and are sent to the matching FastAPI path. No mock `student_001` identity or `x-actor-role` header is used by this integration.

## Local setup

1. Create `backend/.env` from `backend/.env.example` and set `DATABASE_URL` to the PostgreSQL database that has been initialized from `database/sql/placement_management_v1.sql`. Set a private `JWT_SECRET_KEY`; do not commit `backend/.env`.
2. Apply `database/sql/08_application_management_api.sql` after the consolidated schema. This adds the application status audit table; applications and the unique student/drive index already exist in the base SQL file.
3. Install backend dependencies from `backend/requirements.txt` in your Python environment.
4. Set `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000` in the frontend `.env.local` (or use the root `.env.example` as reference).
5. Start FastAPI from the repository root with `uvicorn backend.app.main:app --reload --port 8000`, and start the existing Next.js app with `npm run dev`.
6. Sign in through an auth flow that calls the existing `POST /auth/login` and stores `tokens.access_token` as `accessToken` in `localStorage` or `sessionStorage`. This frontend branch does not include a login page/session provider. The current backend login response issues an access token only; it does not issue or refresh a refresh token.

FastAPI CORS is configured from `CORS_ORIGINS`; include the exact frontend origin, including port. Defaults allow localhost ports 3000 and 3001. PostgreSQL credentials and JWT secrets are local setup values and must not be added to source control.

## Frontend-to-backend mapping

| Frontend | FastAPI endpoint | Method | Request | Response / UI update |
| --- | --- | --- | --- | --- |
| `PlacementDrivesPanel` | `/placement-drives?page=1&page_size=100` and `/applications/me` | GET | Bearer access token | Maps backend drive/application rows to cards, filters, counts, and applied links |
| `PlacementDriveDetailsPanel` | `/placement-drives/{drive_id}` | GET | Bearer access token | Maps drive details to existing drive view |
| `PlacementDriveDetailsPanel` | `/placement-drives/{drive_id}/eligibility/evaluate` | POST | Empty JSON body, bearer token | Maps existing eligibility result to the eligibility preview |
| `ApplyDialog` | `/placement-drives/{drive_id}/applications` | POST | `{}`; backend uses the student's saved default resume | 201 `{ message, application }`; navigates to the new application details |
| `ApplicationsPanel` | `/applications/me` | GET | Bearer token | Populates application table and summaries; supports backend `status`, `company`, and `role` filters |
| `ApplicationDetailsPanel` | `/applications/{application_id}` | GET | Bearer token | Populates details, status timeline, resume and next step |
| `WithdrawApplicationButton` | `/applications/{application_id}/withdraw` | PATCH | Empty body, bearer token | Updates application to `WITHDRAWN` and refreshes the details view |
| Application status badge/timeline | `/applications/{application_id}/status` and `/applications/{application_id}/timeline` | GET | Bearer token | Existing API data supports status/timeline display; details currently use the application response which includes both |
| Placement officer workflow | `/applications/{application_id}/status` | PATCH | `{ status, remarks?, scheduledAt? }` | 200 updated application; requires the `placement_officer` role and a valid next lifecycle status |

All application routes use the existing `StudentProfile`, `PlacementDrive`, `Resume`, and `applications` data. Student identity comes from the bearer JWT and profile's `user_id`. Duplicate applications are prevented by an application-level check and the existing unique `(student_id, drive_id)` index; conflicts return 409. Applying requires an active, not-expired drive and a resume belonging to the student (the default resume is selected if no `resumeId` is supplied).

Eligibility preview is read-only. The current eligibility endpoint evaluates the student's profile; it does not update application status. Application status progression is handled by the existing placement-officer status endpoint. The backend validates the lifecycle and writes every change to `application_status_history`.

## Manual verification

1. Verify `GET http://localhost:8000/health` and `GET http://localhost:8000/health/database`.
2. Sign in with an existing student account using `POST /auth/login`; confirm the response has `tokens.access_token` and store it under the `accessToken` key in the browser's local or session storage.
3. In browser Network tools, confirm placement drive and application requests target port 8000 and include `Authorization: Bearer …`.
4. Open the drive list/details and confirm they load from PostgreSQL. Confirm empty and error states using an account with no applications and by stopping FastAPI.
5. Submit once with a student's default resume; verify one row in `applications` and one `APPLIED` history row. Submit again; expect HTTP 409 and no second row.
6. Open the application list/details and verify company, role, application status, history, resume, and timeline. Withdraw and verify the `WITHDRAWN` status/history in PostgreSQL.
7. With a placement-officer token, advance an application through valid statuses; verify invalid transitions are rejected and each successful transition appears in history.
8. Verify CORS preflight from the actual frontend origin, and test an expired/missing token (401) and a wrong role (403).

The repository also contains older Next.js mock API routes for this feature. The integrated UI bypasses those routes and talks to FastAPI through the shared client. Keep them out of the live UI path; removing them is a separate cleanup because other local consumers may still reference them.
