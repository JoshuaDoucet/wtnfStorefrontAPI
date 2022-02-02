CREATE TABLE orders (
      id SERIAL PRIMARY KEY,
      user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
      status VARCHAR(32) NOT NULL
);

INSERT INTO orders (user_id, status)
    VALUES ( (SELECT id FROM users WHERE first_name='Josh'), 'active' ),
           ( (SELECT id FROM users WHERE first_name='Josh'), 'complete' ),
           ( (SELECT id FROM users WHERE first_name='Kenzie'), 'active' );
