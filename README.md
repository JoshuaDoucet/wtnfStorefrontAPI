# Wandering Threads Nesting Feathers (WTNF) Storefront Backend API

## About 
This repo acts as the backend to interact with the WTNF database of products, locations, users, and orders.

## Getting Started
### Understand the application requirments
* Built and tested using
  - Node.js v15.13.2
  - npm v8.1.2
  - PostgreSQL 12 database server    
  - a git client
  - a linux command line interface
### Get the application code
* Clone this repo or download the package .zip
  - Find a usable directory on your system and run ```git init```
  - At the CLI run ```git clone https://github.com/JoshuaDoucet/wtnfStorefront.git main```
* Navigate to the main root project directory ```cd main```
* Install external modules using npm
  - At thhe CLI run ```npm install```
### Get the postgres database up and running
* Setup the database
  - Update the postgres database environment variables with valid DB credentials in the .env file
  - In a second terminal window login to the postgres user with sudo
    ```sudo su - postgres```
  - Open psql and create a dev DB and a test DB with a new user. Names with brackets around them should be deleted (as well as the brackets) and replaced with the corresponding .env variable values.<br>
    ```psql postgres``` <br>
    ```CREATE DATABASE <POSTGRES_DB>;``` <br>
    ```CREATE DATABASE <POSTGRES_TEST_DB>;``` <br>
    ```CREATE USER <POSTGRES_USER> WITH PASSWORD '<POSTGRES_PASSWORD>';``` <br>
    ```\c <POSTGRES_TEST_DB>;```<br>
    ```GRANT ALL PRIVILEGES ON DATABASE <POSTGRES_TEST_DB> TO <POSTGRES_USER>;```<br>
    ```\c <POSTGRES_DB>;``` <br>
    ```GRANT ALL PRIVILEGES ON DATABASE <POSTGRES_DB> TO <POSTGRES_USER>;```<br>
    ```\q```<br>
  - The postgres DB should be running on default port 5432
* Setup and apply the database migrations
  - Return to the first terminal window.
  - Create the database.json file need for migrations. This will also compile the src TS code to JS.
    ```npm run setupdb``` 
  - Run ```db:migrate up```
### Run the Express web server
* Run the web server
  - At the CLI run ```npm run watch``` or ```npm run start```
  - Unless configured differently, the web server should be running on localhost port 3000
### Visit the application endpoints
#### Login to the storefront. 
  This is required to access msot of the application data
 - [GET] /authenticate 
   - HTTP request body <br>
     ```json
     {
         "email": "josh@gmail.com",
         "password": "password"
     }
     ```
     NOTE: the above credentials will be valid if using the migrations provided in the repo. Otherwise a new user must be created before attempting to authenticate.<br>
     This endpoint will return a json web token (JWT) for authorization to the rest of the application. This jwt may need to be added manually to request headers. <b>In postman add the jwt to the "Authorization" tab. Select "Bearer token" as "Type" and paste the JWT into the "Token" field before making requests that need authorization.</b>

