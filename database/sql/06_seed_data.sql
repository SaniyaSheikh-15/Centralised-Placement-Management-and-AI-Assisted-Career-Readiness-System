SET search_path TO public;

INSERT INTO companies (id, name, industry, description, website, logo_url) VALUES
('00000000-0000-0000-0000-000000000001', 'Google', 'Technology', 'Build products used by billions of people and contribute to scalable infrastructure.', 'https://www.google.com', NULL),
('00000000-0000-0000-0000-000000000002', 'DataScope', 'Analytics', 'A fast-growing analytics company helping enterprises make data-driven decisions.', 'https://example.com', NULL),
('00000000-0000-0000-0000-000000000003', 'TCS', 'IT Services', 'A large-scale services organization with broad technology projects across domains.', 'https://www.tcs.com', NULL),
('00000000-0000-0000-0000-000000000004', 'StrideAI', 'AI Platform', 'An AI product company building workflow automation and machine learning tooling.', 'https://example.org', NULL);

INSERT INTO placement_drives (
    id, company_id, title, description, location, city, job_type, work_mode, ctc, openings, drive_date, application_deadline, status, selection_process
) VALUES
(
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Software Engineer',
    'Join the product engineering team to design scalable services and polished user experiences.',
    'Bengaluru, Karnataka',
    'Bengaluru',
    'FULL_TIME',
    'HYBRID',
    '₹18 LPA',
    12,
    '2026-08-30T09:00:00Z',
    '2026-08-28T23:59:59Z',
    'PUBLISHED',
    '[{"name":"Application","description":"Submit your application and resume.","status":"COMPLETED"},{"name":"Eligibility Verification","description":"Backend validates profile and eligibility.","status":"COMPLETED"},{"name":"Online Assessment","description":"Timed coding and problem-solving assessment.","status":"CURRENT"},{"name":"Technical Interview","description":"Problem solving and project discussion.","status":"UPCOMING"},{"name":"HR Interview","description":"Culture and compensation discussion.","status":"UPCOMING"},{"name":"Final Selection","description":"Final hiring outcome from the company.","status":"UPCOMING"}]'::jsonb
),
(
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000002',
    'Data Analyst',
    'Work on dashboards, reporting pipelines, and business intelligence products.',
    'Remote',
    'Remote',
    'FULL_TIME',
    'REMOTE',
    '₹10 LPA',
    8,
    '2026-09-01T10:30:00Z',
    '2026-09-01T23:59:59Z',
    'PUBLISHED',
    '[{"name":"Application","description":"Initial application screening.","status":"COMPLETED"},{"name":"Assessment","description":"Data and SQL assessment.","status":"CURRENT"},{"name":"Interview","description":"Business and technical interview.","status":"UPCOMING"},{"name":"Offer","description":"Final result shared through the portal.","status":"UPCOMING"}]'::jsonb
),
(
    '10000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000003',
    'Full Stack Developer',
    'Create and maintain enterprise applications across modern web stacks.',
    'Chennai, Tamil Nadu',
    'Chennai',
    'FULL_TIME',
    'ON_SITE',
    '₹7.2 LPA',
    20,
    '2026-08-20T10:00:00Z',
    '2026-08-20T23:59:59Z',
    'REGISTRATION_CLOSED',
    '[{"name":"Application","description":"Application is now closed.","status":"COMPLETED"},{"name":"Assessment","description":"Entrance test and coding round.","status":"UPCOMING"},{"name":"Technical Interview","description":"Role and project discussion.","status":"UPCOMING"},{"name":"HR Interview","description":"Final conversation with the panel.","status":"UPCOMING"}]'::jsonb
),
(
    '10000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000004',
    'ML Engineer',
    'Work on applied machine learning systems, evaluation tooling, and production deployments.',
    'Hybrid - Hyderabad, Telangana',
    'Hyderabad',
    'FULL_TIME',
    'HYBRID',
    '₹16 LPA',
    6,
    '2026-09-03T09:30:00Z',
    '2026-09-03T23:59:59Z',
    'PUBLISHED',
    '[{"name":"Application","description":"Submit application and resume.","status":"COMPLETED"},{"name":"Eligibility Verification","description":"Eligibility checked by backend.","status":"COMPLETED"},{"name":"Take-home Challenge","description":"Applied ML task and review.","status":"CURRENT"},{"name":"Technical Interview","description":"Modeling and deployment discussion.","status":"UPCOMING"},{"name":"Final Decision","description":"Offer decision is shared here.","status":"UPCOMING"}]'::jsonb
);

INSERT INTO drive_requirements (id, drive_id, requirement_type, requirement_name, operator, required_value, is_mandatory) VALUES
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'CGPA', 'CGPA', '>=', '7.5', true),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'BACKLOG', 'Backlogs', '=', '0', true),
('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'SKILL', 'React', 'required', 'Intermediate', true),
('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', 'SKILL', 'SQL', 'required', 'Advanced', true),
('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000003', 'CGPA', 'CGPA', '>=', '8.5', true),
('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000004', 'SKILL', 'Machine Learning', 'required', 'Intermediate', true);

INSERT INTO applications (id, application_code, student_id, drive_id, resume_id, status, applied_at) VALUES
('30000000-0000-0000-0000-000000000001', 'APP-2026-00142', '40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'resume_123', 'SHORTLISTED', '2026-08-26T08:15:00Z'),
('30000000-0000-0000-0000-000000000002', 'APP-2026-00096', '40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'resume_123', 'ELIGIBILITY_VERIFIED', '2026-08-24T10:20:00Z'),
('30000000-0000-0000-0000-000000000003', 'APP-2026-00117', '40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', 'resume_123', 'ASSESSMENT', '2026-08-22T11:45:00Z');

INSERT INTO application_timeline (id, application_id, stage, status, scheduled_at, completed_at, remarks) VALUES
('50000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'APPLIED', 'COMPLETED', NULL, '2026-08-26T08:15:00Z', 'Application submitted successfully.'),
('50000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'ELIGIBILITY_VERIFIED', 'COMPLETED', NULL, '2026-08-26T12:10:00Z', 'Profile met the mandatory requirements.'),
('50000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000001', 'SHORTLISTED', 'COMPLETED', NULL, '2026-08-27T09:30:00Z', 'Profile shortlisted for assessment.'),
('50000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000001', 'ASSESSMENT', 'SCHEDULED', '2026-08-31T10:00:00Z', NULL, 'Online assessment stage.'),
('50000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000002', 'APPLIED', 'COMPLETED', NULL, '2026-08-24T10:20:00Z', 'Application submitted.'),
('50000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000003', 'APPLIED', 'COMPLETED', NULL, '2026-08-22T11:45:00Z', 'Application received.'),
('50000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000003', 'ELIGIBILITY_VERIFIED', 'COMPLETED', NULL, '2026-08-22T13:00:00Z', 'Backend marked the profile as eligible.'),
('50000000-0000-0000-0000-000000000008', '30000000-0000-0000-0000-000000000003', 'SHORTLISTED', 'COMPLETED', NULL, '2026-08-23T08:30:00Z', 'Shortlisted for challenge.'),
('50000000-0000-0000-0000-000000000009', '30000000-0000-0000-0000-000000000003', 'ASSESSMENT', 'SCHEDULED', '2026-09-04T10:00:00Z', NULL, 'Take-home challenge active.');
