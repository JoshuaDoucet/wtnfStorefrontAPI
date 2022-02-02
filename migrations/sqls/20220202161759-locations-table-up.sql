CREATE TABLE locations (
     id SERIAL PRIMARY KEY,
     name VARCHAR,
     street_addr_1 VARCHAR,
     street_addr_2 VARCHAR,
     city VARCHAR,
     state VARCHAR,
     zip INTEGER,
     country VARCHAR,
     lat NUMERIC,
     long NUMERIC,
     other_info TEXT
);

INSERT INTO locations (name, street_addr_1, street_addr_2, city, state, zip, 
    country, lat, long, other_info) 
    VALUES ('Home', '7740 Falling Up Rd.',
     'APT 103', 'Colo Springs', 'CO', 80924, 'USA', 24.22544, 15.111555666, 
     'This is a place of relaxation');
INSERT INTO locations (name, street_addr_1, city, state, zip, 
    country, lat, long, other_info) 
    VALUES ('Groceries', '7030 Baptist Road',
     'Monument', 'CO', 80921, 'US', 16, 20, 
     'Where people fight for the last item');