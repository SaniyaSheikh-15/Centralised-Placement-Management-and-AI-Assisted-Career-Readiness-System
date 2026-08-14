CREATE TABLE "roles" (
  "role_id" uuid PRIMARY KEY,
  "role_name" varchar(50) UNIQUE NOT NULL,
  "description" text,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "branches" (
  "branch_id" uuid PRIMARY KEY,
  "branch_code" varchar(20) UNIQUE NOT NULL,
  "branch_name" varchar(100) NOT NULL,
  "department" varchar(100),
  "created_at" timestamp
);

CREATE TABLE "job_roles" (
  "job_role_id" uuid PRIMARY KEY,
  "role_title" varchar(100) NOT NULL,
  "category" varchar(100),
  "description" text,
  "created_at" timestamp
);

CREATE TABLE "skills" (
  "skill_id" uuid PRIMARY KEY,
  "skill_name" varchar(100) UNIQUE NOT NULL,
  "category" varchar(100),
  "created_at" timestamp
);

CREATE TABLE "users" (
  "user_id" uuid PRIMARY KEY,
  "first_name" varchar(100) NOT NULL,
  "last_name" varchar(100),
  "email" varchar(255) UNIQUE NOT NULL,
  "phone" varchar(20),
  "password_hash" text NOT NULL,
  "profile_photo" text,
  "is_verified" boolean DEFAULT false,
  "email_verified_at" timestamp,
  "password_changed_at" timestamp,
  "is_active" boolean DEFAULT true,
  "last_login" timestamp,
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL
);

CREATE TABLE "user_roles" (
  "user_role_id" uuid PRIMARY KEY,
  "user_id" uuid NOT NULL,
  "role_id" uuid NOT NULL,
  "assigned_at" timestamp
);

CREATE TABLE "refresh_tokens" (
  "refresh_token_id" uuid PRIMARY KEY,
  "user_id" uuid NOT NULL,
  "token" text NOT NULL,
  "expires_at" timestamp,
  "revoked" boolean DEFAULT false,
  "created_at" timestamp
);

CREATE TABLE "student_profiles" (
  "student_id" uuid PRIMARY KEY,
  "user_id" uuid UNIQUE NOT NULL,
  "branch_id" uuid NOT NULL,
  "enrollment_no" varchar(30) UNIQUE NOT NULL,
  "semester" int,
  "cgpa" decimal(3,2),
  "graduation_year" int,
  "active_backlogs" int DEFAULT 0,
  "date_of_birth" date,
  "gender" varchar(20),
  "linkedin_url" text,
  "github_url" text,
  "portfolio_url" text,
  "bio" text,
  "resume_completion_percentage" int,
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL
);

CREATE TABLE "student_skills" (
  "student_skill_id" uuid PRIMARY KEY,
  "student_id" uuid NOT NULL,
  "skill_id" uuid NOT NULL,
  "proficiency_level" varchar(30),
  "years_of_experience" decimal(3,1),
  "created_at" timestamp
);

CREATE TABLE "projects" (
  "project_id" uuid PRIMARY KEY,
  "student_id" uuid NOT NULL,
  "title" varchar(200),
  "description" text,
  "github_url" text,
  "live_demo_url" text,
  "start_date" date,
  "end_date" date,
  "created_at" timestamp
);

CREATE TABLE "project_skills" (
  "project_skill_id" uuid PRIMARY KEY,
  "project_id" uuid NOT NULL,
  "skill_id" uuid NOT NULL,
  "created_at" timestamp
);

CREATE TABLE "certifications" (
  "certificate_id" uuid PRIMARY KEY,
  "student_id" uuid NOT NULL,
  "certificate_name" varchar(200),
  "issuing_organization" varchar(200),
  "issue_date" date,
  "expiry_date" date,
  "credential_url" text,
  "created_at" timestamp
);

CREATE TABLE "resumes" (
  "resume_id" uuid PRIMARY KEY,
  "student_id" uuid NOT NULL,
  "resume_file_name" varchar(255) NOT NULL,
  "resume_storage_path" text NOT NULL,
  "mime_type" varchar(50) NOT NULL,
  "file_size_kb" int,
  "version" int NOT NULL,
  "is_default" boolean DEFAULT false,
  "uploaded_at" timestamp NOT NULL
);

CREATE TABLE "companies" (
  "company_id" uuid PRIMARY KEY,
  "company_name" varchar(200) NOT NULL,
  "industry" varchar(100),
  "website" text,
  "email" varchar(255),
  "phone" varchar(20),
  "linkedin_url" text,
  "headquarters" varchar(200),
  "company_description" text,
  "logo_url" text,
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL
);

CREATE TABLE "recruiters" (
  "recruiter_id" uuid PRIMARY KEY,
  "user_id" uuid UNIQUE NOT NULL,
  "company_id" uuid NOT NULL,
  "designation" varchar(100),
  "official_email" varchar(255),
  "contact_number" varchar(20),
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL
);

CREATE TABLE "placement_drives" (
  "drive_id" uuid PRIMARY KEY,
  "company_id" uuid NOT NULL,
  "recruiter_id" uuid NOT NULL,
  "job_role_id" uuid NOT NULL,
  "drive_title" varchar(255),
  "job_description" text,
  "employment_type" varchar(50),
  "work_mode" varchar(50),
  "location" varchar(150),
  "minimum_package_lpa" decimal(6,2),
  "maximum_package_lpa" decimal(6,2),
  "vacancies" int,
  "registration_deadline" timestamp,
  "drive_date" timestamp,
  "status" varchar(30),
  "created_at" timestamp NOT NULL,
  "updated_at" timestamp NOT NULL
);

CREATE TABLE "eligibility_rules" (
  "eligibility_rule_id" uuid PRIMARY KEY,
  "drive_id" uuid UNIQUE NOT NULL,
  "minimum_cgpa" decimal(3,2),
  "maximum_backlogs" int,
  "graduation_year" int,
  "minimum_tenth_percentage" decimal(5,2),
  "minimum_twelfth_percentage" decimal(5,2),
  "created_at" timestamp
);

CREATE TABLE "drive_branches" (
  "drive_branch_id" uuid PRIMARY KEY,
  "drive_id" uuid NOT NULL,
  "branch_id" uuid NOT NULL
);

CREATE TABLE "drive_skills" (
  "drive_skill_id" uuid PRIMARY KEY,
  "drive_id" uuid NOT NULL,
  "skill_id" uuid NOT NULL,
  "minimum_proficiency" varchar(30)
);

CREATE TABLE "applications" (
  "application_id" uuid PRIMARY KEY,
  "drive_id" uuid NOT NULL,
  "student_id" uuid NOT NULL,
  "resume_id" uuid NOT NULL,
  "application_status" varchar(30),
  "applied_at" timestamp
);

CREATE TABLE "drive_documents" (
  "drive_document_id" uuid PRIMARY KEY,
  "drive_id" uuid NOT NULL,
  "document_name" varchar(255),
  "document_type" varchar(50),
  "document_storage_path" text,
  "uploaded_at" timestamp
);

CREATE TABLE "interview_stages" (
  "interview_stage_id" uuid PRIMARY KEY,
  "stage_name" varchar(100) NOT NULL,
  "sequence_no" int NOT NULL,
  "description" text,
  "created_at" timestamp
);

CREATE TABLE "interview_rounds" (
  "interview_round_id" uuid PRIMARY KEY,
  "application_id" uuid NOT NULL,
  "interview_stage_id" uuid NOT NULL,
  "interviewer_name" varchar(150),
  "interview_date" timestamp,
  "meeting_link" text,
  "remarks" text,
  "round_status" varchar(30),
  "score" decimal(5,2),
  "created_at" timestamp
);

CREATE TABLE "placement_results" (
  "placement_result_id" uuid PRIMARY KEY,
  "application_id" uuid UNIQUE NOT NULL,
  "final_status" varchar(30),
  "offered_package" decimal(6,2),
  "joining_date" date,
  "offer_acceptance_date" date,
  "joining_status" varchar(30),
  "offer_letter_path" text,
  "remarks" text,
  "created_at" timestamp
);

CREATE TABLE "resume_analysis" (
  "analysis_id" uuid PRIMARY KEY,
  "resume_id" uuid NOT NULL,
  "job_role_id" uuid,
  "ats_score" decimal(5,2),
  "job_match_percentage" decimal(5,2),
  "missing_keywords" text,
  "strengths" text,
  "weaknesses" text,
  "recommendations" text,
  "analyzed_at" timestamp
);

CREATE TABLE "skill_gap_reports" (
  "report_id" uuid PRIMARY KEY,
  "student_id" uuid NOT NULL,
  "target_job_role_id" uuid,
  "missing_skills" text,
  "recommended_courses" text,
  "generated_at" timestamp
);

CREATE TABLE "mock_interviews" (
  "mock_interview_id" uuid PRIMARY KEY,
  "student_id" uuid NOT NULL,
  "job_role_id" uuid,
  "grammar_score" decimal(5,2),
  "fluency_score" decimal(5,2),
  "confidence_score" decimal(5,2),
  "technical_score" decimal(5,2),
  "overall_score" decimal(5,2),
  "ai_feedback" text,
  "duration_minutes" int,
  "transcript_storage_path" text,
  "completed_at" timestamp
);

CREATE TABLE "career_chat" (
  "chat_id" uuid PRIMARY KEY,
  "student_id" uuid NOT NULL,
  "question" text,
  "answer" text,
  "created_at" timestamp
);

CREATE TABLE "notifications" (
  "notification_id" uuid PRIMARY KEY,
  "user_id" uuid NOT NULL,
  "title" varchar(255),
  "message" text,
  "notification_type" varchar(30),
  "is_read" boolean DEFAULT false,
  "read_at" timestamp,
  "created_at" timestamp
);

CREATE UNIQUE INDEX ON "applications" ("student_id", "drive_id");

COMMENT ON TABLE "project_skills" IS 'Each project can have multiple skills.';

ALTER TABLE "user_roles" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "user_roles" ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("role_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "refresh_tokens" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "student_profiles" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "student_profiles" ADD FOREIGN KEY ("branch_id") REFERENCES "branches" ("branch_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "student_skills" ADD FOREIGN KEY ("student_id") REFERENCES "student_profiles" ("student_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "student_skills" ADD FOREIGN KEY ("skill_id") REFERENCES "skills" ("skill_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "projects" ADD FOREIGN KEY ("student_id") REFERENCES "student_profiles" ("student_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "project_skills" ADD FOREIGN KEY ("project_id") REFERENCES "projects" ("project_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "project_skills" ADD FOREIGN KEY ("skill_id") REFERENCES "skills" ("skill_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "certifications" ADD FOREIGN KEY ("student_id") REFERENCES "student_profiles" ("student_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "resumes" ADD FOREIGN KEY ("student_id") REFERENCES "student_profiles" ("student_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "recruiters" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "recruiters" ADD FOREIGN KEY ("company_id") REFERENCES "companies" ("company_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "placement_drives" ADD FOREIGN KEY ("company_id") REFERENCES "companies" ("company_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "placement_drives" ADD FOREIGN KEY ("recruiter_id") REFERENCES "recruiters" ("recruiter_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "placement_drives" ADD FOREIGN KEY ("job_role_id") REFERENCES "job_roles" ("job_role_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "eligibility_rules" ADD FOREIGN KEY ("drive_id") REFERENCES "placement_drives" ("drive_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "drive_branches" ADD FOREIGN KEY ("drive_id") REFERENCES "placement_drives" ("drive_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "drive_branches" ADD FOREIGN KEY ("branch_id") REFERENCES "branches" ("branch_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "drive_skills" ADD FOREIGN KEY ("drive_id") REFERENCES "placement_drives" ("drive_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "drive_skills" ADD FOREIGN KEY ("skill_id") REFERENCES "skills" ("skill_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "applications" ADD FOREIGN KEY ("drive_id") REFERENCES "placement_drives" ("drive_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "applications" ADD FOREIGN KEY ("student_id") REFERENCES "student_profiles" ("student_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "applications" ADD FOREIGN KEY ("resume_id") REFERENCES "resumes" ("resume_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "drive_documents" ADD FOREIGN KEY ("drive_id") REFERENCES "placement_drives" ("drive_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "interview_rounds" ADD FOREIGN KEY ("application_id") REFERENCES "applications" ("application_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "interview_rounds" ADD FOREIGN KEY ("interview_stage_id") REFERENCES "interview_stages" ("interview_stage_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "placement_results" ADD FOREIGN KEY ("application_id") REFERENCES "applications" ("application_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "resume_analysis" ADD FOREIGN KEY ("resume_id") REFERENCES "resumes" ("resume_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "resume_analysis" ADD FOREIGN KEY ("job_role_id") REFERENCES "job_roles" ("job_role_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "skill_gap_reports" ADD FOREIGN KEY ("student_id") REFERENCES "student_profiles" ("student_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "skill_gap_reports" ADD FOREIGN KEY ("target_job_role_id") REFERENCES "job_roles" ("job_role_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "mock_interviews" ADD FOREIGN KEY ("student_id") REFERENCES "student_profiles" ("student_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "mock_interviews" ADD FOREIGN KEY ("job_role_id") REFERENCES "job_roles" ("job_role_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "career_chat" ADD FOREIGN KEY ("student_id") REFERENCES "student_profiles" ("student_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "notifications" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") DEFERRABLE INITIALLY IMMEDIATE;
