-- AI Career OS Database Schema
-- Production-grade normalized relational schema

CREATE DATABASE IF NOT EXISTS ai_career_os;
USE ai_career_os;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Resumes Table
CREATE TABLE IF NOT EXISTS resumes (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    file_url TEXT NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- Extracted Resume Data Table
CREATE TABLE IF NOT EXISTS extracted_resume_data (
    id VARCHAR(36) PRIMARY KEY,
    resume_id VARCHAR(36) NOT NULL,
    raw_json JSON,
    summary TEXT,
    experience_years DECIMAL(4, 1),
    education_level VARCHAR(100),
    FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE,
    INDEX idx_resume_id (resume_id)
);

-- Skills Table
CREATE TABLE IF NOT EXISTS skills (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50),
    INDEX idx_skill_name (name)
);

-- User Skills (Many-to-Many)
CREATE TABLE IF NOT EXISTS user_skills (
    user_id VARCHAR(36) NOT NULL,
    skill_id VARCHAR(36) NOT NULL,
    proficiency_level TINYINT CHECK (proficiency_level BETWEEN 1 AND 5),
    PRIMARY KEY (user_id, skill_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- Job Roles Table
CREATE TABLE IF NOT EXISTS job_roles (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    INDEX idx_job_title (title)
);

-- Job Requirements Table
CREATE TABLE IF NOT EXISTS job_requirements (
    id VARCHAR(36) PRIMARY KEY,
    job_role_id VARCHAR(36) NOT NULL,
    skill_id VARCHAR(36) NOT NULL,
    weight TINYINT DEFAULT 1,
    FOREIGN KEY (job_role_id) REFERENCES job_roles(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- Study Plans Table
CREATE TABLE IF NOT EXISTS study_plans (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    goal TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_study_plans (user_id)
);

-- Learning Progress Table
CREATE TABLE IF NOT EXISTS learning_progress (
    id VARCHAR(36) PRIMARY KEY,
    study_plan_id VARCHAR(36) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    status ENUM('not_started', 'in_progress', 'completed') DEFAULT 'not_started',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (study_plan_id) REFERENCES study_plans(id) ON DELETE CASCADE
);

-- Interview Sessions Table
CREATE TABLE IF NOT EXISTS interview_sessions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    job_role_id VARCHAR(36) NOT NULL,
    status ENUM('scheduled', 'ongoing', 'completed', 'cancelled', 'flagged') DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (job_role_id) REFERENCES job_roles(id) ON DELETE CASCADE
);

-- Interview Feedback Table
CREATE TABLE IF NOT EXISTS interview_feedback (
    id VARCHAR(36) PRIMARY KEY,
    interview_session_id VARCHAR(36) NOT NULL,
    question TEXT NOT NULL,
    answer TEXT,
    score TINYINT,
    feedback_text TEXT,
    FOREIGN KEY (interview_session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE
);

-- Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    salary_range VARCHAR(100),
    type ENUM('full-time', 'part-time', 'contract', 'remote') DEFAULT 'full-time',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_job_title_search (title)
);

-- Applications Table
CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    job_id VARCHAR(36) NOT NULL,
    status ENUM('applied', 'interviewing', 'offered', 'rejected') DEFAULT 'applied',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    UNIQUE (user_id, job_id)
);

-- Proctoring Logs Table
CREATE TABLE IF NOT EXISTS proctoring_logs (
    id VARCHAR(36) PRIMARY KEY,
    session_id VARCHAR(36) NOT NULL,
    violation_type ENUM('multi_face', 'no_face', 'tab_switch', 'eye_deviation', 'voice_detected', 'virtual_camera_detected', 'device_info', 'gadget_detected') NOT NULL,
    severity ENUM('low', 'medium', 'high') DEFAULT 'low',
    metadata JSON,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE
);

-- Interview Evaluation Metrics Table
CREATE TABLE IF NOT EXISTS interview_metrics (
    id VARCHAR(36) PRIMARY KEY,
    session_id VARCHAR(36) NOT NULL,
    technical_score TINYINT,
    communication_score TINYINT,
    confidence_score TINYINT,
    proctoring_risk_score TINYINT DEFAULT 0,
    ai_feedback TEXT,
    FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE
);
