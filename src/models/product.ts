// product.ts

import { QueryResult } from 'pg';
import Client from '../database';

// Model for products

// Product type
export type Product = {
  id?: string;
  name: string;
  price: number;
  cost?: number;
  boh?: number; // balance on hand
  for_sale: boolean;
  category?: string;
  description?: string;
  measurments?: string;
  owner?: string;
  sku?: string;
  size_family?: string;
  size?: string;
  brand?: string;
  condition?: string;
  instructions?: string;
  country_origin?: string;
  rn_num?: string;
  weight_grams?: number;
  location_id?: string; // locationID
  color_ids?: string[]; // colorID array
  material_ids?: string[]; // materialsID array
  image_ids?: string[]; // imageID array
};

// Product type for updating
// Similar to Product but with optional fields for updating Product row
// id is required
export type ProductUpdate = {
  id: string;
  name?: string;
  price?: number;
  cost?: number;
  boh?: number;
  for_sale?: boolean;
  category?: string;
  description?: string;
  measurments?: string;
  owner?: string;
  sku?: string;
  size_family?: string;
  size?: string;
  brand?: string;
  condition?: string;
  instructions?: string;
  country_origin?: string;
  rn_num?: string;
  weight_grams?: number;
  location_id?: string;
};

// Class to interact with the products, product_materials, and product_colors tables
export class ProductStore {
  // READ all product rows
  async index(): Promise<Product[]> {
    try {
      const connect = await Client.connect();
      const sql = 'SELECT * FROM products';
      const result = await connect.query(sql);
      connect.release();
      // add color_ids and materials_ids to Product objects
      let products: Product[] = result.rows;
      for (let i = 0; i < products.length; i++) {
        if (products[i].id) {
          products[i].color_ids = await this.getColors(
            (products[i].id as unknown) as string
          );
          products[i].material_ids = await this.getMaterials(
            (products[i].id as unknown) as string
          );
          products[i].image_ids = await this.getImages(
            (products[i].id as unknown) as string
          );
        }
      }

      return products;
    } catch (err) {
      throw new Error(`Could not get products. ERR ${err}`);
    }
  }

  // READ a product row
  async show(id: string): Promise<Product> {
    try {
      const connect = await Client.connect();
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const result = await connect.query(sql, [id]);
      connect.release();
      let product = result.rows[0];

      product.color_ids = await this.getColors(id);
      product.material_ids = await this.getMaterials(id);
      product.image_ids = await this.getImages(id);

      return result.rows[0]; //should be 1 location returned
    } catch (err) {
      throw new Error(`Could not get products. ERR ${err}`);
    }
  }

  // CREATE a product row
  async create(product: Product): Promise<Product> {
    try {
      const sql =
        'INSERT INTO products (name, price, cost, boh, for_sale, ' +
        'category, description, measurments, owner, sku, size_family, ' +
        'size, brand, condition, instructions, country_origin, rn_num, ' +
        'weight_grams, location_id) ' +
        'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, ' +
        '$11, $12, $13, $14, $15, $16, $17, $18, ' +
        '(SELECT id from locations WHERE id=$19)) RETURNING *';
      const connect = await Client.connect();
      const result = await connect.query(sql, [
        product.name,
        product.price,
        product.cost,
        product.boh,
        product.for_sale,
        product.category,
        product.description,
        product.measurments,
        product.owner,
        product.sku,
        product.size_family,
        product.size,
        product.brand,
        product.condition,
        product.instructions,
        product.country_origin,
        product.rn_num,
        product.weight_grams,
        product.location_id
      ]);
      connect.release();

      let addedProduct = result.rows[0];
      const productId = addedProduct.id;

      // link color IDs to product
      if (product.color_ids) {
        for (let i = 0; i < product.color_ids.length; i++) {
          await this.addColor(product.color_ids[i], productId);
        }
      }

      // link material IDs to product
      if (product.material_ids) {
        for (let i = 0; i <= product.material_ids.length; i++) {
          await this.addMaterial(product.material_ids[i], productId);
        }
      }

      // link image IDs to product
      if (product.image_ids) {
        for (let i = 0; i <= product.image_ids.length; i++) {
          await this.addImage(product.image_ids[i], productId);
        }
      }

      // ensure colors, materials, images were correctly related to product
      addedProduct.color_ids = await this.getColors(productId);
      addedProduct.material_ids = await this.getMaterials(productId);
      addedProduct.image_ids = await this.getImages(productId);

      return addedProduct;
    } catch (error) {
      throw new Error(`Could not add product ${product.name}. Error: ${error}`);
    }
  }

