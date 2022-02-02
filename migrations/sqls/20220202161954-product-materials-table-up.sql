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
