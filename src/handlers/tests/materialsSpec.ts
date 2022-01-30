// materialsSpec.ts

// Tests for testing materials endpoints

import supertest from 'supertest';
import app from'../../server'; // Where app is an Express server object
import {Material, MaterialStore} from '../../models/material'

const request = supertest(app); 
const materialStore = new MaterialStore();
const leatherMat: Material = {name: "Leather"};

let materialID: string | undefined;
let material: Material;

/*
// remove all materials from table before any test and add 1 material
beforeEach( async function() {
    console.log("B4 EACH MATERIALS")
    materialStore.deleteAll();
    material = await materialStore.create(leatherMat);
    materialID = material.id;
});
*/

describe('Test materials endpoint responses', () => {    
     it('index: GET /materials', async(done) => {   
        const response = await request.get('/materials');
        expect(response.status).toBe(200);         
        done();     
    })

    it(`show: GET /materials/:id`, async(done) => {   
        const response = await request.get(`/materials/${materialID}`);
        expect(response.status).toBe(200);      
        expect(response.body.name).toEqual(material.name);   
        done();     
    })

    it(`create: POST /materials`, async(done) => {   
        const response = await request
            .post(`/materials`)
            .send(leatherMat);
        expect(response.status).toBe(200);      
        expect(response.body.name).toEqual(material.name);   
        done();     
    })

    it(`destroy: DELETE /materials/:id`, async(done) => {   
        const response = await request
            .delete(`/materials/${materialID}`)
        expect(response.status).toBe(200);      
        expect(response.body.name).toEqual(material.name);   
        done();     
    })
});
