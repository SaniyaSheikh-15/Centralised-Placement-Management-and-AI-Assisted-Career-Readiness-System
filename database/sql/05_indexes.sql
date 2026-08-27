SET search_path TO public;

CREATE INDEX idx_companies_name ON companies(name);
CREATE INDEX idx_placement_drives_status_deadline ON placement_drives(status, application_deadline);
CREATE INDEX idx_placement_drives_company_id ON placement_drives(company_id);
CREATE INDEX idx_drive_requirements_drive_id ON drive_requirements(drive_id);
CREATE INDEX idx_applications_student_status ON applications(student_id, status);
CREATE INDEX idx_applications_drive_id ON applications(drive_id);
CREATE INDEX idx_application_timeline_application_id ON application_timeline(application_id);
