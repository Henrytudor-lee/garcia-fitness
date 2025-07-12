CREATE TABLE
  exercises (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    session_id BIGINT (20) NOT NULL,
    sequence INT (11) NOT NULL,
    reps INT (11) NOT NULL,
    weight DECIMAL(5, 2) NOT NULL,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    notes VARCHAR(255),
    exercise_id INT (20) NOT NULL,
    name VARCHAR(255) NOT NULL
  );

CREATE TABLE
  sessions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT (20) NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    is_done TINYINT (1) NOT NULL,
    status VARCHAR(255) NOT NULL,
    notes VARCHAR(255)
  );

CREATE TABLE
  exercises_library (
    id BIGINT (20) PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    image_name VARCHAR(255),
    video_name VARCHAR(50),
    video_file VARCHAR(255),
    equipment_id VARCHAR(50),
    body_part_id VARCHAR(50),
    target_muscles_id VARCHAR(100),
    synergist_muscles_id VARCHAR(100),
    exercise_type VARCHAR(20),
    is_favorite TINYINT (1) DEFAULT 0,
    num_exercises INT (11),
    is_custom TINYINT (1) DEFAULT 0
  );