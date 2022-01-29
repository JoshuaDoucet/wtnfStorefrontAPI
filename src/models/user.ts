// user.ts

// Model for a user object

import Client from '../database'

export type User = {
    id?: string,
    first_name: string,
    last_name: string,
    password_hash: string,
    phone?: number,
    email: string,
    location_id?: string
};

// Class to interact with the user database table
export class UserStore {
    // READ all user rows
    async index(): Promise<User[]> {
        try {
            const connect = await Client.connect();
            const sql = "SELECT * FROM users";
            const result = await connect.query(sql);
            connect.release();
            return result.rows;
        }catch(err){
            throw new Error(`Could not get users. ERR ${err}`);
        }
    };

    // READ a user row
    async show(id: string): Promise<User> {
        try {
            const connect = await Client.connect();
            const sql = "SELECT * FROM users WHERE id=($1)";
            const result = await connect.query(sql, [id]);
            connect.release();
            return result.rows[0]; //should be 1 user returned
        }catch(err){
            throw new Error(`Could not get user. ERR ${err}`);
        }
    };

    // CREATE a user row
    async create(user: User): Promise<User> {
        try {
            const sql = 'INSERT INTO users (first_name, last_name, password_hash, '
                + ' phone, email, location) '
                + 'VALUES($1, $2, $3, $4, $5, (SELECT id from locations WHERE id=$6)) RETURNING *';
            const connect = await Client.connect()
            const result = await connect.query(sql, 
                [
                    user.first_name, user.last_name, user.password_hash,
                    user.phone, user.email, user.location_id
                ]
            );
            const addedUser = result.rows[0]
            connect.release()
            return addedUser 
        } catch (error) {
            throw new Error(`Could not add use ${user.email}. Error: ${error}`)
        }
    }

    // DELETE a user row
    async delete(id: string): Promise<User> {
        try {
            const sql = 'DELETE FROM users WHERE id=($1) RETURNING *'
            const connect = await Client.connect()
            const result = await connect.query(sql, [id])
            const delUser = result.rows[0]
            connect.release()
            return delUser  
        } catch (err) {
            throw new Error(`Could not delete user ID ${id}. Error: ${err}`)
        }
    }

    // DELETE all rows
    async deleteAll(): Promise<User[]> {
        try {
            const sql = 'DELETE FROM users RETURNING *';
            const connect = await Client.connect()
            const result = await connect.query(sql)
            const delUsers = result.rows
            connect.release()
            return delUsers  
        } catch (err) {
            throw new Error(`Could not delete users. Error: ${err}`)
        }
    }
}