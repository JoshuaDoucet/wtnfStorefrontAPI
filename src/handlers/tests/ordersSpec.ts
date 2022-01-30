
// ordersSpec.ts

// Tests for testing orders endpoints

import supertest from 'supertest';
import app from'../../server'; // Where app is an Express server object
import {Order, OrderStore} from '../../models/order'
import {Product, ProductStore} from '../../models/product'

const request = supertest(app); 

const productStore = new ProductStore();
var shoes: Product = {
    name: "Sample Shoe Size 12 Mens Red",
    price: 110.95,
    cost: 11,
    boh: 1,
    for_sale: false,
    category: "shoes",
    owner: "JD",
    size_family: "MENS",
    size: "12",
    condition: "New",
    weight_grams: 540,
};

const orderStore = new OrderStore();
const testOrd: Order = {
    status: "active",
    user_id: "2"
}

let shoeId: string | undefined;
let shoeProd: Product;
let ordId: string | undefined
let order: Order;


// remove all orders from table before any test and add 1 order
beforeEach(async function(){
    await orderStore.deleteAll();
    order = await orderStore.create(testOrd);
    ordId = order.id;

    await productStore.deleteAll();
    shoeProd = await productStore.create(shoes);
    shoeId = shoeProd.id;
});

describe('Test orders endpoint responses', () => {    
     it('index: GET /orders', async(done) => {   
        const response = await request.get('/orders');
        expect(response.status).toBe(200);         
        done();     
    })

    it(`show: GET /orders/:id`, async(done) => {   
        const response = await request.get(`/orders/${ordId}`);
        // Check for valid status code
        expect(response.status).toBe(200);  
        expect(response.body.status).toEqual(order.status);  
        done();     
    })

    it(`create: POST /orders`, async(done) => {   
        const response = await request
            .post(`/orders`)
            .send(testOrd);
        expect(response.status).toBe(200);      
        expect(response.body.status).toEqual(order.status);   
        done();     
    })

    it(`destroy: DELETE /orders/:id`, async(done) => {   
        const response = await request
            .delete(`/orders/${ordId}`)
        expect(response.status).toBe(200);      
        expect(response.body.status).toEqual(order.status);   
        done();     
    })


    it('addProduct: POST /orders/:id/products', async(done) => {
        const response = await request
            .post(`/orders/${ordId}/products`)
            .send({product_id: shoeId,
                    product_quantity: 4})
        expect(response.status).toBe(200)
        expect(response.body.order_id).toEqual(ordId+'')
        expect(response.body.product_quantity).toEqual(4)
        done();
    })

    it(`getProducts: GET /orders/:id/products`, async(done) => {   
        const response = await request
            .get(`/orders/${ordId}/products`)
        expect(response.status).toBe(200);    
        done();     
    })
});