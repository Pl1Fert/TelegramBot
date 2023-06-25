
CREATE TABLE IF NOT EXISTS person (
    id INT NOT NULL UNIQUE,
    name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS todo (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    content VARCHAR(255),
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES person (id)
);