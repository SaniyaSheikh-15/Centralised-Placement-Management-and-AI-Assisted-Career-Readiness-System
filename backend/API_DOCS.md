# Placement Drive Management — API Documentation

> **Module**: Placement Drive Management  
> **Base URL**: `/placement-drives`  
> **Authentication**: Bearer JWT Token (required for all endpoints)  
> **Authorization**: Write operations restricted to `Recruiter` and `Placement Officer` roles

---

## Endpoints Summary

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| `POST` | `/placement-drives` | Recruiter, Placement Officer | Create a new placement drive |
| `GET` | `/placement-drives` | All authenticated | List drives (paginated, filterable) |
| `GET` | `/placement-drives/{drive_id}` | All authenticated | Get drive with full details |
| `PUT` | `/placement-drives/{drive_id}` | Recruiter, Placement Officer | Update drive details |
| `DELETE` | `/placement-drives/{drive_id}` | Recruiter, Placement Officer | Delete placement drive |
| `PATCH` | `/placement-drives/{drive_id}/status` | Recruiter, Placement Officer | Update drive status |
| `GET` | `/placement-drives/{drive_id}/eligibility` | All authenticated | Get eligibility rules |
| `PUT` | `/placement-drives/{drive_id}/eligibility` | Recruiter, Placement Officer | Set/update eligibility rules |
| `GET` | `/placement-drives/{drive_id}/branches` | All authenticated | Get eligible branches |
| `POST` | `/placement-drives/{drive_id}/branches` | Recruiter, Placement Officer | Add eligible branch |
| `DELETE` | `/placement-drives/{drive_id}/branches/{branch_id}` | Recruiter, Placement Officer | Remove eligible branch |
| `GET` | `/placement-drives/{drive_id}/skills` | All authenticated | Get required skills |
| `POST` | `/placement-drives/{drive_id}/skills` | Recruiter, Placement Officer | Add required skill |
| `DELETE` | `/placement-drives/{drive_id}/skills/{skill_id}` | Recruiter, Placement Officer | Remove required skill |

---

## 1. Create Placement Drive

**`POST /placement-drives`**

### Request Body

```json
{
  "company_id": "uuid",
  "recruiter_id": "uuid",
  "job_role_id": "uuid",
  "drive_title": "Software Engineer 2026 Campus Drive",
  "job_description": "Full-stack developer role for fresh graduates.",
  "employment_type": "FULL_TIME",
  "work_mode": "HYBRID",
  "location": "Bangalore, India",
  "minimum_package_lpa": 6.00,
  "maximum_package_lpa": 12.00,
  "vacancies": 25,
  "registration_deadline": "2026-10-01T23:59:59",
  "drive_date": "2026-10-15T09:00:00",
  "status": "upcoming",
  "eligibility": {
    "minimum_cgpa": 7.00,
    "maximum_backlogs": 0,
    "graduation_year": 2026,
    "minimum_tenth_percentage": 60.00,
    "minimum_twelfth_percentage": 60.00
  },
  "branch_ids": ["uuid1", "uuid2"],
  "skill_requirements": [
    {"skill_id": "uuid", "minimum_proficiency": "Intermediate"}
  ]
}
```

### Validations
- `drive_title`: Required, 3–255 characters
- `employment_type`: Must be one of `FULL_TIME`, `INTERNSHIP`, `FULL_TIME_WITH_INTERNSHIP`, `CONTRACT`
- `work_mode`: Must be one of `ON_SITE`, `REMOTE`, `HYBRID`
- `status`: Must be one of `upcoming`, `active`, `closed`
- `maximum_package_lpa` must be ≥ `minimum_package_lpa`
- `eligibility`, `branch_ids`, `skill_requirements` are optional nested fields

### Response: `201 Created`

```json
{
  "drive_id": "uuid",
  "company_id": "uuid",
  "recruiter_id": "uuid",
  "job_role_id": "uuid",
  "drive_title": "Software Engineer 2026 Campus Drive",
  "status": "upcoming",
  "created_at": "2026-09-02T15:00:00",
  "updated_at": "2026-09-02T15:00:00"
}
```

### Error Responses
- `400` — Invalid data or FK constraint violation
- `403` — User role not authorized
- `422` — Validation error (missing required fields, invalid types)

---

## 2. Get All Placement Drives

**`GET /placement-drives`**

### Query Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | int | 1 | Page number (≥ 1) |
| `page_size` | int | 20 | Items per page (1–100) |
| `status` | string | — | Filter by status (`upcoming`, `active`, `closed`) |
| `company_id` | UUID | — | Filter by company |

### Response: `200 OK`

```json
{
  "total": 42,
  "page": 1,
  "page_size": 20,
  "drives": [
    {
      "drive_id": "uuid",
      "drive_title": "...",
      "status": "upcoming",
      ...
    }
  ]
}
```

---

## 3. Get Placement Drive by ID

**`GET /placement-drives/{drive_id}`**

Returns full drive details with nested eligibility rules, eligible branches, required skills, and documents.

### Response: `200 OK`

```json
{
  "drive_id": "uuid",
  "drive_title": "...",
  "eligibility_rule": { ... },
  "drive_branches": [ ... ],
  "drive_skills": [ ... ],
  "drive_documents": [ ... ]
}
```

### Error: `404 Not Found` — Drive does not exist

---

## 4. Update Placement Drive

**`PUT /placement-drives/{drive_id}`**

Partial update — only include fields you want to change.

### Request Body (all optional)

```json
{
  "drive_title": "Updated Title",
  "vacancies": 50,
  "location": "Mumbai, India"
}
```

### Response: `200 OK` — Updated drive object

---

## 5. Delete Placement Drive

**`DELETE /placement-drives/{drive_id}`**

### Response: `204 No Content`

### Error: `404 Not Found` — Drive does not exist

---

## 6. Update Drive Status

**`PATCH /placement-drives/{drive_id}/status`**

### Valid Status Transitions

```
upcoming → active
upcoming → closed
active   → closed
```

### Request Body

```json
{
  "status": "active"
}
```

### Response: `200 OK` — Updated drive with new status

### Error: `400 Bad Request` — Invalid transition (e.g., `closed → active`)

---

## 7. Eligibility Rules

### Get: `GET /placement-drives/{drive_id}/eligibility`
Returns eligibility rule or `null` if not set.

### Set/Update: `PUT /placement-drives/{drive_id}/eligibility`

```json
{
  "minimum_cgpa": 7.50,
  "maximum_backlogs": 0,
  "graduation_year": 2026,
  "minimum_tenth_percentage": 60.00,
  "minimum_twelfth_percentage": 65.00
}
```

---

## 8. Drive Branches

### List: `GET /placement-drives/{drive_id}/branches`
### Add: `POST /placement-drives/{drive_id}/branches`

```json
{ "branch_id": "uuid" }
```

### Remove: `DELETE /placement-drives/{drive_id}/branches/{branch_id}`

### Error: `400` — Branch already added (duplicate)

---

## 9. Drive Skills

### List: `GET /placement-drives/{drive_id}/skills`
### Add: `POST /placement-drives/{drive_id}/skills`

```json
{
  "skill_id": "uuid",
  "minimum_proficiency": "Intermediate"
}
```

### Remove: `DELETE /placement-drives/{drive_id}/skills/{skill_id}`

### Error: `400` — Skill already added (duplicate)
