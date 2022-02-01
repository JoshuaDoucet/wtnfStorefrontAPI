import dotenv from 'dotenv';
import fs from 'fs';

// Generate a database.json file for the postgresql DB using dotenv variables
const createDbJsonConifg = () => {
  // get DB info from .env file
  dotenv.config();
  const {
    POSTGRES_HOST,
    POSTGRES_DB,
    POSTGRES_TEST_DB,
    POSTGRES_USER,
    POSTGRES_PASSWORD
  } = process.env;

  let dbConfigObj = {
    dev: {
      driver: 'pg',
      host: POSTGRES_HOST,
      database: POSTGRES_DB,
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD
    },
    test: {
      driver: 'pg',
      host: POSTGRES_HOST,
      database: POSTGRES_TEST_DB,
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD
    }
  };

  // convert the DB config object to a JSON string
  const dbConfigJSON = JSON.stringify(dbConfigObj);
  fs.writeFile('database.json', dbConfigJSON, err => {
    if (err) {
      console.log(err);
      throw err;
    } else {
      console.log('database.json config file created');
    }
  });
};

// Run function, create config file
createDbJsonConifg();
