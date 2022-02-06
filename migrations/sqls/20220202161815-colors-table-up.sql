CREATE TABLE colors (
     id SERIAL PRIMARY KEY,
     name VARCHAR NOT NULL,
     red SMALLINT,
     green SMALLINT,
     blue SMALLINT, 
     hex VARCHAR(7)
);

INSERT INTO colors (name, red, green, blue, hex) 
    VALUES ('Red', 255, 0, 0, 'FF0000');
INSERT INTO colors (name, green, blue, hex) 
    VALUES ('Green', 255, 0, '00FF00');
INSERT INTO colors (name, red, green, blue) 
    VALUES ('Blue', 0, 0, 255);
INSERT INTO colors (name) 
    VALUES ('Purple'),
           ('Yellow'),
           ('Orange'),
           ('Teal'),
           ('Black'),
           ('White'),
           ('Gold'),
           ('Silver'),
           ('Brown'),
           ('Gray'),
           ('Pink');
