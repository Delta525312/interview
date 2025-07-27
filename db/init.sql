CREATE TABLE url_shorten (
    id SERIAL PRIMARY KEY,
    original_url TEXT NOT NULL,
    short_key VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    clicks INTEGER NOT NULL DEFAULT 0,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

CREATE TABLE url_shorten_audit (
    id SERIAL PRIMARY KEY,
    url_id INTEGER REFERENCES url_shorten(id) ON DELETE CASCADE,
    action VARCHAR(10) NOT NULL,            -- เช่น "CREATE", "UPDATE", "DELETE"
    performed_by VARCHAR(255),              -- มาจาก token
    performed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY, 
    avatar_url VARCHAR(255) NULL,
    display_name VARCHAR(100) NULL,
    title VARCHAR(20) NULL,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50) NULL,
    last_name VARCHAR(50) NOT NULL,
    citizen_id CHAR(13) NULL CHECK (char_length(citizen_id) = 13),
    birth_date TIMESTAMP NULL,
    blood_type VARCHAR(3) NULL,
    gender VARCHAR(10) NULL,
    mobile_no VARCHAR(15) NULL,
    address VARCHAR(255) NULL,
    username VARCHAR(50) NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(50) NULL,
    department VARCHAR(50) NULL,
    created_at TIMESTAMP NULL,
    created_by VARCHAR(50) NULL,
    updated_at TIMESTAMP NULL,
    updated_by VARCHAR(50) NULL
);
