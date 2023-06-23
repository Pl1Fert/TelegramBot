
create TABLE person(
    id INT NOT NULL UNIQUE,
    name VARCHAR(255)
);

create TABLE todo(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    content VARCHAR(255),
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES person (id)
);