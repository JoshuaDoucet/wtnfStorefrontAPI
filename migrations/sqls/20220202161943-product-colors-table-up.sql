CREATE TABLE product_colors (
     id SERIAL PRIMARY KEY,
     product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
     color_id BIGINT REFERENCES colors(id) ON DELETE CASCADE
);

INSERT INTO product_colors (product_id, color_id)
    VALUES ( (SELECT id FROM products WHERE name='Leather Bag Red'),
                (SELECT id FROM colors WHERE name='Red')),
           ( (SELECT id FROM products WHERE name='Silk Green/Blue Shirt'),
                (SELECT id FROM colors WHERE name='Blue')),
           ( (SELECT id FROM products WHERE name='Silk Green/Blue Shirt'),
                (SELECT id FROM colors WHERE name='Green'));