#### Interacting with the User models data
 - [GET] /users (AUTH TOKEN)
   - index - the response is a list of all user rows
 - [GET] /users/:id (AUTH TOKEN)
   - show - the response is a single user that matches the specified id
 - [GET] /users/:id/orders (AUTH TOKEN)
   - getOrders - the response is a list of orders that belong to the user with specified id  
 - [POST] /users 
   - create - adds new user to database. When the user is added, a password hash is stored rather than the original<br>
     HTTP request body
     ```json
      {
          "first_name": "Jane",
          "last_name": "Doe",
          "phone": 7195550101,
          "email": "janedoe@outlook.com",
          "password": "my dog was in a tree at the park near route 66",
          "location_id": "2"
      }
     ```
     NOTE: this endpoint returns a JWT with authentication information for this user. It should belong in the Authorization header for outgoing requests to the API.<br>
     Example HTTP response
     ```
     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjozLCJmaXJzdF9uYW1lIjoiSmFuZSIsImxhc3RfbmFtZSI6IkRvZSIsInBhc3N3b3JkX2hhc2giOiIkM
     mIkMTEkSkt4dGdNN3NObmlQbFVWb2tod0xIZWZhaklGTTlEd3dWTGtyOWJoZC5idlNHWmRFYlQ3TmUiLCJwaG9uZSI6IjcxOTU1NTAxMDEiLCJlbWFpbCI6ImphbmVkb2VAb3V0
     bG9vay5jb20iLCJsb2NhdGlvbl9pZCI6IjIifSwiaWF0IjoxNjQzNjc2MzA3LCJleHAiOjE2NDM2Nzk5MDd9.Eq5cdZWqhZfuHzXO5tc0IHCsOU7jzaKxmbrIwo1Tb5Y"
     ```       
     This example JWT is decoded below
     ```json
       {
      "header":{
        "alg":"HS256"
        "typ":"JWT"
      }
      "payload":{
        "user":{
          "id":3
          "first_name":"Jane"
          "last_name":"Doe"
          "password_hash":"$2b$11$JKxtgM7sNniPlUVokhwLHefajIFM9DwwVLkr9bhd.bvSGZdEbT7Ne"
          "phone":"7195550101"
          "email":"janedoe@outlook.com"
          "location_id":"2"
        }
          "iat":1643676307
          "exp":1643679907
        }
      }
     ```
  - [PUT] /users/:id (AUTH TOKEN)
   - update - updates a user in the database. All columns of user can be updated using this endpoint except their password_hash
     ```json
      {
          "first_name": "Jane",
          "last_name": "Doe",
          "phone": 7195550101,
          "email": "janedoe@outlook.com",
          "location_id": "2"
      }
     ```
 - [DELETE] /users/:id (AUTH TOKEN)
   - delete - deletes the user specified by id from the database. Response returns the user row that was deleted.
   


#### Interacting with the Order models data. 
 - [GET] /orders (AUTH TOKEN)
   - index - the response is a list of all order rows
 - [GET] /orders/:id (AUTH TOKEN)
   - show - the response is a single order that matches the specified id
 - [GET] /orders/:id/products (AUTH TOKEN)
   - getProducts - the response is an array of products that belong to an the order with specified id
 - [GET] /cart (AUTH TOKEN)
   - cart - the response is an array of products added to active orders that belong to the authorized user
 - [POST] /orders (AUTH TOKEN)
   - create - associates the authorized user with a new active order and adds the new order to database. Response returns the created order object <br>
 - [POST] /orders/:id/products (AUTH TOKEN)
   - addProduct - adds new product and desired quantity to order <br>
     HTTP request body
     ```json
      {
          "product_id": "2",
          "product_quantity": 33
      }
     ```
  - [PUT] /orders/:id (AUTH TOKEN)
    - update - updates the status of the order with specified id <br>
      HTTP request body
      ```json
       {
           "status": "complete"
       }
      ```
 - [PUT] /orders/:id/products/:prodId (AUTH TOKEN)
   - updateProdQuantity - updates product quantity in order <br>
     HTTP request body
     ```json
      {
          "product_quantity": 33
      }
     ```
 - [DELETE] /orders/:id/products/:prodId (AUTH TOKEN)
   - deleteProduct - deletes product from order <br>
 - [DELETE] /orders/:id (AUTH TOKEN)
   - delete - deletes the order specified by id from the database. Response returns the order row being deleted.


#### Interacting with the Product models data. 
 - [GET] /products
   - index - the response is a list of all product rows
 - [GET] /products/:id 
   - show - the response is a single product that matches the specified id
 - [GET] /products/:id/colors 
   - getColors - the response is an array of color ids that belong to an the product with specified id
 - [GET] /products/:id/materials 
   - getMaterials - the response is an array of material ids that belong to an the product with specified id
 - [POST] /products (AUTH TOKEN)
   - create - creates a product with the request body information and adds the product to the database. The response should be the created product.
     HTTP request body
     ```json
      {
          "name": "Blue Leather Womens Belt",
          "price": "17",
          "cost": "4",
          "boh": 1,
          "for_sale": true,
          "category": "accessories",
          "description": "Lightly used 36 inch x 2 inch blue leather belt with a silver buckle.",
          "measurments": "Length 36 in, Width 2 in",
          "owner": "Jane Doe",
          "sku": "JD/1/0003",
          "size_family": "womens",
          "size": "36",
          "brand": "Brittany Collection",
          "condition": "Used",
          "instructions": "hand wash with lemon juice",
          "country_origin": "MEXICO",
          "rn_num": null,
          "weight_grams": 150,
          "location_id": 1,
          "color_ids": [
              "2"
          ],
          "material_ids": [
              "1", "2"
          ]
      }
     ```
 - [POST] /products/:id/colors (AUTH TOKEN)
   - addColor - adds a color to the product of specified id. Returns a response of the row added to product_colors <br>
     HTTP request body
     ```json
      {
          "color_id": "3"
      }
     ```
 - [POST] /products/:id/materials (AUTH TOKEN)
   - addMaterial - adds a material to the product of specified id. Returns a response of the row added to product_materials <br>
     HTTP request body
     ```json
      {
          "materials_id": "3"
      }
     ```
 - [PUT] /products/:id (AUTH TOKEN)
   - update - updates a product with specified id using the request body JSON to update specified values. Returned the updated product from the db table. Only the columns in the request body will be updated in the product with specified id. <br>
     HTTP request body.<br>
     ```json
      {
        "price": 119.99,
        "category": "Shoes",
        "size": "13"
      }
     ```
 - [DELETE] /products/:id (AUTH TOKEN)
   - delete - deletes the product specified by id from the database. Response returns the product row being deleted.

