// location.ts

// Model for a location object

import Client from '../database';

export type Location = {
  id?: string;
  name: string;
  street_addr_1?: string;
  street_addr_2?: string;
  city?: string;
  state?: string;
  zip?: number;
  country?: string;
  lat?: number;
  long?: number;
  other_info?: string;
};

// Class to interact with the locations database table
export class LocationStore {
  // READ all location rows
  async index(): Promise<Location[]> {
    try {
      const connect = await Client.connect();
      const sql = 'SELECT * FROM locations';
      const result = await connect.query(sql);
      connect.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get locations. ERR ${err}`);
    }
  }

  // READ a location row
  async show(id: string): Promise<Location> {
    try {
      const connect = await Client.connect();
      const sql = 'SELECT * FROM locations WHERE id=($1)';
      const result = await connect.query(sql, [id]);
      connect.release();
      return result.rows[0]; //should be 1 location returned
    } catch (err) {
      throw new Error(`Could not get location. ERR ${err}`);
    }
  }

  // CREATE a location row
  async create(location: Location): Promise<Location> {
    try {
      const sql =
        'INSERT INTO locations (name, street_addr_1, street_addr_2,' +
        ' city, state, zip, country, lat, long, other_info) ' +
        'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *';
      const connect = await Client.connect();
      const result = await connect.query(sql, [
        location.name,
        location.street_addr_1,
        location.street_addr_2,
        location.city,
        location.state,
        location.zip,
        location.country,
        location.lat,
        location.long,
        location.other_info
      ]);
      const addedLocation = result.rows[0];
      connect.release();
      return addedLocation;
    } catch (error) {
      throw new Error(
        `Could not add location ${location.name}. Error: ${error}`
      );
    }
  }

  // DELETE a location row
  async delete(id: string): Promise<Location> {
    try {
      const sql = 'DELETE FROM locations WHERE id=($1) RETURNING *';
      const connect = await Client.connect();
      const result = await connect.query(sql, [id]);
      const delLocation = result.rows[0];
      connect.release();
      return delLocation;
    } catch (err) {
      throw new Error(`Could not delete location ID ${id}. Error: ${err}`);
    }
  }

  // DELETE all rows
  async deleteAll(): Promise<Location[]> {
    try {
      const sql = 'DELETE FROM locations RETURNING *';
      const connect = await Client.connect();
      const result = await connect.query(sql);
      const delLocations = result.rows;
      connect.release();
      return delLocations;
    } catch (err) {
      throw new Error(`Could not delete locations. Error: ${err}`);
    }
  }
}
