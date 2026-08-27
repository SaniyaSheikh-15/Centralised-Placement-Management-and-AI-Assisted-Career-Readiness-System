-- ============================================================
-- Centralised Placement Management & AI-Assisted Career Readiness System
-- File: 02_enums.sql
-- Description: PostgreSQL ENUM Types
-- ============================================================

-- User Role Status
CREATE TYPE user_status_enum AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'BLOCKED'
);

-- Placement Drive Status
CREATE TYPE drive_status_enum AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'REGISTRATION_CLOSED',
    'ONGOING',
    'COMPLETED',
    'CANCELLED'
);

-- Application Status
CREATE TYPE application_status_enum AS ENUM (
    'APPLIED',
    'ELIGIBILITY_VERIFIED',
    'SHORTLISTED',
    'ASSESSMENT',
    'TECHNICAL_INTERVIEW',
    'HR_INTERVIEW',
    'SELECTED',
    'REJECTED',
    'WITHDRAWN'
);

-- Interview Round Status
CREATE TYPE interview_round_status_enum AS ENUM (
    'PENDING',
    'SCHEDULED',
    'COMPLETED',
    'PASSED',
    'FAILED'
);

-- Placement Result Status
CREATE TYPE placement_result_status_enum AS ENUM (
    'SELECTED',
    'REJECTED',
    'WAITLISTED'
);

-- Joining Status
CREATE TYPE joining_status_enum AS ENUM (
    'NOT_APPLICABLE',
    'ACCEPTED',
    'DECLINED',
    'JOINED'
);

-- Notification Type
CREATE TYPE notification_type_enum AS ENUM (
    'PLACEMENT_DRIVE',
    'APPLICATION',
    'INTERVIEW',
    'RESULT',
    'SYSTEM'
);

-- Employment Type
CREATE TYPE employment_type_enum AS ENUM (
    'FULL_TIME',
    'INTERNSHIP',
    'FULL_TIME_WITH_INTERNSHIP',
    'CONTRACT'
);

-- Work Mode
CREATE TYPE work_mode_enum AS ENUM (
    'ON_SITE',
    'REMOTE',
    'HYBRID'
);
