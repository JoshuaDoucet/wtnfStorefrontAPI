// image.ts

// Model for a material object

import Client from '../database';

export type Image = {
  id?: string;
  name?: string;
  path: string;
};

// Class to interact with the images database table
export class ImageStore {
  // READ all image rows
  async index(): Promise<Image[]> {
    try {
      const connect = await Client.connect();
      const sql = 'SELECT * FROM images';
      const result = await connect.query(sql);
      connect.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get images. ERR ${err}`);
    }
  }

  // READ an image row
  async show(id: string): Promise<Image> {
    try {
      const connect = await Client.connect();
      const sql = 'SELECT * FROM images WHERE id=($1)';
      const result = await connect.query(sql, [id]);
      connect.release();
      return result.rows[0]; //should be 1 image returned
    } catch (err) {
      throw new Error(`Could not get image. ERR ${err}`);
    }
  }

  // CREATE an image row
  async create(image: Image): Promise<Image> {
    try {
      const sql = 'INSERT INTO images (name, path) VALUES($1, $2) RETURNING *';
      const connect = await Client.connect();
      const result = await connect.query(sql, [image.name, image.path]);
      const addedImg = result.rows[0];
      connect.release();
      return addedImg;
    } catch (error) {
      throw new Error(
        `Could not add image ${image.path}. Error: ${error}`
      );
    }
  }

  // DELETE an image row
  async delete(id: string): Promise<Image> {
    try {
      const sql = 'DELETE FROM images WHERE id=($1) RETURNING *';
      const connect = await Client.connect();
      const result = await connect.query(sql, [id]);
      const delImg = result.rows[0];
      connect.release();
      return delImg;
    } catch (err) {
      throw new Error(`Could not delete image ID ${id}. Error: ${err}`);
    }
  }

  // DELETE all image rows
  async deleteAll(): Promise<Image[]> {
    try {
      const sql = 'DELETE FROM images RETURNING *';
      const connect = await Client.connect();
      const result = await connect.query(sql);
      const delImgs = result.rows;
      connect.release();
      return delImgs;
    } catch (err) {
      throw new Error(`Could not delete images. Error: ${err}`);
    }
  }
}
