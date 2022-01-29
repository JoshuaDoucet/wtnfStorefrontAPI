CREATE TABLE locations (
     id SERIAL PRIMARY KEY,
     name VARCHAR,
     street_addr_1 VARCHAR,
     street_addr_2 VARCHAR,
     city VARCHAR,
     state VARCHAR,
     zip INTEGER,
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
     email TEXT NOT NULL, 
     location BIGINT REFERENCES locations(id) ON DELETE CASCADE
);

CREATE TABLE orders (
      id SERIAL PRIMARY KEY,
      user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
      status VARCHAR(32) NOT NULL
);

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

CREATE TABLE materials (
     id SERIAL PRIMARY KEY,
     name VARCHAR NOT NULL
);

CREATE TABLE order_products (
     id SERIAL PRIMARY KEY,
     order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
     product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
     product_quantity INTEGER NOT NULL
);

CREATE TABLE product_colors (
     id SERIAL PRIMARY KEY,
     product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
     color_id BIGINT REFERENCES colors(id) ON DELETE CASCADE
);

CREATE TABLE product_materials (
     id SERIAL PRIMARY KEY,
     product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
     materials_id BIGINT REFERENCES materials(id) ON DELETE CASCADE
);