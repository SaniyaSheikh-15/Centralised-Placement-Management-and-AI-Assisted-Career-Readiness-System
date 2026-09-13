SET search_path TO public;

ALTER TABLE placement_drives
    ADD CONSTRAINT placement_drives_deadline_after_drive_date
    CHECK (application_deadline >= drive_date);

ALTER TABLE drive_requirements
    ADD CONSTRAINT drive_requirements_type_check
    CHECK (requirement_type IN ('CGPA', 'BACKLOG', 'DEGREE', 'BRANCH', 'YEAR', 'SKILL', 'CERTIFICATION', 'EXPERIENCE'));

ALTER TABLE applications
    ADD CONSTRAINT applications_student_drive_unique
    UNIQUE (student_id, drive_id);

ALTER TABLE application_timeline
    ADD CONSTRAINT application_timeline_unique_stage
    UNIQUE (application_id, stage);
