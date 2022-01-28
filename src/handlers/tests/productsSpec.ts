
// productsSpec.ts

// Tests for testing products endpoints

import supertest from 'supertest';
import app from'../../server'; // Where app is an Express server object
import {Product, ProductStore} from '../../models/product'
import {Location, LocationStore} from '../../models/location'
import {Material, MaterialStore} from '../../models/material'
import objectNullValsToUndefined from '../../utilities/utilities'
import {Color, ColorStore} from '../../models/color';

const request = supertest(app); 

const productStore = new ProductStore();
var jacket: Product = {
    name: "Columbia Blue/Gray Winter Jacket, Mens, XL",
    price: 139.95,
    cost: 89,
    boh: 1,
    for_sale: false,
    category: "Jackets/Winter",
    description: "A lightly used winter coat. Great in cold",
    measurments: "Chest: 44 in, Waist: 32 in, Length: 33 in",
    owner: "JD",
    sku: "JD/M/TOP/0001",
    size_family: "MENS",
    size: "XL",
    brand: "Columbia",
    condition: "Used- Like New",
    instructions: "Machine wash cold. Tumble dry low",
    country_origin: "Thailand",
    rn_num: "101654",
    weight_grams: 978
};

const locStore = new LocationStore();
const loc: Location = {
    name: "TestLocation",
}

const colorStore = new ColorStore();
const redColor: Color = {
    name: "Red",
    red: 255,
    hex: "FF0000"
};

const materialStore = new MaterialStore();
const velvet: Material = {
    name: "Velvet"
}

let prodId: string | undefined;
let product: Product;
let location: Location;
let color: Color;
let material: Material;

// remove all products from table before any test and add 1 product
beforeEach(async function(){
    await productStore.deleteAll();
    product = await productStore.create(jacket);
    prodId = product.id;
});

describe('Test products endpoint responses', () => {    
     it('index: GET /products', async(done) => {   
        const response = await request.get('/products');
        expect(response.status).toBe(200);         
        done();     
    })

    it(`show: GET /products/:id`, async(done) => {   
        const response = await request.get(`/products/${prodId}`);
        // create a copy of response body to change null values to undefined 
        const bodyCopy = (objectNullValsToUndefined(response.body) as Product);
        // Check for valid status code
        expect(response.status).toBe(200);  
        // check 2 properties of product in the response body    
        expect(bodyCopy.name).toEqual(product.name);  
        expect(bodyCopy.for_sale).toEqual(product.for_sale);      
        done();     
    })

    it(`create: POST /products`, async(done) => {   
        const response = await request
            .post(`/products`)
            .send(jacket);
        expect(response.status).toBe(200);      
        expect(response.body.name).toEqual(product.name);   
        done();     
    })

    it(`destroy: DELETE /products/:id`, async(done) => {   
        const response = await request
            .delete(`/products/${prodId}`)
        expect(response.status).toBe(200);      
        expect(response.body.name).toEqual(product.name);   
        done();     
    })
});