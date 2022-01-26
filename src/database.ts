// database.ts
// Configures the database client to interact with postgres DB

import dotenv from 'dotenv'
import {Pool} from 'pg'

dotenv.config();

// get DB info from .env file
const {
    ENV,
    POSTGRES_HOST,
    POSTGRES_DB,
    POSTGRES_TEST_DB,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
} = process.env;

let client: Pool;

// create a connection to the test DB
if(ENV === 'test'){
    client = new Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_TEST_DB,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD
    });
}
// create a connection to the developmnent DB
else{
    client = new Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_DB,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD
    });
}

export default client;