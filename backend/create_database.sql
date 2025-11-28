-- Create database for Pair Programming application
-- Run this script with: psql -U postgres -f create_database.sql

-- Drop database if exists (optional, uncomment if needed)
-- DROP DATABASE IF EXISTS PairPrograming;

-- Create database
CREATE DATABASE PairPrograming;

-- Connect to the database
\c PairPrograming

-- Tables will be created automatically by SQLAlchemy when the application starts
-- The Room model will create a 'rooms' table with the following structure:
--
-- CREATE TABLE rooms (
--     room_id VARCHAR(36) PRIMARY KEY,
--     code_content TEXT NOT NULL DEFAULT '',
--     language VARCHAR(50) NOT NULL DEFAULT 'python',
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );
