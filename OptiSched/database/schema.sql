-- OptiSched Database Schema
-- MySQL Database for School Scheduling System

-- Create database
CREATE DATABASE IF NOT EXISTS optisched_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE optisched_db;

-- User roles table (must be created first)
CREATE TABLE user_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    permissions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table with role-based access
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role_id INT NOT NULL,
    profile_picture VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    FOREIGN KEY (role_id) REFERENCES user_roles(id)
);

-- Insert user roles with permissions
INSERT INTO user_roles (role_name, description, permissions) VALUES
('student', 'Student - View only access', JSON_OBJECT(
    'can_view_schedule', true,
    'can_edit_schedule', false,
    'can_view_profile', true,
    'can_edit_profile', true,
    'can_manage_users', false,
    'can_manage_events', false,
    'can_manage_system', false
)),
('teacher', 'Teacher - Can edit own schedule', JSON_OBJECT(
    'can_view_schedule', true,
    'can_edit_schedule', true,
    'can_view_profile', true,
    'can_edit_profile', true,
    'can_manage_users', false,
    'can_manage_events', false,
    'can_manage_system', false
)),
('principal', 'Principal - Can manage schedules and users', JSON_OBJECT(
    'can_view_schedule', true,
    'can_edit_schedule', true,
    'can_view_profile', true,
    'can_edit_profile', true,
    'can_manage_users', true,
    'can_manage_events', true,
    'can_manage_system', false
)),
('it_manager', 'IT Manager - Full system access', JSON_OBJECT(
    'can_view_schedule', true,
    'can_edit_schedule', true,
    'can_view_profile', true,
    'can_edit_profile', true,
    'can_manage_users', true,
    'can_manage_events', true,
    'can_manage_system', true
)),
('event_handler', 'Event Handler - Can manage events', JSON_OBJECT(
    'can_view_schedule', true,
    'can_edit_schedule', false,
    'can_view_profile', true,
    'can_edit_profile', true,
    'can_manage_users', false,
    'can_manage_events', true,
    'can_manage_system', false
));

-- Departments table
CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    description TEXT,
    head_teacher_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (head_teacher_id) REFERENCES users(id)
);

-- Students table
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    grade_level INT NOT NULL,
    section VARCHAR(20),
    department_id INT,
    enrollment_date DATE NOT NULL,
    gpa DECIMAL(3,2) DEFAULT 0.00,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Teachers table
CREATE TABLE teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    department_id INT,
    specialization VARCHAR(100),
    hire_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Subjects table
CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_code VARCHAR(20) UNIQUE NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    description TEXT,
    credits INT DEFAULT 1,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Classes table
CREATE TABLE classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_name VARCHAR(50) NOT NULL,
    subject_id INT NOT NULL,
    teacher_id INT NOT NULL,
    room VARCHAR(20),
    schedule JSON, -- Store schedule as JSON: {"monday": ["8:00-9:00", "10:00-11:00"], ...}
    max_students INT DEFAULT 30,
    current_students INT DEFAULT 0,
    semester VARCHAR(20) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(id)
);

-- Student enrollments
CREATE TABLE student_enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    class_id INT NOT NULL,
    enrollment_date DATE NOT NULL,
    grade DECIMAL(4,2),
    status ENUM('enrolled', 'dropped', 'completed') DEFAULT 'enrolled',
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (class_id) REFERENCES classes(id),
    UNIQUE KEY unique_enrollment (student_id, class_id)
);

-- Events table
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_type ENUM('holiday', 'exam', 'meeting', 'activity', 'maintenance') NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    location VARCHAR(100),
    organizer_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES users(id)
);

-- Schedule changes/announcements
CREATE TABLE schedule_changes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NOT NULL,
    teacher_id INT NOT NULL,
    change_type ENUM('cancelled', 'rescheduled', 'room_change', 'substitute') NOT NULL,
    original_date DATE NOT NULL,
    new_date DATE,
    new_room VARCHAR(20),
    substitute_teacher_id INT,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(id),
    FOREIGN KEY (substitute_teacher_id) REFERENCES teachers(id)
);

-- System logs for audit trail
CREATE TABLE system_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert sample departments
INSERT INTO departments (department_name, description) VALUES
('Academic Affairs', 'Main academic department'),
('Science and Technology', 'Science and technology courses'),
('Mathematics', 'Mathematics department'),
('Languages', 'Language and literature department'),
('Physical Education', 'Sports and physical education');

-- Insert sample subjects matching the dashboard data
INSERT INTO subjects (subject_code, subject_name, description, credits, department_id) VALUES
('PEH4', 'Physical Education and Health 4', 'Physical fitness and health education', 2, 5),
('CWP6', 'Computer/Web Programming 6 - Computer Programming NC III (.NET Technology)', 'Advanced web programming with .NET', 3, 2),
('MAP2', 'Mobile App Programming 2', 'Mobile application development', 3, 2),
('CAFR', 'Contemporary Arts from the regions', 'Regional contemporary arts', 3, 4),
('HRM', 'Homeroom', 'Homeroom guidance class', 1, 1),
('WIIP', 'Work Immersion-Practicum Type', 'Work immersion program', 4, 1),
('III', 'Inquiries Investigation and Immersion', 'Research and immersion program', 3, 2),
('ETICT', 'Empowerment Technologies: ICT', 'Information and communication technologies', 3, 2),
('ENTREP', 'Entrepreneurship', 'Entrepreneurship and business management', 3, 1);

