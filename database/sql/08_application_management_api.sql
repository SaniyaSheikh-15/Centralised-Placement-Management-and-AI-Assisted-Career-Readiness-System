-- Apply after database/sql/placement_management_v1.sql.
-- The applications table and unique (student_id, drive_id) index are already
-- defined in the base schema. This table preserves every lifecycle change.

CREATE TABLE IF NOT EXISTS application_status_history (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id uuid NOT NULL
        REFERENCES applications(application_id) ON DELETE CASCADE,
    from_status varchar(30),
    to_status varchar(30) NOT NULL,
    remarks text,
    source varchar(30) NOT NULL
        CHECK (source IN ('STUDENT', 'PLACEMENT_OFFICER', 'ELIGIBILITY_ENGINE', 'SYSTEM')),
    scheduled_at timestamp,
    created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS application_status_history_application_created_idx
    ON application_status_history (application_id, created_at DESC);
