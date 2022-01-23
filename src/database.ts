// database.ts
// Configures the database client to interact with postgres DB

import dotenv from 'dotenv'
import {Pool} from 'pg'

dotenv.config();

// get DB info from .env file
const {
    POSTGRES_HOST,
    POSTGRES_DB,
    POSTGRES_USER,
    POSTGRES_PASSWORD
} = process.env;

// create a connection to the production DB
const client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD
});

export default client;