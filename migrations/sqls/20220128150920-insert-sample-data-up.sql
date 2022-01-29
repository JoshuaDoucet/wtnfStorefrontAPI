
--Populate tables with sample data
--colors
INSERT INTO colors (name, red, green, blue, hex) 
    VALUES ('Red', 255, 0, 0, 'FF0000');
INSERT INTO colors (name, green, blue, hex) 
    VALUES ('Green', 255, 0, '00FF00');
INSERT INTO colors (name, red, green, blue) 
    VALUES ('Blue', 0, 0, 255);
INSERT INTO colors (name)
    VALUES ("Purple")

--materials
INSERT INTO materials (name) VALUES ('Leather');
INSERT INTO materials (name) VALUES ('Cotton');
INSERT INTO materials (name) VALUES ('Silver');
INSERT INTO materials (name) VALUES ('Gold');

--locations
INSERT INTO locations (name, street_addr_1, street_addr_2, city, state, zip, 
    country, lat, long, other_info) VALUES ('Home', '7740 Falling Up Rd.',
     'APT 103', 'Colo Springs', 'CO', 80924, 'USA', 24.22544, 15.111555666, 
     'This is a place of relaxation');
INSERT INTO locations (name, street_addr_1, city, state, zip, 
    country, lat, long, other_info) VALUES ('Groceries', '7030 Baptist Road',
     'Monument', 'CO', 80921, 'Top Secret', 16, 20, 
     'Where people fight for the last item');