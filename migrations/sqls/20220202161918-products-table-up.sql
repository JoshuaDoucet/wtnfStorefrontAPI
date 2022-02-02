CREATE TABLE products (
      id SERIAL PRIMARY KEY, 
      name VARCHAR NOT NULL, 
      price NUMERIC NOT NULL,
      cost NUMERIC, 
      boh INTEGER,
      for_sale BOOLEAN NOT NULL,
      category VARCHAR,
      description TEXT, 
      measurments VARCHAR, 
      owner VARCHAR, 
      sku VARCHAR(100), 
      size_family VARCHAR(64),
      size VARCHAR(64), 
      brand VARCHAR(100),
      condition VARCHAR, 
      instructions TEXT,
      country_origin VARCHAR(100), 
      rn_num VARCHAR(20), 
      weight_grams REAL,
      location_id BIGINT REFERENCES locations(id)
);

INSERT INTO products (name, cost, price, for_sale)
    VALUES ('Leather Bag Red', 11, 19, TRUE),
            ('Silk Green/Blue Shirt', 7, 29.99, TRUE),
            ('Baseball Cap', 1, 7, TRUE),
            ('Winter gloves', 4, 15, TRUE);
