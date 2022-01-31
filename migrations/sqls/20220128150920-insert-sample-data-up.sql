
--Populate tables with sample data
--colors
INSERT INTO colors (name, red, green, blue, hex) 
    VALUES ('Red', 255, 0, 0, 'FF0000');
INSERT INTO colors (name, green, blue, hex) 
    VALUES ('Green', 255, 0, '00FF00');
INSERT INTO colors (name, red, green, blue) 
    VALUES ('Blue', 0, 0, 255);
INSERT INTO colors (name) 
    VALUES ('Purple');

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

--products
INSERT INTO products (name, cost, price, for_sale)
    VALUES ("Leather Bag Red", 11, 19, TRUE)
    VALUES ("Silk Green/Blue Shirt", 7, 29.99, TRUE)
    VALUES ("Baseball Cap", 1, 7, TRUE)
    VALUES ("Winter gloves", 4, 15, TRUE);

-- add colors to products
INSERT INTO product_colors (product_id, color_id)
    VALUES ( (SELECT id FROM products WHERE name='Leather Bag Red'),
                (SELECT id FROM colors WHERE name='Red')),
           ( (SELECT id FROM products WHERE name='Silk Green/Blue Shirt'),
                (SELECT id FROM colors WHERE name='Blue')),
           ( (SELECT id FROM products WHERE name='Silk Green/Blue Shirt'),
                (SELECT id FROM colors WHERE name='Green'));

-- add materials to products
INSERT INTO product_materials (product_id, materials_id)
    VALUES ( (SELECT id FROM products WHERE name='Leather Bag Red'),
                (SELECT id FROM materials WHERE name='Leather')),
    VALUES ( (SELECT id FROM products WHERE name='Silk Green/Blue Shirt'),
                (SELECT id FROM materials WHERE name='Silk')),

-- users
-- TODO before, get hashed passwords to insert

-- add locations to users

-- orders

-- add users to orders