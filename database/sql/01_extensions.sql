-- ============================================================
-- Centralised Placement Management & AI-Assisted Career Readiness System
-- File: 01_extensions.sql
-- Description: Enable required PostgreSQL extensions
-- ============================================================

-- Enable pgcrypto extension for UUID generation

CREATE EXTENSION IF NOT EXISTS "pgcrypto";