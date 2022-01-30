
// productsSpec.ts

// Tests for testing products endpoints

import supertest from 'supertest';
import app from'../../server'; // Where app is an Express server object
import {Product, ProductStore} from '../../models/product'
import {Location, LocationStore} from '../../models/location'
import {Material, MaterialStore} from '../../models/material'
import utilities from '../../utilities/utilities'
import {Color, ColorStore} from '../../models/color';

const request = supertest(app); 

const productStore = new ProductStore();
var coat: Product = {
    name: "Columbia Blue Winter coat, Mens, XL",
    price: 139.95,
    cost: 89,
    boh: 1,
    for_sale: false,
    category: "coats/Winter",
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
    weight_grams: 978,
    color_ids: ["1"]
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
let redColId: string | undefined
let redColor2: Color;
let velvetMat: Material;
let velMatId: string | undefined;

// remove all products from table before any test and add 1 product
beforeEach(async function(){
    redColor2 = await colorStore.create(redColor);
    redColId = redColor2.id;
    coat.color_ids = [`${redColId}`]

    velvetMat = await materialStore.create(velvet);
    velMatId = velvetMat.id;

    await productStore.deleteAll();
    product = await productStore.create(coat);
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
        const bodyCopy = (utilities.objectNullValsToUndefined(response.body) as Product);
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
            .send(coat);
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

    /*
  app.post('/products/:id/colors', addColor)
  app.post('/products/:id/materials', addMaterial)
    */
    it('addColor: POST /products/:id/colors', async(done) => {
        const response = await request
            .post(`/products/${prodId}/colors`)
            .send({color_id: redColId})
        expect(response.status).toBe(200)
        expect(response.body.color_id).toEqual(redColId+'')
        expect(response.body.product_id).toEqual(prodId+'')
        done();
    })
    
    it('addMaterial: POST /products/:id/materials', async(done) => {
        const response = await request
            .post(`/products/${prodId}/materials`)
            .send({material_id: velMatId})
        expect(response.status).toBe(200)
        expect(response.body.materials_id).toEqual(velMatId+'')
        expect(response.body.product_id).toEqual(prodId+'')
        done();
    })

    it(`getColors: GET /products/:id/colors`, async(done) => {   
        const response = await request
            .get(`/products/${prodId}/colors`)
        expect(response.status).toBe(200);    
        if(coat.color_ids){
            expect((response.body)[0]).toEqual(coat.color_ids[0]);   
        }
        done();     
    })

    it(`getMaterials: GET /products/:id/materials`, async(done) => {   
        const response = await request
            .get(`/products/${prodId}/materials`)
        expect(response.status).toBe(200);    
        if(coat.material_ids){
            expect((response.body)[0].id+'').toEqual(coat.material_ids[0]);   
        }
        done();     
    })
});