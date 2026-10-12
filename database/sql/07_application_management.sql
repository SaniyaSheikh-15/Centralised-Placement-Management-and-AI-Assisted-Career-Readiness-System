-- Application Management additions: append-only audit history for every status change.
-- Existing applications and application_timeline tables remain the source of the
-- current state and student-facing lifecycle view respectively.

SET search_path TO public;

CREATE TABLE application_status_history (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id uuid NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    from_status application_status_enum,
    to_status application_status_enum NOT NULL,
    remarks text,
    source text NOT NULL CHECK (source IN ('STUDENT', 'PLACEMENT_OFFICER', 'ELIGIBILITY_ENGINE', 'SYSTEM')),
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX application_status_history_application_created_idx
    ON application_status_history (application_id, created_at DESC);
