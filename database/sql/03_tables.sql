-- ============================================================
-- Centralised Placement Management & AI-Assisted Career Readiness System
-- File: 03_tables.sql
-- Version: Database Design v1.0
-- Description: Final 29-table PostgreSQL schema
-- Source of truth: placement_management_v1.dbml
-- ============================================================

SET search_path TO public;

-- ============================================================
-- 1. MASTER TABLES
-- ============================================================

CREATE TABLE roles (
    role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE branches (
    branch_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_code VARCHAR(20) NOT NULL UNIQUE,
    branch_name VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    created_at TIMESTAMP
);

CREATE TABLE job_roles (
    job_role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_title VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP
);

CREATE TABLE skills (
    skill_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(100),
    created_at TIMESTAMP
);

-- ============================================================
-- 2. AUTHENTICATION & AUTHORIZATION
-- ============================================================

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password_hash TEXT NOT NULL,
    profile_photo TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP,
    password_changed_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE user_roles (
    user_role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id),
    role_id UUID NOT NULL REFERENCES roles(role_id),
    assigned_at TIMESTAMP
);

CREATE TABLE refresh_tokens (
    refresh_token_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id),
    token TEXT NOT NULL,
    expires_at TIMESTAMP,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP
);

-- ============================================================
-- 3. STUDENT MODULE
-- ============================================================

