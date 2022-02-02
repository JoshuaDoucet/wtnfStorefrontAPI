CREATE TABLE users (
     id SERIAL PRIMARY KEY, 
     first_name VARCHAR NOT NULL, 
     last_name VARCHAR NOT NULL, 
     password_hash VARCHAR NOT NULL,
     phone BIGINT, 
     email TEXT NOT NULL UNIQUE, 
     location_id BIGINT REFERENCES locations(id) ON DELETE CASCADE
);


-- users
    -- password - 'password'
    -- generated hash for password - '$2b$11$nxe9Tg6IDgFfw6LReU0cheHNxwu4J7jnDm.59eOKDVyZnOyaadLJ6'
    -- password - 'goodPass1'
    -- generated hash for goodPass1 - '$2b$11$yNHyZiHiQ/PF6jrmJ4LCMOrtm0OPTKNyHJxT9NKTxNkl/xnMcsrj6'

INSERT INTO users (first_name, last_name, email, phone, password_hash, location_id)
    VALUES ('Josh', 'Abrolling', 'josh@gmail.com' , 7195550001,
                '$2b$11$nxe9Tg6IDgFfw6LReU0cheHNxwu4J7jnDm.59eOKDVyZnOyaadLJ6',
                (SELECT id FROM locations WHERE name='Home')),
            ('Kenzie', 'Abrolling', 'kenzie@gmail.com', 7195550002,
                '$2b$11$yNHyZiHiQ/PF6jrmJ4LCMOrtm0OPTKNyHJxT9NKTxNkl/xnMcsrj6',
                (SELECT id FROM locations WHERE name='Groceries'));
