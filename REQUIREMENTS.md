# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- ✅ Index:   
  -  "/products" [GET]
- ✅ Show:   
  -  "/products/:id" [GET]
- ✅Create:  
  -  "/products" [POST][token required]
- ❌ [OPTIONAL] Top 5 most popular products: 
  - "/products/popular" [GET] 
- ❌ [OPTIONAL] Products by category (args: product category) 
  - "/products/category" [GET]
- ❌ [OPTIONAL] Update:  
  - "/products/:id" [PUT][token required]
- ✅ [OPTIONAL] Delete: 
  - "/products/:id" [DELETE][token required]

#### Users  
- ✅ Index: "/users" [GET][token required] 
- ✅ Show: "/users/:id"  [GET][token required] 
- ✅ Create "/users" [POST][token required] 
- ❌ [OPTIONAL] Update: "/users/:id" [PUT][token required]  
- ✅ [OPTIONAL] Delete: "/users/:id" [DELETE][token required] 

#### Orders
- ⚠️ Current Order by user (args: user id) 
    - ⚠️ "/cart" [GET][token required]
    - ✅ "/orders/:id/products" [GET][token required]
- ❌ [OPTIONAL] Completed Orders by user (args: user id) 
    - "/orders/complete/products" [GET][token required]
- ✅ [OPTIONAL] Add product to current order (args: user id, product_id, quantity) 
    - "/orders/:id/products" [POST][token required]
- ❌ [OPTIONAL] Remove product from current order (args: user id, product_id) 
    - "/orders/:id/products" [DELETE][token required] 

✅
## Data Shapes
✅
#### Product
- id [SERIAL PRIMARY KEY]
- name [VARCHAR NOT NULL]
- price [NUMERIC]
- [OPTIONAL] category [VARCHAR]
- [OPTIONAL] description [TEXT]
- [OPTIONAL] measurments [VARCHAR]
- [OPTIONAL] owner [VARCHAR]
- [OPTIONAL] sku [VARCHAR(100)]
- [OPTIONAL] size_family [VARCHAR(64)]
- [OPTIONAL] size [VARCHAR(64)]
- [OPTIONAL] colors (M:M) [BIGINT REFERENCES product_colors(id)]
- [OPTIONAL] brand [VARCHAR(100)]
- [OPTIONAL] materials (M:M) (BIGINT REFERENCES product_materials(id)]
- [OPTIONAL] condition [VARCHAR]
- [OPTIONAL] instructions [TEXT]
- [OPTIONAL] country_origin [VARCHAR(100)]
- [OPTIONAL] rn_num [VARCHAR(20)]
- [OPTIONAL] weight_grams [REAL]
- [OPTIONAL] location (1:M) [BIGINT REFERENCES locations(id)]

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
      colors BIGINT REFERENCES product_colors(id), 
      branch VARCHAR(100),
      materials BIGINT REFERENCES product_materials(id), 
      condition VARCHAR, instructions TEXT,
      country_origin VARCHAR(100), 
      rn_num VARCHAR(20), 
      weight_grams REAL,
      location BIGINT REFERENCES locations(id)
);

✅
#### User 
- id [SERIAL PRIMARY KEY] 
- firstName [VARCHAR] 
- lastName [VARCHAR]
- password_hash [VARCHAR]
- [OPTIONAL] phone [BIGINT]
- [OPTIONAL] email [TEXT]
- [OPTIONAL] location (1:M) [BIGINT REFERENCES locations(id)]

CREATE TABLE users (
     id SERIAL PRIMARY KEY, 
     first_name VARCHAR NOT NULL, 
     last_name VARCHAR NOT NULL, 
     password_hash VARCHAR NOT NULL,
     phone BIGINT, 
     email TEXT, 
     location BIGINT REFERENCES locations(id)
);

✅
#### Orders 
- id [SERIAL PRIMARY KEY] 
- user_id [BIGINT REFERENCES users(id)] 
- status (active or complete) [VARCHAR] 

CREATE TABLE orders (
      id SERIAL PRIMARY KEY,
      user_id BIGINT REFERENCES users(id),
      status VARCHAR(32) NOT NULL
);

✅ 
#### order_products 
- id [SERIAL PRIMARY KEY] 
- product_id [BIGINT REFERENCES products(id)] 
- order_id [BIGINT REFERENCES orders(id)] 
- product_quantity [INTEGER] 

CREATE TABLE order_products (
     id SERIAL PRIMARY KEY,
     order_id BIGINT REFERENCES orders(id),
     product_id BIGINT REFERENCES products(id),
     product_quantity INTEGER NOT NULL
);

✅ [OPTIONAL] 
#### location 
- id [SERIAL PRIMARY KEY] 
- street_addr_1 [VARCHAR] 
- street_addr_2 [VARCHAR] 
- city [VARCHAR] 
- state [VARCHAR] 
- zip [INTEGER] 
- country [VARCHAR] 
- lat [NUMERIC] 
- long [NUMERIC] 
- other_info [TEXT] 

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

✅ [OPTIONAL]  
#### colors  
- id [SERIAL PRIMARY KEY]  
- name [VARCHAR(64)] NOT NULL  
- red [SMALLINT]  
- green [SMALLINT] 
- blue [SMALLINT] 
- hex [VARCHAR(7)] 

CREATE TABLE colors (
     id SERIAL PRIMARY KEY,
     name VARCHAR NOT NULL,
     red SMALLINT,
     green SMALLINT,
     blue SMALLINT, 
     hex VARCHAR(7)
);

✅ [OPTIONAL]  
#### product_colors
- id [SERIAL PRIMARY KEY]  
- product_id [BIGINT REFERENCES products(id)]  
- color_id [BIGINT REFERENCES colors(id)]  

CREATE TABLE product_colors ( 
     id SERIAL PRIMARY KEY,
     product_id BIGINT REFERENCES products(id),
     color_id BIGINT REFERENCES colors(id)
);

✅ [OPTIONAL]
#### materials  
- id [SERIAL PRIMARY KEY]  
- name [VARCHAR(100)]  

CREATE TABLE materials (
     id SERIAL PRIMARY KEY,
     name VARCHAR NOT NULL
);

✅ [OPTIONAL] 
#### product_materials  
- id [SERIAL PRIMARY KEY]  
- product_id [BIGINT REFERENCES products(id)]  
- material_id [BIGINT REFERENCES materials(id)]  

CREATE TABLE product_materials (
     id SERIAL PRIMARY KEY,
     product_id BIGINT REFERENCES products(id),
     materials_id BIGINT REFERENCES materials(id)
);
