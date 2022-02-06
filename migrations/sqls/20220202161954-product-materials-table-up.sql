CREATE TABLE product_materials (
     id SERIAL PRIMARY KEY,
     product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
     materials_id BIGINT REFERENCES materials(id) ON DELETE CASCADE
);

INSERT INTO product_materials (product_id, materials_id)
    VALUES ( (SELECT id FROM products WHERE name='Leather Bag Red'),
                (SELECT id FROM materials WHERE name='Leather')),
           ( (SELECT id FROM products WHERE name='Silk Green/Blue Shirt'),
                (SELECT id FROM materials WHERE name='Silk'));

INSERT INTO product_materials (product_id, materials_id)
    VALUES ( (SELECT id FROM products WHERE name='Vintage Women''s Petite 12P Red Pants Sag Harbor Trousers with pockets!'),
                (SELECT id FROM materials WHERE name='Wool')),
           ( (SELECT id FROM products WHERE name='Vintage Women''s Petite Red with Black Trim Sag Harbor Blazer'),
                (SELECT id FROM materials WHERE name='Wool')),
           ( (SELECT id FROM products WHERE name='Black Crossbody Purse'),
                (SELECT id FROM materials WHERE name='Animal-Free Leather'));
