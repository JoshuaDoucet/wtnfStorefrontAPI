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

INSERT INTO product_colors (product_id, color_id)
    VALUES ( (SELECT id FROM products WHERE name='Vintage Women''s Petite 12P Red Pants Sag Harbor Trousers with pockets!'),
                (SELECT id FROM colors WHERE name='Red')),
           ( (SELECT id FROM products WHERE name='WM Black Christmas Red White Holiday Wine Shirt unbranded Long Sleeve Soft Top'),
                (SELECT id FROM colors WHERE name='Red')),
           ( (SELECT id FROM products WHERE name='WM Black Christmas Red White Holiday Wine Shirt unbranded Long Sleeve Soft Top'),
                (SELECT id FROM colors WHERE name='Black')),
           ( (SELECT id FROM products WHERE name='Vintage Women''s Petite Red with Black Trim Sag Harbor Blazer'),
                (SELECT id FROM colors WHERE name='Red')),
           ( (SELECT id FROM products WHERE name='Vintage Women''s Petite Red with Black Trim Sag Harbor Blazer'),
                (SELECT id FROM colors WHERE name='Black')),
           ( (SELECT id FROM products WHERE name='Vintage W 12P Teal Pleated P.C.F Petites by Hal Fernan Long Sleeved Dress'),
                (SELECT id FROM colors WHERE name='Teal')),
           ( (SELECT id FROM products WHERE name='Vintage W 12P Teal Pleated P.C.F Petites by Hal Fernan Long Sleeved Dress'),
                (SELECT id FROM colors WHERE name='Green')),
           ( (SELECT id FROM products WHERE name='Vintage W 12P Teal Pleated P.C.F Petites by Hal Fernan Long Sleeved Dress'),
                (SELECT id FROM colors WHERE name='Blue')),
           ( (SELECT id FROM products WHERE name='Women''s Medium (M) City Girl by Nancy Bolen Jacket and Vest Combination'),
                (SELECT id FROM colors WHERE name='Black')),
           ( (SELECT id FROM products WHERE name='Women''s Medium (M) City Girl by Nancy Bolen Jacket and Vest Combination'),
                (SELECT id FROM colors WHERE name='Gold')),
           ( (SELECT id FROM products WHERE name='Black Crossbody Purse'),
                (SELECT id FROM colors WHERE name='Black')),
           ( (SELECT id FROM products WHERE name='Black Crossbody Purse'),
                (SELECT id FROM colors WHERE name='Gold'));


                
