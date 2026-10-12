# CampusConnect — AI Modules Backend (FastAPI)

FastAPI service implementing the two AI modules defined in
`PRD_AI_Modules(backend).md`:

1. **AI Mock Interview** — role-specific question → answer → six-dimension AI
   evaluation → iterate → final report stored in `mock_interviews`.
2. **AI Career Assistant** — RAG-grounded career chat, resume Q&A and a
   personalised guidance / skill-gap roadmap, persisted in `career_chat` and
   `skill_gap_reports`.

It is built to run **offline out of the box** (SQLite + a deterministic stub AI
provider) so the whole API can be exercised through Swagger UI without a
PostgreSQL server or a Gemini key. Point it at PostgreSQL and add a
`GEMINI_API_KEY` for production behaviour — no code changes required.

---

## 1. Requirements

- Python 3.11+ (developed and verified on **CPython 3.14**)
- No system services required for the default (SQLite) setup

## 2. Install

From the **repository root**:

```powershell
python -m venv backend\.venv
backend\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
```

## 3. Configure

Copy the example file and edit as needed:

```powershell
copy backend\.env.example backend\.env
```

| Variable | Default | Purpose |
|---|---|---|
| `DATABASE_URL` | `sqlite+aiosqlite:///<backend>/campusconnect.db` | Any SQLAlchemy async DSN. Use `postgresql+psycopg://user:pass@host:5432/placement_management_db` for PostgreSQL. |
| `JWT_SECRET_KEY` | dev placeholder | **Change in production.** |
| `ENABLE_DEV_AUTH` | `true` | Enables `POST /api/v1/auth/dev-login` (password-less) so Swagger can obtain a token. Set `false` in production. |
| `GEMINI_API_KEY` | *(empty)* | When empty, the offline stub provider is used. |
| `AI_PROVIDER` | `auto` | `auto` \| `gemini` \| `stub`. `auto` uses Gemini iff a key is present. |
| `CORS_ORIGINS` | `http://localhost:3000,...` | Comma-separated allow-list for the Next.js frontend. |
| `SEED_DEMO_DATA` | `true` | Seeds demo student/officer, skills, drives and resume analysis. |

Secrets are read **only** from environment variables / `.env` — they are never
returned by any endpoint (PRD §4, security NFR).

## 4. Run

```powershell
backend\.venv\Scripts\python.exe backend\run.py
```

Then open:

- Swagger UI — <http://127.0.0.1:8000/docs>
- ReDoc — <http://127.0.0.1:8000/redoc>
- OpenAPI JSON — <http://127.0.0.1:8000/openapi.json>
- Health — <http://127.0.0.1:8000/health>

### Getting a token in Swagger

1. `POST /api/v1/auth/dev-login` with `{"email": "student@campusconnect.dev"}`
   (or `officer@campusconnect.dev`).
2. Copy `accessToken` from the response.
3. Click **Authorize** (top right) and paste the token.

Demo accounts (created by the seeder):

| Role | Email | Password |
|---|---|---|
| Student | `student@campusconnect.dev` | `Password123` |
| Placement Officer | `officer@campusconnect.dev` | `Password123` |

## 5. Endpoints

### Auth
| Method | Path | Notes |
|---|---|---|
| `POST` | `/api/v1/auth/login` | Email + password → access/refresh tokens. |
| `POST` | `/api/v1/auth/refresh` | Rotates the refresh token (old one is revoked). |
| `POST` | `/api/v1/auth/dev-login` | Dev-only password-less login (gated by `ENABLE_DEV_AUTH`). |
| `GET`  | `/api/v1/auth/me` | Current identity, roles and `studentId`. |

### Module 1 — AI Mock Interview
| Method | Path | Notes |
|---|---|---|
| `POST` | `/api/v1/interviews/start` | Creates a session, returns question 1. |
| `POST` | `/api/v1/interviews/{session_id}/answer` | Evaluates the answer (6 dimensions) + returns the next question. |
| `GET`  | `/api/v1/interviews/{session_id}/result` | Final report (completes the session if still open). |
| `GET`  | `/api/v1/interviews/{session_id}/session` | Full session state, for resuming an interview. |
| `GET`  | `/api/v1/interviews/history` | The caller's past interviews. |

### Module 2 — AI Career Assistant
| Method | Path | Notes |
|---|---|---|
| `POST` | `/api/v1/assistant/chat` | RAG-grounded career Q&A; returns `groundedOn` provenance. |
| `POST` | `/api/v1/assistant/chat/stream` | Same, streamed as **SSE** (`meta` → `token`* → `done`). |
| `POST` | `/api/v1/assistant/resume-qa` | Answers about the parsed resume. |
| `GET`  | `/api/v1/assistant/guidance/{student_id}` | Personalised roadmap / skill-gap report. |
| `GET`  | `/api/v1/assistant/resume-status/{student_id}` | Whether a parsed resume exists, and its state. |

### Ops
| Method | Path |
|---|---|
| `GET` | `/health` |
| `GET` | `/` (service banner) |

