CREATE TABLE locations (
     id SERIAL PRIMARY KEY,
     street_addr_1 VARCHAR,
     street_addr_2 VARCHAR,
     city VARCHAR,
     state VARCHAR,
     zip INTEGER NOT NULL,
     country VARCHAR,
     lat NUMERIC,
     long NUMERIC,
     other_info TEXT
);

CREATE TABLE colors (
     id SERIAL PRIMARY KEY,
     name VARCHAR NOT NULL,
     red SMALLINT,
     green SMALLINT,
     blue SMALLINT, 
     hex VARCHAR(7)
);

CREATE TABLE users (
     id SERIAL PRIMARY KEY, 
     first_name VARCHAR NOT NULL, 
     last_name VARCHAR NOT NULL, 
     password_hash VARCHAR NOT NULL,
     phone BIGINT, 
     email TEXT, 
     location BIGINT REFERENCES locations(id)
);

CREATE TABLE orders (
      id SERIAL PRIMARY KEY,
      user_id BIGINT REFERENCES users(id),
      status VARCHAR(32) NOT NULL
);

CREATE TABLE products (
      id SERIAL PRIMARY KEY, 
      name VARCHAR NOT NULL, 
      price NUMERIC, 
      boh INTEGER,
      for_sale BOOLEAN,
      category VARCHAR,
      description TEXT, 
      measurments VARCHAR, 
      owner VARCHAR, 
      sku VARCHAR(100), 
      size_family VARCHAR(64),
      size VARCHAR(64), 
      --colors BIGINT REFERENCES product_colors(id), 
      branch VARCHAR(100),
      --materials BIGINT REFERENCES product_materials(id), 
      condition VARCHAR, 
      instructions TEXT,
      country_origin VARCHAR(100), 
      rn_num VARCHAR(20), 
      weight_grams REAL,
      location BIGINT REFERENCES locations(id)
);

CREATE TABLE materials (
     id SERIAL PRIMARY KEY,
     name VARCHAR NOT NULL
);

CREATE TABLE order_products (
     id SERIAL PRIMARY KEY,
     order_id BIGINT REFERENCES orders(id),
     product_id BIGINT REFERENCES products(id),
     product_quantity INTEGER NOT NULL
);

CREATE TABLE product_colors (
     id SERIAL PRIMARY KEY,
     product_id BIGINT REFERENCES products(id),
     color_id BIGINT REFERENCES colors(id)
);

CREATE TABLE product_materials (
     id SERIAL PRIMARY KEY,
     product_id BIGINT REFERENCES products(id),
     materials_id BIGINT REFERENCES materials(id)
);

ALTER TABLE products ADD CONSTRAINT colors FOREIGN KEY(id) REFERENCES product_materials(id);
ALTER TABLE products ADD CONSTRAINT materials FOREIGN KEY(id) REFERENCES product_colors(id);