// ordersSpec.ts

// Tests for testing orders endpoints

import supertest from 'supertest';
import app from '../../server'; // Where app is an Express server object
import { Order, OrderStore } from '../../models/order';
import { Product, ProductStore } from '../../models/product';
import { User, UserStore } from '../../models/user';

const request = supertest(app);

describe('Test orders endpoint responses', () => {
  const productStore = new ProductStore();
  let shoes: Product = {
    name: 'Sample Shoe Size 12 Mens Red',
    price: 110.95,
    cost: 11,
    boh: 1,
    for_sale: false,
    category: 'shoes',
    owner: 'JD',
    size_family: 'MENS',
    size: '12',
    condition: 'New',
    weight_grams: 540
  };
  let prodId: string | undefined;
  let product: Product;

  const orderStore = new OrderStore();
  const testOrd: Order = {
    status: 'active',
    user_id: '2'
  };
  let ordId: string | undefined;
  let order: Order;

  const userStore = new UserStore();
  const testUser: User = {
    first_name: 'Everly',
    last_name: 'Penelope',
    password: 'sample432423dccc',
    phone: 5552221678,
    email: 'everly.penelope@live.com'
  };
  let userJWT: string;
  let userId: string | undefined;
  let user: User;

  beforeAll(async function() {
    //delete all product, add 1
    await productStore.deleteAll();
    product = await productStore.create(shoes);
    prodId = product.id;

    // delete all users, add 1, get JWT for auth
    userStore.deleteAll();
    user = await userStore.create(testUser);
    userId = user.id;

    const response = await request.post(`/authenticate`).send({
      email: testUser.email,
      password: testUser.password
    });
    userJWT = `Bearer ${response.body}`;
  });

  afterAll(async function() {
    await orderStore.deleteAll();
    await userStore.deleteAll();
    await productStore.deleteAll();
  });

  beforeEach(async function() {
    await orderStore.deleteAll();
    if (userId) testOrd.user_id = userId;
    order = await orderStore.create(testOrd);
    ordId = order.id;
  });

  it('index: GET /orders', async done => {
    const response = await request.get('/orders').set('Authorization', userJWT);
    expect(response.status).toBe(200);
    done();
  });

  it(`show: GET /orders/:id`, async done => {
    const response = await request
      .get(`/orders/${ordId}`)
      .set('Authorization', userJWT);
    // Check for valid status code
    expect(response.status).toBe(200);
    expect(response.body.status).toEqual(order.status);
    done();
  });

  it(`create: POST /orders`, async done => {
    const response = await request
      .post(`/orders`)
      .set('Authorization', userJWT)
      .send(testOrd);
    expect(response.status).toBe(200);
    expect(response.body.status).toEqual(order.status);
    done();
  });

  it(`destroy: DELETE /orders/:id`, async done => {
    const response = await request
      .delete(`/orders/${ordId}`)
      .set('Authorization', userJWT);
    expect(response.status).toBe(200);
    expect(response.body.status).toEqual(order.status);
    done();
  });

  it('addProduct: POST /orders/:id/products', async done => {
    const response = await request
      .post(`/orders/${ordId}/products`)
      .set('Authorization', userJWT)
      .send({ product_id: prodId, product_quantity: 4 });
    expect(response.status).toBe(200);
    expect(response.body.order_id).toEqual(ordId + '');
    expect(response.body.product_quantity).toEqual(4);
    done();
  });

  it(`getProducts: GET /orders/:id/products`, async done => {
    const response = await request
      .get(`/orders/${ordId}/products`)
      .set('Authorization', userJWT);
    expect(response.status).toBe(200);
    done();
  });

  it(`cart: GET /cart`, async done => {
    const response = await request.get(`/cart`).set('Authorization', userJWT);
    expect(response.status).toBe(200);
    done();
  });
});
