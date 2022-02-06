CREATE TABLE images (
     id SERIAL PRIMARY KEY,
     name VARCHAR,
     path TEXT NOT NULL
);

INSERT INTO images (name, path) 
    VALUES ('Black Bag', 'public/images/products/blackbag.jpg'),
        ('Black Jacket', 'public/images/products/blackjacket.jpg'),
        ('Blue Robe', 'public/images/products/bluerobe.jpg'),
        ('Christmas Sweater', 'public/images/products/chriistmassweater.jpg'),
        ('Red Jacket', 'public/images/products/redjacket.jpg'),
        ('Red Pant', 'public/images/products/redpant.jpg');