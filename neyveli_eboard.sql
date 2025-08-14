CREATE TABLE notices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    title_ta TEXT,
    content TEXT NOT NULL,
    content_ta TEXT,
    category VARCHAR(50) NOT NULL,
    priority BOOLEAN DEFAULT FALSE,
    date_posted DATE NOT NULL,
    expiry_date DATE NOT NULL,
    link VARCHAR(255),
    file_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_archived BOOLEAN DEFAULT FALSE
);