  // UPDATE a product row
  async update(product: ProductUpdate): Promise<Product> {
    try {
      const connect = await Client.connect();
      // update values provided in product
      let key: keyof typeof product;
      for (key in product) {
        if (product[key] != undefined) {
          const sql =
            'UPDATE products ' +
            `SET ${key} = ($1) ` +
            'WHERE id = ($2) RETURNING *';
          const query = {
            text: sql,
            values: [product[key], product.id]
          };
          await connect.query(query);
        }
      }
      connect.release();
      if (product.id) {
        const result = this.show(product.id);
        return result;
      } else {
        throw new Error('product.id is undefined.');
      }
    } catch (error) {
      throw new Error(
        `Could not update product ${product.id}. Error: ${error}`
      );
    }
  }

  // DELETE a product row
  async delete(id: string): Promise<Product> {
    try {
      //remove color, material, image links to product with id
      this.removeMaterials(id);
      this.removeColors(id);
      this.removeImages(id);
      //remove product from products table
      const sql = 'DELETE FROM products WHERE id=($1) RETURNING *';
      const connect = await Client.connect();
      const result = await connect.query(sql, [id]);
      const delProd = result.rows[0];
      connect.release();
      return delProd;
    } catch (err) {
      throw new Error(`Could not delete product ID ${id}. Error: ${err}`);
    }
  }

  // DELETE all rows
  async deleteAll(): Promise<Product[]> {
    try {
      const sql1 = 'DELETE FROM product_materials RETURNING *';
      const sql2 = 'DELETE FROM product_colors RETURNING *';
      const sql3 = 'DELETE FROM products RETURNING *';
      const connect = await Client.connect();
      const result1 = await connect.query(sql1);
      const result2 = await connect.query(sql1);
      const result3 = await connect.query(sql3);
      const delProds = result3.rows;
      connect.release();
      return delProds;
    } catch (err) {
      throw new Error(`Could not delete products. Error: ${err}`);
    }
  }

  // get product image IDs
  async getImages(productId: string): Promise<string[]> {
    try {
      const sql =
        'SELECT images.id FROM images ' +
        'INNER JOIN product_images ON product_images.product_id=($1) ' +
        'AND product_images.image_id=images.id';
      const conn = await Client.connect();
      const result = await conn.query(sql, [productId]);
      const imageIds = result.rows;
      const idArray = this.normalizeIdResults(imageIds);
      conn.release();
      return idArray;
    } catch (error) {
      throw new Error(`Could not get product images. Error: ${error}`);
    }
  }

  // addImage to product
  async addImage(imageId: string, productId: string): Promise<Product> {
    try {
      const sql =
        'INSERT INTO product_images (image_id, product_id) ' +
        'VALUES( (SELECT id FROM images WHERE id=$1), ' +
        '( SELECT id FROM products WHERE id=$2)) RETURNING *';
      const conn = await Client.connect();
      const result = await conn.query(sql, [imageId, productId]);
      const prodImg = result.rows[0];
      conn.release();
      return prodImg;
    } catch (err) {
      throw new Error(
        `Could not add image ${imageId} to product ${productId} ERR -- ${err}`
      );
    }
  }

  // removeMaterials from product, removes all materials from a product
  async removeImages(productId: string): Promise<Product[]> {
    try {
      const sql =
        'DELETE FROM product_images WHERE product_id=($1) RETURNING *';
      const connect = await Client.connect();
      const result = await connect.query(sql, [productId]);
      const delImgs = result.rows;
      connect.release();
      return delImgs;
    } catch (err) {
      throw new Error(
        `Could not delete images from product ID ${productId}. Error: ${err}`
      );
    }
  }  

