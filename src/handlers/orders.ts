// orders.ts

// handler for orders
import jwt from 'jsonwebtoken';
import express, { Request, Response } from 'express';
import { Order, OrderStore } from '../models/order';
import utilities from '../utilities/utilities';

const store = new OrderStore();
// /cart [GET]
const cart = async (_req: Request, res: Response) => {
  try {
    const userId = utilities.getAuthUserId(_req);
    if (userId) {
      const cart = await store.cart(userId);
      res.json(cart);
    } else {
      res.status(401);
      res.json(
        'Invalid data. Auth token needs user id. Cannot view cart. Attempt to sign in'
      );
    }
  } catch (err) {
    res.status(503);
    res.json(`Cannot GET cart for user. ERR -- ${err}`);
  }
};

// /orders [GET]
const index = async (_req: Request, res: Response) => {
  try {
    const orders = await store.index();
    res.json(orders);
  } catch (err) {
    res.status(503);
    res.json(`Cannot GET orders index. ERR -- ${err}`);
  }
};

// /orders/:id [GET]
const show = async (req: Request, res: Response) => {
  try {
    const order = await store.show(req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404);
      res.json(`Cannot GET order with id ${req.params.id}`);
    }
  } catch (err) {
    res.status(503);
    res.json(`Cannot GET order with id ${req.params.id} ERR -- ${err}`);
  }
};

// /orders [POST]
const create = async (req: Request, res: Response) => {
  try {
    // get authorized user id to associate with order
    const userId = utilities.getAuthUserId(req);
    if (userId) {
      const order: Order = {
        status: 'active',
        user_id: userId
      };
      // create product
      const newOrder = await store.create(order);
      res.json(newOrder);
    } else {
      throw new Error('Cannot create order with an undefined user_id');
    }
  } catch (error) {
    res.status(400);
    res.json(
      `Order for user ID ${req.body.user_id} not added. ERR -- ${error}`
    );
  }
};

// /orders/:id [PUT]
const update  = async (_req: Request, res: Response) => {
  const orderId: string = _req.params.id;
  const status: string = _req.body.status;
  try {
    const updatedOrder = await store.update(orderId, status);
    res.json(updatedOrder);
  } catch (err) {
    res.status(400);
    res.json('Cannot update order status. ERR -- ' + err);
  }
};

// /orders/:id/products GET
const getProducts = async (_req: Request, res: Response) => {
  const orderId: string = _req.params.id;
  try {
    const products = await store.getProducts(orderId);
    res.json(products);
  } catch (err) {
    res.status(400);
    res.json('Cannot get products for order. ERR -- ' + err);
  }
};

// /orders/:id/products POST
const addProduct = async (_req: Request, res: Response) => {
  const orderId: string = _req.params.id;
  const productId: string = _req.body.product_id;
  const quantity: number = _req.body.product_quantity;
  try {
    const addedProduct = await store.addProduct(productId, orderId, quantity);
    res.json(addedProduct);
  } catch (err) {
    res.status(400);
    res.json('Cannot add product to order. ERR -- ' + err);
  }
};

// /orders/:id/products/:prodId DELETE
const removeProduct = async (_req: Request, res: Response) => {
  const orderId: string = _req.params.id;
  const productId: string = _req.params.prodId;
  try {
    const removedProduct = await store.removeProduct(productId, orderId);
    res.json(removedProduct);
  } catch (err) {
    res.status(400);
    res.json('Cannot remove product from order. ERR -- ' + err);
  }
};

// /orders/:id/products/:prodId [PUT]
const updateProdQuantity  = async (_req: Request, res: Response) => {
  const orderId: string = _req.params.id;
  const productId: string = _req.params.prodId;
  const quantity: number = _req.body.product_quantity;
  try {
    const updatedOrderProduct = await store.updateProdQuantity(productId, orderId, quantity);
    res.json(updatedOrderProduct);
  } catch (err) {
    res.status(400);
    res.json('Cannot update product in order. ERR -- ' + err);
  }
};

// /orders/:id [DELETE]
const destroy = async (req: Request, res: Response) => {
  try {
    const delOrder = await store.delete(req.params.id);
    if (delOrder) {
      res.json(delOrder);
    } else {
      res.status(404);
      res.json(`Cannot DELETE order with id ${req.params.id}`);
    }
  } catch (err) {
    res.status(400);
    res.json(`Order id [${req.params.id}] not deleted. ERR -- ${err}`);
  }
};

// Routes to connect the Express application to products data
const orderRoutes = (app: express.Application) => {
  app.get('/cart', utilities.verifyAuthJWT, cart);
  app.get('/orders', utilities.verifyAuthJWT, index);
  app.get('/orders/:id', utilities.verifyAuthJWT, show);
  app.get('/orders/:id/products', utilities.verifyAuthJWT, getProducts);
  
  app.put('/orders/:id', utilities.verifyAuthJWT, update);
  app.put('/orders/:id/products/:prodId', utilities.verifyAuthJWT, updateProdQuantity )
  
  app.post('/orders', utilities.verifyAuthJWT, create);
  app.post('/orders/:id/products', utilities.verifyAuthJWT, addProduct);
  
  app.delete('/orders/:id', utilities.verifyAuthJWT, destroy);
  app.delete('/orders/:id/products/:prodId', utilities.verifyAuthJWT, removeProduct )
};

export default orderRoutes;
