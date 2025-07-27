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
