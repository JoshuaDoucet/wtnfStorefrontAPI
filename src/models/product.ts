// product.ts

import Client from '../database'

// Model for products

// Product type
export type Product = {
    id?: string,
    name: string,
    price: number,
    cost?: number,
    boh?: number,
    for_sale: boolean,
    category?: string,
    description?: string,
    measurments?: string,
    owner?: string,
    sku?: string,
    size_family?: string,
    size?: string,
    brand?: string,
    condition?: string,
    instructions?: string,
    country_origin?: string,
    rn_num?: string, 
    weight_grams?: number,
    location_id?: string, // locationID
    color_ids?: string[], // colorID array
    material_ids?: string[] // materialsID array
}


// Class to interact with the products, product_materials, and product_colors tables
export class ProductStore {
    // READ all product rows
    async index(): Promise<Product[]> {
        try {
            const connect = await Client.connect();
            const sql = "SELECT * FROM products";
            const result = await connect.query(sql);
            connect.release();
            // add color_ids and materials_ids to Product objects
            var products: Product[] = result.rows;
            for(var i = 0; i < products.length; i++){
                if(products[i].id){
                    products[i].color_ids = await 
                        this.getColors((products[i].id as unknown) as string);
                    products[i].material_ids = await 
                        this.getMaterials((products[i].id as unknown) as string);
                }
            }

            return products;
        }catch(err){
            throw new Error(`Could not get products. ERR ${err}`);
        }
    };

    // READ a product row
    async show(id: string): Promise<Product> {
        try {
            const connect = await Client.connect();
            const sql = "SELECT * FROM products WHERE id=($1)";
            const result = await connect.query(sql, [id]);
            connect.release();
            var product = result.rows[0];
            
            product.color_ids = await this.getColors(id);
            product.material_ids = await this.getMaterials(id);

            return result.rows[0]; //should be 1 location returned
        }catch(err){
            throw new Error(`Could not get products. ERR ${err}`);
        }
    };

    // CREATE a product row
    async create(product: Product): Promise<Product> {
        try {
            const sql = 'INSERT INTO products (name, price, cost, boh, for_sale, ' 
                + 'category, description, measurments, owner, sku, size_family, '
                + 'size, brand, condition, instructions, country_origin, rn_num, '
                + 'weight_grams, location_id) '
                + 'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, '
                + '$11, $12, $13, $14, $15, $16, $17, $18, '
                + '(SELECT id from locations WHERE id=$19)) RETURNING *';
            const connect = await Client.connect()
            const result = await connect.query(sql, 
                [
                    product.name, product.price, product.cost, product.boh,
                    product.for_sale, product.category, product.description, 
                    product.measurments, product.owner, product.sku,
                    product.size_family, product.size, product.brand,
                    product.condition, product.instructions, product.country_origin,
                    product.rn_num, product.weight_grams, product.location_id
                ]
            );
            connect.release()

            let addedProduct = result.rows[0]
            const productId = addedProduct.id;
            
            // link color IDs to product
            if(product.color_ids){
                for(var i = 0; i < product.color_ids.length; i++){
                    await this.addColor(product.color_ids[i], productId);
                }
            }

            // link material IDs to product
            if(product.material_ids){
                for(var i = 0; i <= product.material_ids.length; i++){
                    await this.addMaterial(product.material_ids[i], productId);
                }
            }

            // ensure colors and materials were correctly related to product
            const color_ids = await this.getColors(productId);
            addedProduct.color_ids = color_ids;
            addedProduct.material_ids = await this.getMaterials(productId);
            return addedProduct 
        } catch (error) {
            throw new Error(`Could not add product ${product.name}. Error: ${error}`)
        }
    }