CREATE TABLE student_profiles (
    student_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(user_id),
    branch_id UUID NOT NULL REFERENCES branches(branch_id),
    enrollment_no VARCHAR(30) NOT NULL UNIQUE,
    semester INT,
    cgpa DECIMAL(3,2),
    graduation_year INT,
    active_backlogs INT DEFAULT 0,
    date_of_birth DATE,
    gender VARCHAR(20),
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    bio TEXT,
    resume_completion_percentage INT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE student_skills (
    student_skill_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES student_profiles(student_id),
    skill_id UUID NOT NULL REFERENCES skills(skill_id),
    proficiency_level VARCHAR(30),
    years_of_experience DECIMAL(3,1),
    created_at TIMESTAMP
);

CREATE TABLE projects (
    project_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES student_profiles(student_id),
    title VARCHAR(200),
    description TEXT,
    github_url TEXT,
    live_demo_url TEXT,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP
);

CREATE TABLE project_skills (
    project_skill_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(project_id),
    skill_id UUID NOT NULL REFERENCES skills(skill_id),
    created_at TIMESTAMP
);

CREATE TABLE certifications (
    certificate_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES student_profiles(student_id),
    certificate_name VARCHAR(200),
    issuing_organization VARCHAR(200),
    issue_date DATE,
    expiry_date DATE,
    credential_url TEXT,
    created_at TIMESTAMP
);

CREATE TABLE resumes (
    resume_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES student_profiles(student_id),
    resume_file_name VARCHAR(255) NOT NULL,
    resume_storage_path TEXT NOT NULL,
    mime_type VARCHAR(50) NOT NULL,
    file_size_kb INT,
    version INT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMP NOT NULL
);

-- ============================================================
-- 4. RECRUITER MODULE
-- ============================================================

CREATE TABLE companies (
    company_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(200) NOT NULL,
    industry VARCHAR(100),
    website TEXT,
    email VARCHAR(255),
    phone VARCHAR(20),
    linkedin_url TEXT,
    headquarters VARCHAR(200),
    company_description TEXT,
    logo_url TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE recruiters (
    recruiter_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(user_id),
    company_id UUID NOT NULL REFERENCES companies(company_id),
    designation VARCHAR(100),
    official_email VARCHAR(255),
    contact_number VARCHAR(20),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- ============================================================
-- 5. PLACEMENT DRIVE MODULE
-- ============================================================

CREATE TABLE placement_drives (
    drive_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(company_id),
    recruiter_id UUID NOT NULL REFERENCES recruiters(recruiter_id),
    job_role_id UUID NOT NULL REFERENCES job_roles(job_role_id),
    drive_title VARCHAR(255),
    job_description TEXT,
    employment_type VARCHAR(50),
    work_mode VARCHAR(50),
    location VARCHAR(150),
    minimum_package_lpa DECIMAL(6,2),
    maximum_package_lpa DECIMAL(6,2),
    vacancies INT,
    registration_deadline TIMESTAMP,
    drive_date TIMESTAMP,
    status VARCHAR(30),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE eligibility_rules (
    eligibility_rule_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    drive_id UUID NOT NULL UNIQUE REFERENCES placement_drives(drive_id),
    minimum_cgpa DECIMAL(3,2),
    maximum_backlogs INT,
    graduation_year INT,
    minimum_tenth_percentage DECIMAL(5,2),
    minimum_twelfth_percentage DECIMAL(5,2),
    created_at TIMESTAMP
);

CREATE TABLE drive_branches (
    drive_branch_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    drive_id UUID NOT NULL REFERENCES placement_drives(drive_id),
    branch_id UUID NOT NULL REFERENCES branches(branch_id)
);

CREATE TABLE drive_skills (
    drive_skill_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    drive_id UUID NOT NULL REFERENCES placement_drives(drive_id),
    skill_id UUID NOT NULL REFERENCES skills(skill_id),
    minimum_proficiency VARCHAR(30)
);

CREATE TABLE applications (
    application_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    drive_id UUID NOT NULL REFERENCES placement_drives(drive_id),
    student_id UUID NOT NULL REFERENCES student_profiles(student_id),
    resume_id UUID NOT NULL REFERENCES resumes(resume_id),
    application_status VARCHAR(30),
    applied_at TIMESTAMP,
    CONSTRAINT uq_applications_student_drive UNIQUE (student_id, drive_id)
);

CREATE TABLE drive_documents (
    drive_document_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    drive_id UUID NOT NULL REFERENCES placement_drives(drive_id),
    document_name VARCHAR(255),
    document_type VARCHAR(50),
    document_storage_path TEXT,
    uploaded_at TIMESTAMP
);

-- ============================================================
-- 6. INTERVIEW & PLACEMENT RESULTS
-- ============================================================

CREATE TABLE interview_stages (
    interview_stage_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stage_name VARCHAR(100) NOT NULL,
    sequence_no INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP
);

CREATE TABLE interview_rounds (
    interview_round_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(application_id),
    interview_stage_id UUID NOT NULL REFERENCES interview_stages(interview_stage_id),
    interviewer_name VARCHAR(150),
    interview_date TIMESTAMP,
    meeting_link TEXT,
    remarks TEXT,
    round_status VARCHAR(30),
    score DECIMAL(5,2),
    created_at TIMESTAMP
);

CREATE TABLE placement_results (
    placement_result_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL UNIQUE REFERENCES applications(application_id),
    final_status VARCHAR(30),
    offered_package DECIMAL(6,2),
    joining_date DATE,
    offer_acceptance_date DATE,
    joining_status VARCHAR(30),
    offer_letter_path TEXT,
    remarks TEXT,
    created_at TIMESTAMP
);

-- ============================================================
-- 7. AI / CAREER READINESS MODULE
-- ============================================================

CREATE TABLE resume_analysis (
    analysis_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID NOT NULL REFERENCES resumes(resume_id),
    job_role_id UUID REFERENCES job_roles(job_role_id),
    ats_score DECIMAL(5,2),
    job_match_percentage DECIMAL(5,2),
    missing_keywords TEXT,
    strengths TEXT,
    weaknesses TEXT,
    recommendations TEXT,
    analyzed_at TIMESTAMP
);

CREATE TABLE skill_gap_reports (
    report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES student_profiles(student_id),
    target_job_role_id UUID REFERENCES job_roles(job_role_id),
    missing_skills TEXT,
    recommended_courses TEXT,
    generated_at TIMESTAMP
);

CREATE TABLE mock_interviews (
    mock_interview_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES student_profiles(student_id),
    job_role_id UUID REFERENCES job_roles(job_role_id),
    grammar_score DECIMAL(5,2),
    fluency_score DECIMAL(5,2),
    confidence_score DECIMAL(5,2),
    technical_score DECIMAL(5,2),
    overall_score DECIMAL(5,2),
    ai_feedback TEXT,
    duration_minutes INT,
    transcript_storage_path TEXT,
    completed_at TIMESTAMP
);

CREATE TABLE career_chat (
    chat_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES student_profiles(student_id),
    question TEXT,
    answer TEXT,
    created_at TIMESTAMP
);

-- ============================================================
-- 8. NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id),
    title VARCHAR(255),
    message TEXT,
    notification_type VARCHAR(30),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP
);

-- ============================================================
-- END OF 29-TABLE SCHEMA
-- ============================================================