#### Interacting with the Color models data
 - [GET] /colors
   - index - the response is a list of all color rows
 - [GET] /colors/:id
   - show - the response is a single color that matches the specified id
 - [POST] /colors (AUTH TOKEN)
   - create - adds new color to database<br>
     HTTP request body
     ```json
     {
         "name": "Purple",
         "red": "255",
         "blue": "255",
         "hex": "FF00FF"
     }
     ```
 - [DELETE] /colors/:id (AUTH TOKEN)
   - delete - deletes the color specified by id from the database. Response returns the color row that was deleted.

#### Interacting with the image models data. 
 - NOTE the database does not store image files. Just the name and path related to image files.
 - [GET] /images
   - index - the response is a list of all image rows
 - [GET] /image/:id 
   - show - the response is a single image that matches the specified id
 - [GET] /imagefile/:id 
   - show - the response is a single image file found at the path associated with the specified image id
 - [POST] /images (AUTH TOKEN)
   - create - adds new image to database. Response returns the created image- object <br>
     HTTP request body
     ```json
     {
         "name": "product_101",
         "path": "/public/images/product_101.jpg"
     }
     ```
 - [DELETE] /image/:id (AUTH TOKEN)
   - delete - deletes the image row specified by id from the database. Response returns the material row being deleted.

#### Interacting with the material models data. 
 - [GET] /materials
   - index - the response is a list of all material rows
 - [GET] /materials/:id 
   - show - the response is a single material that matches the specified id
 - [POST] /materials (AUTH TOKEN)
   - create - adds new material to database. Response returns the created material object <br>
     HTTP request body
     ```json
     {
         "name": "Carbon Fiber",
     }
     ```
 - [DELETE] /materials/:id (AUTH TOKEN)
   - delete - deletes the material specified by id from the database. Response returns the material row being deleted.

#### Interacting with the Location models data. 
 - [GET] /locations (AUTH TOKEN)
   - index - the response is a list of all location rows
 - [GET] /locations/:id (AUTH TOKEN)
   - show - the response is a single location that matches the specified id
 - [POST] /locations (AUTH TOKEN)
   - create - adds new location to database. Response returns the created location object<br>
     HTTP request body
     ```json
     {
         "name": "Supermarket",
         "street_addr_1": "7030 Plate St",
         "city": "Denver",
         "state": "CO",
         "zip": 80202,
         "country": "US",
         "lat": "17",
         "long": "20",
         "other_info": "Place where people find cool snacks"
      }
     ```
 - [DELETE] /locations/:id (AUTH TOKEN)
   - delete - deletes the location specified by id from the database. Response returns the location row being deleted.

## Jasmine tests
* To view the project's saved test result navigate to path
  - ```src/test/JASMINE_TEST_RESULTS.txt```
* To run the tests, in a terminal navigate to the project base directory and run
  - ```npm run test```
* To run and save the test results in the about txt file run
  - ```npm run test-save```

## Technologies Used
The WTNF Storefront application utilizes the following technologies:
- <b>TypeScript</b> for the main programming language
- <b>Postgres</b> for the database
- <b>Node/Express</b> for the application logic and web server
- <b>dotenv</b> from npm for managing environment variables
- <b>db-migrate</b> from npm for migrations
- <b>bcrypt</b> from npm for hashing passwords
- <b>jsonwebtoken</b> from npm for working with JWTs
- <b>jasmine</b> from npm for testing
