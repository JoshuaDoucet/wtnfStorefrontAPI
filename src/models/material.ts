// material.ts

// Model for a material object

import Client from '../database';

export type Material = {
  id?: string;
  name: string;
};

// Class to interact with the materials database table
export class MaterialStore {
  // READ all material rows
  async index(): Promise<Material[]> {
    try {
      const connect = await Client.connect();
      const sql = 'SELECT * FROM materials';
      const result = await connect.query(sql);
      connect.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get materials. ERR ${err}`);
    }
  }

  // READ a material row
  async show(id: string): Promise<Material> {
    try {
      const connect = await Client.connect();
      const sql = 'SELECT * FROM materials WHERE id=($1)';
      const result = await connect.query(sql, [id]);
      connect.release();
      return result.rows[0]; //should be 1 color returned
    } catch (err) {
      throw new Error(`Could not get material. ERR ${err}`);
    }
  }

  // CREATE a material row
  async create(material: Material): Promise<Material> {
    try {
      const sql = 'INSERT INTO materials (name) VALUES($1) RETURNING *';
      const connect = await Client.connect();
      const result = await connect.query(sql, [material.name]);
      const addedMaterial = result.rows[0];
      connect.release();
      return addedMaterial;
    } catch (error) {
      throw new Error(
        `Could not add material ${material.name}. Error: ${error}`
      );
    }
  }

  // DELETE a material row
  async delete(id: string): Promise<Material> {
    try {
      const sql = 'DELETE FROM materials WHERE id=($1) RETURNING *';
      const connect = await Client.connect();
      const result = await connect.query(sql, [id]);
      const delMaterial = result.rows[0];
      connect.release();
      return delMaterial;
    } catch (err) {
      throw new Error(`Could not delete material ID ${id}. Error: ${err}`);
    }
  }

  // DELETE all material rows
  async deleteAll(): Promise<Material[]> {
    try {
      const sql = 'DELETE FROM materials RETURNING *';
      const connect = await Client.connect();
      const result = await connect.query(sql);
      const delMaterials = result.rows;
      connect.release();
      return delMaterials;
    } catch (err) {
      throw new Error(`Could not delete materials. Error: ${err}`);
    }
  }
}