    // DELETE a product row
    async delete(id: string): Promise<Product> {
        try {
            //remove color and material links to product with id
            this.removeMaterials(id);
            this.removeColors(id);
            //remove product from products table
            const sql = 'DELETE FROM products WHERE id=($1) RETURNING *'
            const connect = await Client.connect()
            const result = await connect.query(sql, [id])
            const delProd = result.rows[0]
            connect.release()
            return delProd  
        } catch (err) {
            throw new Error(`Could not delete product ID ${id}. Error: ${err}`)
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
            const delProds = result3.rows
            connect.release()
            return delProds  
        } catch (err) {
            throw new Error(`Could not delete products. Error: ${err}`)
        }
    }

    // get product material IDs
    async getMaterials(productId: string):Promise<string[]> {
        const sql = 'SELECT materials.id FROM materials '
            + 'INNER JOIN product_materials ON product_materials.product_id=($1) '
            + 'AND product_materials.materials_id=materials.id';
        const conn = await Client.connect()
        const result = await conn
            .query(sql, [productId])
        const materialIds = result.rows
        const idArray = this.normalizeIdResults(materialIds);
        conn.release()
        return idArray
    }


    // addMaterial to product
    async addMaterial(materialId: string, productId: string): Promise<Product> {
        try {
            const sql = 'INSERT INTO product_materials (materials_id, product_id) '
                + 'VALUES( (SELECT id FROM materials WHERE id=$1), '
                + '( SELECT id FROM products WHERE id=$2)) RETURNING *';
            const conn = await Client.connect()
            const result = await conn
                .query(sql, [materialId, productId])
            const prodMat = result.rows[0]
            conn.release()
            return prodMat
        } catch (err) {
            throw new Error(`Could not add material ${materialId} to product ${productId} ERR -- ${err}`)
        }
    }    

    // removeMaterials from product, removes all materials from a product
    async removeMaterials(productId: string): Promise<Product[]> {
        try {
            const sql = 'DELETE FROM product_materials WHERE product_id=($1) RETURNING *'
            const connect = await Client.connect()
            const result = await connect.query(sql, [productId])
            const delMaterials = result.rows
            connect.release()
            return delMaterials  
        } catch (err) {
            throw new Error(`Could not delete materials from product ID ${productId}. Error: ${err}`)
        }
    }

    // get product color IDs
    async getColors(productId: string):Promise<string[]> {
        const sql = 'SELECT colors.id FROM colors '
            + 'INNER JOIN product_colors ON product_colors.product_id=($1) '
            + 'AND product_colors.color_id=colors.id';
        const conn = await Client.connect()
        const result = await conn
            .query(sql, [productId])
        const colorIds = result.rows
        const idArray = this.normalizeIdResults(colorIds);
        conn.release()
        return idArray
    }

    // remove the id value from a list of rows, and add them to a string[]
    normalizeIdResults = (rows: {id: number}[]): string[] => {
        let resultIds: string[] = [];
        for(let i = 0; i < rows.length; i++){
            let value = rows[i].id.toString();
            resultIds.push(value);
        }
        return resultIds;
    }

    // addColor to product
    async addColor(colorId: string, productId: string): Promise<Product> {
        try {
            const sql = 'INSERT INTO product_colors (color_id, product_id) '
                + 'VALUES( (SELECT id from colors WHERE id=$1), '
                + ' (SELECT id from products WHERE id=$2) ) RETURNING *';
            const conn = await Client.connect()
            const result = await conn
                .query(sql, [colorId, productId])
            const prodCol = result.rows[0]
            conn.release()
            return prodCol
        } catch (err) {
            throw new Error(`Could not add color ${colorId} to product ${productId} ERR -- ${err}`)
        }
    }    

    // removeColors from product, removes all colors from a product
    async removeColors(productId: string): Promise<Product[]> {
        try {
            const sql = 'DELETE FROM product_colors WHERE product_id=($1) RETURNING *'
            const connect = await Client.connect()
            const result = await connect.query(sql, [productId])
            const delColors = result.rows
            connect.release()
            return delColors  
        } catch (err) {
            throw new Error(`Could not delete colors from product ID ${productId}. Error: ${err}`)
        }
    }
}