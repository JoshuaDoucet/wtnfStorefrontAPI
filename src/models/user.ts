// user.ts

// Model for a user object

import Client from '../database';
// for password hashing
import bcrypt from 'bcrypt';

import { Order } from './order';

export type User = {
  id?: string;
  first_name: string;
  last_name: string;
  password?: string;
  password_hash?: string;
  phone?: number;
  email: string;
  location_id?: string;
};

const { BCRYPT_PEPPER, BCRYPT_SALT } = process.env;

// Class to interact with the user database table
export class UserStore {
  // READ all user rows
  async index(): Promise<User[]> {
    try {
      const connect = await Client.connect();
      const sql = 'SELECT * FROM users';
      const result = await connect.query(sql);
      connect.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get users. ERR ${err}`);
    }
  }

  // READ a user row
  async show(id: string): Promise<User> {
    try {
      const connect = await Client.connect();
      const sql = 'SELECT * FROM users WHERE id=($1)';
      const result = await connect.query(sql, [id]);
      connect.release();
      return result.rows[0]; //should be 1 user returned
    } catch (err) {
      throw new Error(`Could not get user. ERR ${err}`);
    }
  }

  // READ get all orders with given userId
  async getOrders(userId: string): Promise<Order[]> {
    try {
      const connect = await Client.connect();
      const sql = 'SELECT * FROM orders WHERE user_id=($1)';
      const result = await connect.query(sql, [userId]);
      connect.release();
      return result.rows; 
    } catch (err) {
      throw new Error(`Could not get orders for user. ERR ${err}`);
    }
  }

  // CREATE a user row
  async create(user: User): Promise<User> {
    try {
      let password_hash: string;
      //Hash password before storing
      if (user.password) {
        password_hash = bcrypt.hashSync(
          user.password + BCRYPT_PEPPER,
          parseInt(BCRYPT_SALT as string)
        );
      } else {
        throw new Error(
          `Could not add user ${user.email}. Error: password undefined`
        );
      }

      const sql =
        'INSERT INTO users (first_name, last_name, password_hash, ' +
        ' phone, email, location_id) ' +
        'VALUES($1, $2, $3, $4, $5, (SELECT id from locations WHERE id=$6)) RETURNING *';
      const connect = await Client.connect();
      const result = await connect.query(sql, [
        user.first_name,
        user.last_name,
        password_hash,
        user.phone,
        user.email,
        user.location_id
      ]);
      const addedUser = result.rows[0];
      connect.release();
      return addedUser;
    } catch (error) {
      throw new Error(`Could not add user ${user.email}. Error: ${error}`);
    }
  }

// UPDATE a user row, but not their password
async update(user: User): Promise<User> {
  try {
    const sql =
      'UPDATE users ' +
      'SET first_name = ($1), ' +
        'last_name = ($2), ' +
        'phone = ($3), ' +
        'email = ($4), ' +
        'location_id = (SELECT id FROM locations WHERE id=($5)) ' +
      'WHERE id = ($6) RETURNING *';

    const connect = await Client.connect();
    const result = await connect.query(sql, [
      user.first_name,
      user.last_name,
      user.phone,
      user.email,
      user.location_id,
      user.id
    ]);
    const updatedUser = result.rows[0];
    connect.release();
    return updatedUser;
  } catch (error) {
    throw new Error(`Could not update user ${user.email}. Error: ${error}`);
  }
}


  // DELETE a user row
  async delete(id: string): Promise<User> {
    try {
      const sql = 'DELETE FROM users WHERE id=($1) RETURNING *';
      const connect = await Client.connect();
      const result = await connect.query(sql, [id]);
      const delUser = result.rows[0];
      connect.release();
      return delUser;
    } catch (err) {
      throw new Error(`Could not delete user ID ${id}. Error: ${err}`);
    }
  }

  // DELETE all rows
  async deleteAll(): Promise<User[]> {
    try {
      const sql = 'DELETE FROM users RETURNING *';
      const connect = await Client.connect();
      const result = await connect.query(sql);
      const delUsers = result.rows;
      connect.release();
      return delUsers;
    } catch (err) {
      throw new Error(`Could not delete users. Error: ${err}`);
    }
  }

  //AUTHENTICATE a user
  async authenticate(email: string, password: string): Promise<User | null> {
    try {
      const sql = 'SELECT id, email, password_hash FROM users WHERE email=($1)';
      const conn = await Client.connect();
      const result = await conn.query(sql, [email]);
      conn.release();
      // of a user is found, fetch stored password hash
      if (result.rows.length) {
        const user = result.rows[0];
        // check if passwords match
        if (bcrypt.compareSync(password + BCRYPT_PEPPER, user.password_hash)) {
          // if match, user is authenticated
          return user;
        }
      }
    } catch (error) {
      throw new Error(`Could not authenticate user. Error: ${error}`);
    }

    //No user with matching credentials found, return no uswr
    return null;
  }
}
