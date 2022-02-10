CREATE TABLE materials (
     id SERIAL PRIMARY KEY,
     name VARCHAR NOT NULL
);

INSERT INTO materials (name) VALUES ('Leather'),
                                   ('Cotton'),
                                   ('Silk'),
                                   ('Gold'),
                                   ('Animal-Free Leather'),
                                   ('Wool');
