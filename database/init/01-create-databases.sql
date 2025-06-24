-- Create main application database
CREATE DATABASE six_perfections;

-- Create separate databases for different environments if needed
CREATE DATABASE six_perfections_test;

-- Connect to main database
\c six_perfections;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom types for the Six Perfections
CREATE TYPE paramita_type AS ENUM (
    'generosity',
    'ethics', 
    'patience',
    'energy',
    'meditation',
    'wisdom'
);

CREATE TYPE user_role AS ENUM (
    'user',
    'premium_user',
    'researcher',
    'teacher',
    'admin'
);

CREATE TYPE assessment_status AS ENUM (
    'draft',
    'in_progress',
    'completed',
    'archived'
);

CREATE TYPE practice_type AS ENUM (
    'meditation',
    'reflection',
    'behavioral_exercise',
    'mindfulness_practice',
    'study',
    'community_service'
);

-- Create schemas for different service domains
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS users;
CREATE SCHEMA IF NOT EXISTS assessments;
CREATE SCHEMA IF NOT EXISTS content;
CREATE SCHEMA IF NOT EXISTS analytics;
CREATE SCHEMA IF NOT EXISTS notifications;

-- Grant permissions to application user
GRANT USAGE ON SCHEMA auth TO app_user;
GRANT USAGE ON SCHEMA users TO app_user;
GRANT USAGE ON SCHEMA assessments TO app_user;
GRANT USAGE ON SCHEMA content TO app_user;
GRANT USAGE ON SCHEMA analytics TO app_user;
GRANT USAGE ON SCHEMA notifications TO app_user;

GRANT CREATE ON SCHEMA auth TO app_user;
GRANT CREATE ON SCHEMA users TO app_user;
GRANT CREATE ON SCHEMA assessments TO app_user;
GRANT CREATE ON SCHEMA content TO app_user;
GRANT CREATE ON SCHEMA analytics TO app_user;
GRANT CREATE ON SCHEMA notifications TO app_user;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create function to generate short IDs
CREATE OR REPLACE FUNCTION generate_short_id()
RETURNS TEXT AS $$
BEGIN
    RETURN substring(gen_random_uuid()::text from 1 for 8);
END;
$$ language 'plpgsql';

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA users GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA assessments GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA content GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA analytics GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA notifications GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT USAGE, SELECT ON SEQUENCES TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA users GRANT USAGE, SELECT ON SEQUENCES TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA assessments GRANT USAGE, SELECT ON SEQUENCES TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA content GRANT USAGE, SELECT ON SEQUENCES TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA analytics GRANT USAGE, SELECT ON SEQUENCES TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA notifications GRANT USAGE, SELECT ON SEQUENCES TO app_user; 