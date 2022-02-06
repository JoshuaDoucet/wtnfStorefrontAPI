// database.ts
// Configures the database client to interact with postgres DB

import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

// get DB info from .env file
const {
  ENV,
  POSTGRES_HOST,
  POSTGRES_PROD_HOST,
  POSTGRES_PROD_PORT,
  POSTGRES_DB,
  POSTGRES_TEST_DB,
  POSTGRES_PROD_DB,
  POSTGRES_USER,
  POSTGRES_PROD_USER,
  POSTGRES_PASSWORD,
  POSTGRES_PROD_PASSWORD
} = process.env;

let client: Pool;

// create a connection to the test DB
if (ENV === 'test') {
  client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_TEST_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD
  });
}
// create a connection to the developmnent DB
else if (ENV === 'dev'){
  client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD
  });
}
else if (ENV === 'prod'){
  client = new Pool({
    host: POSTGRES_PROD_HOST,
    port: parseInt((POSTGRES_PROD_PORT as unknown) as string),
    database: POSTGRES_PROD_DB,
    user: POSTGRES_PROD_USER,
    password: POSTGRES_PROD_PASSWORD
  });
}else{
  throw new Error('Invalid ENV to init DB')
}

export default client;