All `/api/v1/**` routes require `Authorization: Bearer <access token>`.
Students may only access their own data (403 on another student's id); Placement
Officers and Admins may act on behalf of a student.

---

## 6. Project layout

```
backend/
├── run.py                        # launcher: sets sys.path + SQLite path, starts uvicorn
├── requirements.txt              # pinned runtime dependencies
├── .env / .env.example           # configuration (secrets never hard-coded)
├── campusconnect.db              # local SQLite fallback (auto-created, git-ignored)
├── scripts/
│   ├── verify_endpoints.py       # in-process end-to-end check (no server needed)
│   └── verify_live_http.py       # live HTTP check against a running server
└── app/
    ├── main.py                   # app factory, lifespan, CORS, error handler, /health
    ├── core/                     # config, JWT/password security, logging, AppError
    ├── db/                       # declarative base, async engine/session, ORM models, seeder
    │   └── models/               # master, user, student, placement, ai (+ interview_* tables)
    ├── schemas/                  # Pydantic v2 request/response models (camelCase over the wire)
    ├── prompts/                  # interview + assistant prompt builders
    ├── services/
    │   ├── ai/                   # provider abstraction: base, gemini, stub, factory, json_utils
    │   ├── auth_service.py
    │   ├── context_service.py    # RAG retrieval (profile, skills, drives, eligibility, resume)
    │   ├── interview_service.py  # Module 1 session lifecycle + scoring
    │   └── assistant_service.py  # Module 2 chat / resume-QA / guidance
    └── api/
        ├── deps.py               # JWT identity dependency + RBAC guard
        └── v1/                   # auth, interviews, assistant routers
```

## 7. How the AI layer works

`AIProvider` is an interface with two implementations:

| Provider | When | Behaviour |
|---|---|---|
| `GeminiProvider` | `GEMINI_API_KEY` set (or `AI_PROVIDER=gemini`) | `google-genai` SDK, JSON response mode, retries with exponential backoff, SSE streaming. |
| `StubProvider` | no key (or `AI_PROVIDER=stub`) | Deterministic, schema-valid, context-aware output. Zero network calls. |

Because services depend only on `AIProvider`, swapping the vendor (or adding a
future Whisper speech-to-text provider, as the PRD's extensibility requirement
asks) is a one-line change in `app/services/ai/factory.py`.

### Hallucination mitigation (PRD §3.3)

- The RAG context is injected as **structured JSON**, so the model can tell
  database records apart from its own general knowledge.
- The system prompt instructs the model to use **only** the supplied context and
  to say it lacks data rather than guessing; the structured reply carries an
  explicit `insufficientContext` flag.
- Eligibility ("am I eligible?") is computed in Python from `eligibility_rules`,
  not by the model, so it is deterministic and explainable.
- Every chat/guidance response returns `groundedOn` — the list of context
  sources actually used.

### Streaming (PRD §4)

`POST /api/v1/assistant/chat/stream` emits Server-Sent Events:

```
event: meta   data: {"conversationId": "...", "groundedOn": [...]}
event: token  data: {"text": "..."}          (repeated)
event: done   data: {"conversationId": "...", "reply": "...", "createdAt": "..."}
event: error  data: {"code": "...", "message": "..."}   (only on failure)
```

The turn is persisted only after the stream completes, so a dropped connection
never leaves a half-written `career_chat` row.

## 8. Verifying the build

Two complementary scripts are provided; both print a PASS/FAIL table and exit
non-zero on any failure (usable in CI).

**a) In-process** — boots the app against a throw-away SQLite DB, seeds it, and
drives every endpoint through an ASGI transport. No server or API key needed:

```powershell
backend\.venv\Scripts\python.exe backend\scripts\verify_endpoints.py
```

**b) Live HTTP** — exercises the *running* server over real HTTP, exactly as
Swagger UI or the frontend would (including Swagger UI, the OpenAPI schema, RBAC
and the SSE stream):

```powershell
# terminal 1
backend\.venv\Scripts\python.exe backend\run.py

# terminal 2
backend\.venv\Scripts\python.exe backend\scripts\verify_live_http.py
```

The full results of the most recent runs are recorded in `process/brain.md`.

## 9. PRD traceability

| PRD requirement | Where it lives |
|---|---|
| Module 1 endpoints (§2.3) | `app/api/v1/interviews.py` |
| Six evaluation dimensions (§2.2) | `app/prompts/interview_prompts.py`, `app/schemas/interview.py` |
| Results stored in `mock_interviews` (§2.4) | `interview_service.complete_session` |
| Module 2 endpoints (§3.4) | `app/api/v1/assistant.py` |
| RAG retrieval (§3.2) | `app/services/context_service.py` |
| Grounding / anti-hallucination (§3.3) | `app/prompts/assistant_prompts.py` + `context_service` |
| Chat persisted in `career_chat` (§3.2) | `assistant_service.chat` / `stream_chat` |
| JWT + refresh + RBAC (§4) | `app/core/security.py`, `app/api/deps.py` |
| Gemini key from env only (§4) | `app/core/config.py` (never returned by an endpoint) |
| Streaming support (§4) | `AIProvider.stream_text` + `/assistant/chat/stream` |
| Extensibility (§4) | `app/services/ai/` provider abstraction |

## 10. Database notes

The ORM mirrors the frozen PostgreSQL schema in
`database/sql/placement_management_v1.sql`. Two **additive, backend-owned**
tables were added because the frozen schema only stores the aggregated result:

- `interview_sessions` — per-session state (progress, aggregates, summary).
- `interview_questions` — per-question text, the student's answer and the
  six-dimension evaluation.

No frozen table is altered; the final summary is still written to
`mock_interviews`, exactly as the PRD requires.
