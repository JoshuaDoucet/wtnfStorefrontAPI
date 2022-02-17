CREATE TABLE order_products (
     id SERIAL PRIMARY KEY,
     order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
     product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
     product_quantity INTEGER NOT NULL
);

INSERT INTO order_products (product_id, order_id, product_quantity)
    VALUES ( (SELECT id FROM products WHERE name='Baseball Cap'), 
             (SELECT id FROM orders WHERE id='2' ), 1 ),
           ( (SELECT id FROM products WHERE name='Winter gloves'), 
             (SELECT id FROM orders WHERE id='2' ), 7 ),
           ( (SELECT id FROM products WHERE name='Winter gloves'), 
             (SELECT id FROM orders WHERE id='3' ), 2 );