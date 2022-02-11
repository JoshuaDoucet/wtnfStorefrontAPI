// productsSpec.ts

// Tests for testing products endpoints

import supertest from 'supertest';
import app from '../../server'; // Where app is an Express server object
import { Product, ProductStore } from '../../models/product';
import { Location, LocationStore } from '../../models/location';
import { Material, MaterialStore } from '../../models/material';
import utilities from '../../utilities/utilities';
import { Color, ColorStore } from '../../models/color';
import { User, UserStore } from '../../models/user';

const request = supertest(app);

describe('Test products endpoint responses', () => {
  const productStore = new ProductStore();

  let coat: Product = {
    name: 'Columbia Blue Winter coat, Mens, XL',
    price: 139.95,
    cost: 89,
    boh: 1,
    for_sale: false,
    category: 'coats/Winter',
    description: 'A lightly used winter coat. Great in cold',
    measurments: 'Chest: 44 in, Waist: 32 in, Length: 33 in',
    owner: 'JD',
    sku: 'JD/M/TOP/0001',
    size_family: 'MENS',
    size: 'XL',
    brand: 'Columbia',
    condition: 'Used- Like New',
    instructions: 'Machine wash cold. Tumble dry low',
    country_origin: 'Thailand',
    rn_num: '101654',
    weight_grams: 978,
    color_ids: ['1']
  };
  let prodId: string | undefined;
  let product: Product;

  const locStore = new LocationStore();
  const loc: Location = {
    name: 'TestLocation'
  };
  let location: Location;
  let locationId: string;

  const colorStore = new ColorStore();
  const redColor: Color = {
    name: 'Red',
    red: 255,
    hex: 'FF0000'
  };
  let color: Color;
  let colorId: string | undefined;

  const greenColor: Color = {
    name: 'Green'
  };
  let color2: Color;
  let color2Id: string | undefined;

  const materialStore = new MaterialStore();
  const velvet: Material = {
    name: 'Velvet'
  };
  let material: Material;
  let materialId: string | undefined;

  const silk: Material = {
    name: 'Silk'
  };
  let material2: Material;
  let material2Id: string | undefined;

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
    // delete all users, add 1, get JWT for auth
    userStore.deleteAll();
    user = await userStore.create(testUser);
    userId = user.id;

    const response = await request.post(`/authenticate`).send({
      email: testUser.email,
      password: testUser.password
    });
    userJWT = `Bearer ${response.body}`;

    //delete colors, add 2, update coat with id
    await colorStore.deleteAll();
    color = await colorStore.create(redColor);
    colorId = color.id;
    color2 = await colorStore.create(greenColor);
    color2Id = color2.id;
    colorId = color.id;
    coat.color_ids = [`${color.id}`];

    //delete materials, add 2, update coat with id
    material = await materialStore.create(velvet);
    materialId = material.id;
    material2 = await materialStore.create(silk);
    material2Id = material2.id;
    coat.material_ids = [`${material.id}`];
  });

  afterAll(async function() {
    colorStore.deleteAll();
    materialStore.deleteAll();
    userStore.deleteAll();
    productStore.deleteAll();
  });

  beforeEach(async function() {
    //delete products, add 1
    await productStore.deleteAll();
    product = await productStore.create(coat);
    prodId = product.id;
  });

  it('index: GET /products', async done => {
    const response = await request.get('/products');
    expect(response.status).toBe(200);
    done();
  });

  it(`show: GET /products/:id`, async done => {
    const response = await request.get(`/products/${prodId}`);
    // create a copy of response body to change null values to undefined
    const bodyCopy = utilities.objectNullValsToUndefined(
      response.body
    ) as Product;
    // Check for valid status code
    expect(response.status).toBe(200);
    // check 2 properties of product in the response body
    expect(bodyCopy.name).toEqual(product.name);
    expect(bodyCopy.for_sale).toEqual(product.for_sale);
    done();
  });

  it(`create: POST /products`, async done => {
    const response = await request
      .post(`/products`)
      .set('Authorization', userJWT)
      .send(coat);
    expect(response.status).toBe(200);
    expect(response.body.name).toEqual(product.name);
    done();
  });

  it(`update: PUT /products/:id`, async done => {
    const updateDetails = {
      size: 'XXL',
      owner: 'Jane Doe'
    };
    const response = await request
      .put(`/products/${prodId}`)
      .set('Authorization', userJWT)
      .send(updateDetails);
    expect(response.status).toBe(200);
    expect(response.body.size).toEqual(updateDetails.size);
    expect(response.body.name).toEqual(product.name);
    done();
  });

  it(`destroy: DELETE /products/:id`, async done => {
    const response = await request
      .delete(`/products/${prodId}`)
      .set('Authorization', userJWT);
    expect(response.status).toBe(200);
    expect(response.body.name).toEqual(product.name);
    done();
  });

  it('addColor: POST /products/:id/colors', async done => {
    const response = await request
      .post(`/products/${prodId}/colors`)
      .set('Authorization', userJWT)
      .send({ color_id: color2Id });
    expect(response.status).toBe(200);
    expect(response.body.color_id).toEqual(color2Id + '');
    expect(response.body.product_id).toEqual(prodId + '');
    done();
  });

  it('addMaterial: POST /products/:id/materials', async done => {
    const response = await request
      .post(`/products/${prodId}/materials`)
      .set('Authorization', userJWT)
      .send({ material_id: material2Id });
    expect(response.status).toBe(200);
    expect(response.body.materials_id).toEqual(material2Id + '');
    expect(response.body.product_id).toEqual(prodId + '');
    done();
  });

  it(`getColors: GET /products/:id/colors`, async done => {
    const response = await request.get(`/products/${prodId}/colors`);
    expect(response.status).toBe(200);
    if (coat.color_ids) {
      expect(response.body[0]).toEqual(coat.color_ids[0]);
    }
    done();
  });

  it(`getMaterials: GET /products/:id/materials`, async done => {
    const response = await request.get(`/products/${prodId}/materials`);
    expect(response.status).toBe(200);
    if (coat.material_ids) {
      expect(response.body[0] + '').toEqual(coat.material_ids[0]);
    }
    done();
  });
});
