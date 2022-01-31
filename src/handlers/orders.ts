// orders.ts

// handler for orders
import jwt from 'jsonwebtoken'
import express, { Request, Response } from 'express'
import { Order, OrderStore } from '../models/order'
import utilities from '../utilities/utilities';

const store = new OrderStore();

// /cart [GET]
const cart = async (_req: Request, res: Response) => {
    try{
        const token = (_req.headers.authorization)?.split(' ')[1];
        console.log(token)
        if(token){
            const payload = jwt.decode(token);
            console.log(payload)
            if(payload != null && typeof payload === 'object'){
                if('user' in payload){
                    var user = payload.user;
                    if('id' in user){
                        var userId = user.id
                        const cart = await store.cart(userId)
                        res.json(cart);
                    }else{
                        res.status(401)
                        res.json("Invalid data. Auth token needs user id. Cannot view cart. Attempt to sign in");        
                    }
                }else{
                    res.status(401)
                    res.json("Invalid data. Auth token needs user object. Cannot view cart. Attempt to sign in");    
                }
            }else{
                res.status(401)
                res.json("No payload info in auth token. Cannot view cart. Attempt to sign in");
            }              
        }else{
            res.status(401)
            res.json("No auth token provided. Cannot view cart. Please sign in");
        }
    }catch(err){
        res.status(503);
        res.json(`Cannot GET cart for user. ERR -- ${err}`);
    }
}

// /orders [GET]
const index = async (_req: Request, res: Response) => {
    try{
        const orders = await store.index()
        res.json(orders);
    }catch(err){
        res.status(503);
        res.json(`Cannot GET orders index. ERR -- ${err}`);
    }
}

// /orders/:id [GET] 
const show = async (req: Request, res: Response) => {
    try{
        const order = await store.show(req.params.id);
        if(order){
            res.json(order);
        }else{
            res.status(404);
            res.json(`Cannot GET order with id ${req.params.id}`)
        }
    }catch(err){
        res.status(503)
        res.json(`Cannot GET order with id ${req.params.id} ERR -- ${err}`)
    }
}

// /orders [POST]
const create = async (req: Request, res: Response) => {
    var orderName: string | undefined;
    try {
        // Pull name value for error handling
        orderName = req.body.name;
        const order: Order = {
            status: req.body.status,
            user_id: req.body.user_id
        };
        // create product
        const newOrder = await store.create(order);
        res.json(newOrder);
    } catch(error) {
        res.status(400);
        res.json(`Order for user ID ${req.body.user_id} not added. ERR -- ${error}`);
    }
}

// /orders/:id/products GET
const getProducts = async (_req: Request, res: Response) => {
    const orderId: string = _req.params.id
    try {
        const products = await store.getProducts(orderId)
        res.json(products)
    } catch(err) {
        res.status(400);
        res.json("Cannot get products for order. ERR -- " + err);
    }
} 

// /orders/:id/products POST
const addProduct = async (_req: Request, res: Response) => {
    const orderId: string = _req.params.id
    const productId: string = _req.body.product_id
    const quantity: number = _req.body.product_quantity
    try {
        const addedProduct = await store.addProduct(productId, orderId, quantity)
        res.json(addedProduct)
    } catch(err) {
        res.status(400);
        res.json("Cannot add product to order. ERR -- " + err);
    }
} 

// /orders/:id [DELETE]
const destroy = async (req: Request, res: Response) => {
    try{
        const delOrder = await store.delete(req.params.id);
        if(delOrder){
            res.json(delOrder);
        }else{
            res.status(404);
            res.json(`Cannot DELETE order with id ${req.params.id}`)
        }        
    }catch(err) {
        res.status(400);
        res.json(`Order id [${req.params.id}] not deleted. ERR -- ${err}`);
    }
}

// Routes to connect the Express application to products data
const orderRoutes = (app: express.Application) => {
  app.get('/cart', utilities.verifyAuthJWT, cart)
  app.get('/orders', utilities.verifyAuthJWT, index)
  app.get('/orders/:id', utilities.verifyAuthJWT, show)
  app.get('/orders/:id/products', utilities.verifyAuthJWT, getProducts)
  app.post('/orders', utilities.verifyAuthJWT, create)
  app.post('/orders/:id/products', utilities.verifyAuthJWT, addProduct)
  app.delete('/orders/:id', utilities.verifyAuthJWT, destroy)
}

export default orderRoutes;