-- This script is used to initialize the database schema.
-- We will use this in Phase 2 when configuring the Kubernetes MySQL StatefulSet (via a ConfigMap for initialization).

CREATE DATABASE IF NOT EXISTS user_directory;
USE user_directory;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    role VARCHAR(50) DEFAULT 'User',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some dummy data for initial testing
INSERT IGNORE INTO users (name, email, role) VALUES 
('Alice Admin', 'alice@example.com', 'Admin'),
('Bob Builder', 'bob@example.com', 'User');
