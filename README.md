# Wandering Threads Nesting Feathers (WTNF) Storefront Backend API

## About 
This repo acts as the backend to interact with the WTNF database of products, locations, users, and orders.

## Getting Started
### Understand the application requirments
* Built and tested using
  - Node.js v15.13.2
  - npm v8.1.2
  - a linux command line interface
### Get the application code
* Clone this repo
  - At the CLI run ```git clone https://github.com/JoshuaDoucet/wtnfStorefront.git main```
### Get the postgres database up and running
* Setup the database
  - TODO
### Run the Express web server
* Run the web server
  - At the CLI run ```npm run watch``` or ```npm run start```
### Visit the application endpoints
* Login to the storefront. 
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
     This endpoint will return a json web token (JWT) for authorization to the rest of the application. This jwt may need to be added manually to request headers. <b>In postman add the jwt to the "Authorization" tab and then paste the JWT into the "Token" field before making requests that need authorization.</b>
* Interacting with the Color models data
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
* Interacting with the Location models data. 
 - [GET] /locations (AUTH TOKEN)
   - index - the response is a list of all location rows
 - [GET] /locations/:id (AUTH TOKEN)
   - show - the response is a single location that matches the specified id
 - [POST] /locations (AUTH TOKEN)
   - create - adds new location to database <br>
     HTTP request body
     ```json
     {
         "id": 2,
         "name": "Groceries",
         "street_addr_1": "7030 Baptist Road",
         "street_addr_2": null,
         "city": "Monument",
         "state": "CO",
         "zip": 80921,
         "country": "US",
         "lat": "16",
         "long": "20",
         "other_info": "Where people fight for the last item"
      }
     ```
 - [DELETE] /locations/:id (AUTH TOKEN)
   - delete - deletes the location specified by id from the database. Response returns the location row being deleted.

## Jasmine tests
* To view the project's saved test result navigate to path
  - src/test/JASMINE_TEST_RESULTS.txt
* To run the tests, in a terminal navigate to the project base directory and run
  - ```npm run test```

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
