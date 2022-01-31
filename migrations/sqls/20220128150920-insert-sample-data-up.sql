
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
INSERT INTO materials (name) VALUES ('Silk');
INSERT INTO materials (name) VALUES ('Gold');

--locations
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

--products
INSERT INTO products (name, cost, price, for_sale)
    VALUES ('Leather Bag Red', 11, 19, TRUE),
            ('Silk Green/Blue Shirt', 7, 29.99, TRUE),
            ('Baseball Cap', 1, 7, TRUE),
            ('Winter gloves', 4, 15, TRUE);

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
           ( (SELECT id FROM products WHERE name='Silk Green/Blue Shirt'),
                (SELECT id FROM materials WHERE name='Silk'));

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

-- orders
INSERT INTO orders (user_id, status)
    VALUES ( (SELECT id FROM users WHERE first_name='Josh'), 'active' ),
           ( (SELECT id FROM users WHERE first_name='Josh'), 'complete' ),
           ( (SELECT id FROM users WHERE first_name='Kenzie'), 'active' );

-- products to orders
INSERT INTO order_products (product_id, order_id, product_quantity)
    VALUES ( (SELECT id FROM products WHERE name='Leather Bag Red'), 
             (SELECT id FROM orders WHERE id='1' ), 3 ),
           ( (SELECT id FROM products WHERE name='Silk Green/Blue Shirt'), 
             (SELECT id FROM orders WHERE id='1' ), 4 ),
           ( (SELECT id FROM products WHERE name='Baseball Cap'), 
             (SELECT id FROM orders WHERE id='2' ), 1 ),
           ( (SELECT id FROM products WHERE name='Winter gloves'), 
             (SELECT id FROM orders WHERE id='2' ), 7 ),
           ( (SELECT id FROM products WHERE name='Winter gloves'), 
             (SELECT id FROM orders WHERE id='3' ), 2 );