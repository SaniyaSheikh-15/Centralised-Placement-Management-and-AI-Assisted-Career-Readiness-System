-- ============================================================
-- Centralised Placement Management & AI-Assisted Career Readiness System
-- File: 03_tables.sql
-- Description: Database Tables
-- ============================================================

SET search_path TO public;

CREATE TABLE companies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    industry text NOT NULL,
    description text NOT NULL,
    website text,
    logo_url text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE placement_drives (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text NOT NULL,
    location text NOT NULL,
    city text NOT NULL,
    job_type employment_type_enum NOT NULL,
    work_mode work_mode_enum NOT NULL,
    ctc text NOT NULL,
    openings integer,
    drive_date timestamptz NOT NULL,
    application_deadline timestamptz NOT NULL,
    status drive_status_enum NOT NULL DEFAULT 'DRAFT',
    selection_process jsonb NOT NULL DEFAULT '[]'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE drive_requirements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    drive_id uuid NOT NULL REFERENCES placement_drives(id) ON DELETE CASCADE,
    requirement_type text NOT NULL,
    requirement_name text NOT NULL,
    operator text NOT NULL,
    required_value text NOT NULL,
    is_mandatory boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE applications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    application_code text NOT NULL UNIQUE,
    student_id uuid NOT NULL,
    drive_id uuid NOT NULL REFERENCES placement_drives(id) ON DELETE CASCADE,
    resume_id text,
    status application_status_enum NOT NULL DEFAULT 'APPLIED',
    applied_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE application_timeline (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id uuid NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    stage application_status_enum NOT NULL,
    status interview_round_status_enum NOT NULL DEFAULT 'PENDING',
    scheduled_at timestamptz,
    completed_at timestamptz,
    remarks text,
    created_at timestamptz NOT NULL DEFAULT now()
);
