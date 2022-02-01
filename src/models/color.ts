// color.ts

// Model for a color object

import Client from '../database';

export type Color = {
  id?: string;
  name: string;
  red?: number;
  green?: number;
  blue?: number;
  hex?: string;
};

// Class to interact with the colors database table
export class ColorStore {
  // READ all color rows
  async index(): Promise<Color[]> {
    try {
      const connect = await Client.connect();
      const sql = 'SELECT * FROM colors';
      const result = await connect.query(sql);
      connect.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get colors. ERR ${err}`);
    }
  }

  // READ a color row
  async show(id: string): Promise<Color> {
    try {
      const connect = await Client.connect();
      const sql = 'SELECT * FROM colors WHERE id=($1)';
      const result = await connect.query(sql, [id]);
      connect.release();
      return result.rows[0]; //should be 1 color returned
    } catch (err) {
      throw new Error(`Could not get color. ERR ${err}`);
    }
  }

  // CREATE a color row
  async create(color: Color): Promise<Color> {
    try {
      const sql =
        'INSERT INTO colors (name, red, green, blue, hex) VALUES($1, $2, $3, $4, $5) RETURNING *';
      const connect = await Client.connect();
      const result = await connect.query(sql, [
        color.name,
        color.red,
        color.green,
        color.blue,
        color.hex
      ]);
      const addedColor = result.rows[0];
      connect.release();
      return addedColor;
    } catch (error) {
      throw new Error(`Could not add color ${color.name}. Error: ${error}`);
    }
  }

  // DELETE a color row
  async delete(id: string): Promise<Color> {
    try {
      const sql = 'DELETE FROM colors WHERE id=($1) RETURNING *';
      const connect = await Client.connect();
      const result = await connect.query(sql, [id]);
      const delColor = result.rows[0];
      connect.release();
      return delColor;
    } catch (err) {
      throw new Error(`Could not delete color ID ${id}. Error: ${err}`);
    }
  }

  // DELETE all rows
  async deleteAll(): Promise<Color[]> {
    try {
      const sql = 'DELETE FROM colors RETURNING *';
      const connect = await Client.connect();
      const result = await connect.query(sql);
      const delColors = result.rows;
      connect.release();
      return delColors;
    } catch (err) {
      throw new Error(`Could not delete colors. Error: ${err}`);
    }
  }
}