    // get product image IDs
    async getMaterials(productId: string): Promise<string[]> {
      try {
        const sql =
          'SELECT materials.id FROM materials ' +
          'INNER JOIN product_materials ON product_materials.product_id=($1) ' +
          'AND product_materials.materials_id=materials.id';
        const conn = await Client.connect();
        const result = await conn.query(sql, [productId]);
        const colorIds = result.rows;
        const idArray = this.normalizeIdResults(colorIds);
        conn.release();
        return idArray;
      } catch (error) {
        throw new Error(`Could not get product matterial. Error: ${error}`);
      }
    }
  

  // addMaterial to product
  async addMaterial(materialId: string, productId: string): Promise<Product> {
    try {
      const sql =
        'INSERT INTO product_materials (materials_id, product_id) ' +
        'VALUES( (SELECT id FROM materials WHERE id=$1), ' +
        '( SELECT id FROM products WHERE id=$2)) RETURNING *';
      const conn = await Client.connect();
      const result = await conn.query(sql, [materialId, productId]);
      const prodMat = result.rows[0];
      conn.release();
      return prodMat;
    } catch (err) {
      throw new Error(
        `Could not add material ${materialId} to product ${productId} ERR -- ${err}`
      );
    }
  }

  // removeMaterials from product, removes all materials from a product
  async removeMaterials(productId: string): Promise<Product[]> {
    try {
      const sql =
        'DELETE FROM product_materials WHERE product_id=($1) RETURNING *';
      const connect = await Client.connect();
      const result = await connect.query(sql, [productId]);
      const delMaterials = result.rows;
      connect.release();
      return delMaterials;
    } catch (err) {
      throw new Error(
        `Could not delete materials from product ID ${productId}. Error: ${err}`
      );
    }
  }

  // get product color IDs
  async getColors(productId: string): Promise<string[]> {
    try {
      const sql =
        'SELECT colors.id FROM colors ' +
        'INNER JOIN product_colors ON product_colors.product_id=($1) ' +
        'AND product_colors.color_id=colors.id';
      const conn = await Client.connect();
      const result = await conn.query(sql, [productId]);
      const colorIds = result.rows;
      const idArray = this.normalizeIdResults(colorIds);
      conn.release();
      return idArray;
    } catch (error) {
      throw new Error(`Could not get product matterial. Error: ${error}`);
    }
  }

  // addColor to product
  async addColor(colorId: string, productId: string): Promise<Product> {
    try {
      const sql =
        'INSERT INTO product_colors (color_id, product_id) ' +
        'VALUES( (SELECT id from colors WHERE id=$1), ' +
        ' (SELECT id from products WHERE id=$2) ) RETURNING *';
      const conn = await Client.connect();
      const result = await conn.query(sql, [colorId, productId]);
      const prodCol = result.rows[0];
      conn.release();
      return prodCol;
    } catch (err) {
      throw new Error(
        `Could not add color ${colorId} to product ${productId} ERR -- ${err}`
      );
    }
  }

  // removeColors from product, removes all colors from a product
  async removeColors(productId: string): Promise<Product[]> {
    try {
      const sql =
        'DELETE FROM product_colors WHERE product_id=($1) RETURNING *';
      const connect = await Client.connect();
      const result = await connect.query(sql, [productId]);
      const delColors = result.rows;
      connect.release();
      return delColors;
    } catch (err) {
      throw new Error(
        `Could not delete colors from product ID ${productId}. Error: ${err}`
      );
    }
  }

  // remove the id value from a list of rows, and add them to a string[]
  normalizeIdResults = (rows: { id: number }[]): string[] => {
    let resultIds: string[] = [];
    for (let i = 0; i < rows.length; i++) {
      let value = rows[i].id.toString();
      resultIds.push(value);
    }
    return resultIds;
  };
}

