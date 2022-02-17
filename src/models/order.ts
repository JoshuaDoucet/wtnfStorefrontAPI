// order.ts

// Model for an Order object

import Client from '../database';

export type Order = {
  id?: string;
  user_id: string;
  status: string;
};

// Class to interact with the order database table
export class OrderStore {
  // READ all order rows
  async index(): Promise<Order[]> {
    try {
      const connect = await Client.connect();
      const sql = 'SELECT * FROM orders';
      const result = await connect.query(sql);
      connect.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get orders. ERR ${err}`);
    }
  }

  // READ an order row
  async show(id: string): Promise<Order> {
    try {
      const connect = await Client.connect();
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      const result = await connect.query(sql, [id]);
      connect.release();
      return result.rows[0]; //should be 1 order returned
    } catch (err) {
      throw new Error(`Could not get order. ERR ${err}`);
    }
  }

  // CREATE an order row
  async create(order: Order): Promise<Order> {
    try {
      const sql =
        'INSERT INTO orders (status, user_id) ' +
        'VALUES($1, (SELECT id from users WHERE id=$2)) RETURNING *';
      const connect = await Client.connect();
      const result = await connect.query(sql, [order.status, order.user_id]);
      const addedOrder = result.rows[0];
      connect.release();
      return addedOrder;
    } catch (error) {
      throw new Error(`Could not add order. Error: ${error}`);
    }
  }


  // update order status
  async update(
    orderId: string,
    status: string
  ): Promise<Order> {
    try {
      const sql =
        'UPDATE orders ' +
        `SET status = ($2) ` +
        'WHERE id = ($1)' +
        'RETURNING *';
      const conn = await Client.connect();
      const result = await conn.query(sql, 
        [ orderId, 
          status]);
      const updatedItem = result.rows[0];
      conn.release();
      return updatedItem;
    } catch (err) {
      throw new Error(
        `Could not update status for order ${orderId} ERR -- ${err}`
      );
    }
  }
  
  // DELETE an order row
  async delete(id: string): Promise<Order> {
    try {
      const sql = 'DELETE FROM orders WHERE id=($1) RETURNING *';
      const connect = await Client.connect();
      const result = await connect.query(sql, [id]);
      const delOrder = result.rows[0];
      connect.release();
      return delOrder;
    } catch (err) {
      throw new Error(`Could not delete order ID ${id}. Error: ${err}`);
    }
  }

  // DELETE all rows
  async deleteAll(): Promise<Order[]> {
    try {
      const sql = 'DELETE FROM orders RETURNING *';
      const connect = await Client.connect();
      const result = await connect.query(sql);
      const delOrders = result.rows;
      connect.release();
      return delOrders;
    } catch (err) {
      throw new Error(`Could not delete orders. Error: ${err}`);
    }
  }

  // get shopping cart for given user
  async cart(userId: string): Promise<object> {
    try {
      const sql =
        'SELECT order_products.id AS id, products.id AS product_id, products.name, products.price, products.boh, order_products.product_quantity, ' +
        'orders.user_id, orders.id AS ord_id, orders.status ' +
        'FROM products INNER JOIN order_products ' +
        'ON order_products.product_id = products.id ' +
        'INNER JOIN orders ON order_products.order_id = orders.id ' +
        "WHERE orders.status='active'" +
        'AND orders.user_id=(SELECT id FROM users WHERE id=($1))';
      const query = {
        text: sql,
        values: [userId]
      };
      const conn = await Client.connect();
      const result = await conn.query(query);
      //const result = await conn
      //    .query(sql, [userId])
      const productInCart = result.rows;
      conn.release();
      return productInCart;
    } catch (error) {
      throw new Error(`Could not get cart details for user with id: ${userId}`);
    }
  }

  // get order productIDs
  async getProducts(orderId: string): Promise<string[]> {
    try {
      const sql =
        'SELECT products.id, products.name, order_products.product_quantity FROM products ' +
        'INNER JOIN order_products ON order_products.order_id=($1) ' +
        'AND order_products.product_id = products.id';
      const conn = await Client.connect();
      const result = await conn.query(sql, [orderId]);
      const productsInOrder = result.rows;
      conn.release();
      return productsInOrder;
    } catch (error) {
      throw new Error(`Could not get products for order with id: ${orderId}`);
    }
  }


  // addProduct to order
  async addProduct(
    productId: string,
    orderId: string,
    quantity: number
  ): Promise<Order> {
    try {
      const sql =
        'INSERT INTO order_products (product_id, order_id, product_quantity) ' +
        'VALUES( (SELECT id FROM products WHERE id=$1), ' +
        ' (SELECT id FROM orders WHERE id=$2), $3 ) RETURNING *';
      const conn = await Client.connect();
      const result = await conn.query(sql, [productId, orderId, quantity]);
      const orderProducts = result.rows[0];
      conn.release();
      return orderProducts;
    } catch (err) {
      throw new Error(
        `Could not add product ${productId} to order ${orderId} ERR -- ${err}`
      );
    }
  }

    // updateProdQuantity in order
    async updateProdQuantity(
      productId: string,
      orderId: string,
      quantity: number
    ): Promise<object> {
      try {
        const sql =
          'UPDATE order_products ' +
          `SET product_quantity = ($3) ` +
          'WHERE order_id = (SELECT id FROM orders WHERE id = ($2))' +
          'AND product_id = (SELECT id FROM products WHERE id = ($1)) RETURNING *';
        const conn = await Client.connect();
        const result = await conn.query(sql, 
          [productId, 
            orderId, 
            quantity]);
        const updatedItem = result.rows[0];
        conn.release();
        return updatedItem;
      } catch (err) {
        throw new Error(
          `Could not update quantity for product ${productId} to order ${orderId} ERR -- ${err}`
        );
      }
    }

    // removeProducts from order, removes all products from an order
    async removeProduct(productId: string, orderId: string): Promise<object[]> {
      try {
        const sql = 'DELETE FROM order_products WHERE order_id=($1) AND product_id=($2) RETURNING *';
        const connect = await Client.connect();
        const result = await connect.query(sql, [orderId, productId]);
        const delProduct = result.rows[0];
        connect.release();
        return delProduct;
      } catch (err) {
        throw new Error(
          `Could not delete product with ID ${productId} from order ID ${orderId}. Error: ${err}`
        );
      }
    }


  // removeProducts from order, removes all products from an order
  async removeProducts(orderId: string): Promise<Order[]> {
    try {
      const sql = 'DELETE FROM order_products WHERE order_id=($1) RETURNING *';
      const connect = await Client.connect();
      const result = await connect.query(sql, [orderId]);
      const delProducts = result.rows;
      connect.release();
      return delProducts;
    } catch (err) {
      throw new Error(
        `Could not delete products from order ID ${orderId}. Error: ${err}`
      );
    }
  }
}
