CREATE TABLE product_images (
     id SERIAL PRIMARY KEY,
     product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
     image_id BIGINT REFERENCES images(id) ON DELETE CASCADE
);

--TODO
INSERT INTO product_images (product_id, image_id)
    VALUES ( (SELECT id FROM products WHERE name='Black Crossbody Purse'),
                (SELECT id FROM images WHERE name='Black Bag')),
           ( (SELECT id FROM products WHERE name='Women''s Medium (M) City Girl by Nancy Bolen Jacket and Vest Combination'),
                (SELECT id FROM images WHERE name='Black Jacket')),
           ( (SELECT id FROM products WHERE name='Vintage W 12P Teal Pleated P.C.F Petites by Hal Fernan Long Sleeved Dress'),
                (SELECT id FROM images WHERE name='Blue Robe')),
           ( (SELECT id FROM products WHERE name='WM Black Christmas Red White Holiday Wine Shirt unbranded Long Sleeve Soft Top'),
                (SELECT id FROM images WHERE name='Christmas Sweater')),
           ( (SELECT id FROM products WHERE name='Vintage Women''s Petite Red with Black Trim Sag Harbor Blazer'),
                (SELECT id FROM images WHERE name='Red Jacket')),
           ( (SELECT id FROM products WHERE name='Vintage Women''s Petite 12P Red Pants Sag Harbor Trousers with pockets!'),
                (SELECT id FROM images WHERE name='Red Pant'));
