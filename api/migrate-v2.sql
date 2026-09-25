-- Right Step Consultancy — V2 Migration
-- Adds client profiles, consulting sessions, deliverables, and journey tracking.

CREATE TABLE IF NOT EXISTS client_profiles (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL UNIQUE,
  company VARCHAR(255) NOT NULL DEFAULT '',
  industry VARCHAR(50) NOT NULL DEFAULT 'communication',
  goals TEXT,
  current_step ENUM('learn','practice','improve','impact') NOT NULL DEFAULT 'learn',
  turn ENUM('client','firm','clear') NOT NULL DEFAULT 'clear',
  turn_since TIMESTAMP NULL,
  consultant VARCHAR(255) NOT NULL DEFAULT 'د. عبدالهادي',
  status ENUM('active','paused','completed') NOT NULL DEFAULT 'active',
  monthly_fee_aed DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS journey_steps (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  client_id INT UNSIGNED NOT NULL,
  step_key ENUM('learn','practice','improve','impact') NOT NULL,
  completed_at TIMESTAMP NULL,
  deliverables_count SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uk_client_step (client_id, step_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS consulting_sessions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  client_id INT UNSIGNED NOT NULL,
  title_key VARCHAR(50) NOT NULL DEFAULT 'coachingSession',
  start_at DATETIME NOT NULL,
  duration_minutes SMALLINT UNSIGNED NOT NULL DEFAULT 60,
  consultant VARCHAR(255) NOT NULL DEFAULT 'د. عبدالهادي',
  meet_url VARCHAR(512) DEFAULT NULL,
  notes TEXT,
  status ENUM('scheduled','completed','cancelled') NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_client (client_id),
  INDEX idx_start (start_at),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS deliverables (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  client_id INT UNSIGNED NOT NULL,
  name_key VARCHAR(100) NOT NULL,
  kind ENUM('workbook','deck','calendar','reel','report') NOT NULL,
  file_url VARCHAR(512) DEFAULT NULL,
  size_kb INT UNSIGNED NOT NULL DEFAULT 0,
  step_key ENUM('learn','practice','improve','impact') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_client (client_id),
  INDEX idx_step (step_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