-- Insert student with exact name from UserContext
INSERT INTO users (username, email, password_hash, first_name, last_name, role_id) VALUES
('morgado', 'morgado@school.edu', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ace A.', 'Morgado', 1),
('habanajr', 'habanajr@school.edu', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'EDGAR P.', 'HABANA Jr', 2),
('calizon', 'calizon@school.edu', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'John Michael', 'Calizon', 2),
('mariano', 'mariano@school.edu', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Psalmmirac Le Pineda', 'MARIANO', 2),
('ellojr', 'ellojr@school.edu', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'EGNACIO Y', 'ELLO Jr.', 2),
('magno', 'magno@school.edu', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'BEA ANGLY', 'MAGNO', 2),
('arnado', 'arnado@school.edu', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'RENEIL P.', 'ARNADO', 2),
('principal001', 'principal@school.edu', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Robert', 'Johnson', 3),
('itmanager001', 'itmanager@school.edu', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mike', 'Wilson', 4),
('event001', 'events@school.edu', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Sarah', 'Brown', 5);

-- Create indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_teachers_user_id ON teachers(user_id);
CREATE INDEX idx_classes_teacher ON classes(teacher_id);
CREATE INDEX idx_classes_subject ON classes(subject_id);
CREATE INDEX idx_enrollments_student ON student_enrollments(student_id);
CREATE INDEX idx_enrollments_class ON student_enrollments(class_id);
CREATE INDEX idx_events_date ON events(start_date);
CREATE INDEX idx_logs_user ON system_logs(user_id);
CREATE INDEX idx_logs_created ON system_logs(created_at);

-- Create trigger for updating updated_at timestamp
DELIMITER //
CREATE TRIGGER before_users_update 
BEFORE UPDATE ON users 
FOR EACH ROW 
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END//
DELIMITER ;

-- Insert corresponding student and teacher records with updated IDs
INSERT INTO students (user_id, student_id, grade_level, section, department_id, enrollment_date) VALUES
(1, '02000399541', 12, 'A', 1, CURDATE());

INSERT INTO teachers (user_id, employee_id, department_id, specialization, hire_date) VALUES
(2, 'TCH001', 5, 'Physical Education', CURDATE()),
(3, 'TCH002', 2, 'Computer Programming', CURDATE()),
(4, 'TCH003', 2, 'Mobile App Development', CURDATE()),
(5, 'TCH004', 1, 'Work Immersion', CURDATE()),
(6, 'TCH005', 2, 'Research', CURDATE()),
(7, 'TCH006', 2, 'ICT', CURDATE()),
(8, 'PRN001', 1, 'School Administration', CURDATE()),
(9, 'ITM001', 2, 'IT Management', CURDATE()),
(10, 'EVT001', 1, 'Event Management', CURDATE());

-- Insert classes matching the dashboard schedule with correct teacher IDs
INSERT INTO classes (class_name, subject_id, teacher_id, room, schedule, max_students, current_students, semester, academic_year, is_active) VALUES
('PEH4-Monday', 1, 2, 'Gym', '{"monday": ["7:00 AM - 9:00 AM"]}', 30, 25, 'First', '2024-2025', 1),
('CWP6-Monday', 2, 3, 'Lab 1', '{"monday": ["10:00 AM - 1:00 PM"]}', 25, 20, 'First', '2024-2025', 1),
('MAP2-Monday', 3, 4, 'Lab 2', '{"monday": ["1:00 PM - 4:00 PM"]}', 25, 18, 'First', '2024-2025', 1),
('CAFR-Tuesday', 4, 2, 'Room 101', '{"tuesday": ["10:00 AM - 1:00 PM"]}', 30, 22, 'First', '2024-2025', 1),
('HRM-Tuesday', 5, 2, 'Room 102', '{"tuesday": ["2:00 PM - 4:00 PM"]}', 30, 25, 'First', '2024-2025', 1),
('WIIP-Tuesday', 6, 5, 'Room 103', '{"tuesday": ["2:00 PM - 4:00 PM"]}', 20, 15, 'First', '2024-2025', 1),
('III-TueThu', 7, 6, 'Lab 3', '{"tuesday": ["8:30 AM - 10:00 AM"], "thursday": ["8:30 AM - 10:00 AM"]}', 25, 20, 'First', '2024-2025', 1),
('ETICT-Thursday', 8, 7, 'Lab 1', '{"thursday": ["10:00 AM - 1:00 PM"]}', 25, 22, 'First', '2024-2025', 1),
('ENTREP-Thursday', 9, 7, 'Room 104', '{"thursday": ["2:30 PM - 5:20 PM"]}', 30, 28, 'First', '2024-2025', 1);

-- Enroll Morgado student in classes
INSERT INTO student_enrollments (student_id, class_id, enrollment_date, status) VALUES
(1, 1, CURDATE(), 'enrolled'),
(1, 2, CURDATE(), 'enrolled'),
(1, 3, CURDATE(), 'enrolled'),
(1, 4, CURDATE(), 'enrolled'),
(1, 5, CURDATE(), 'enrolled'),
(1, 6, CURDATE(), 'enrolled'),
(1, 7, CURDATE(), 'enrolled'),
(1, 8, CURDATE(), 'enrolled'),
(1, 9, CURDATE(), 'enrolled');
