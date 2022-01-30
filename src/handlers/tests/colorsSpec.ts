// colorsSpec.ts

// Tests for testing colors endpoints

import supertest from 'supertest';
import app from'../../server'; // Where app is an Express server object
import {Color, ColorStore} from '../../models/color'
import {User, UserStore} from '../../models/user'

const request = supertest(app); 
const colorStore = new ColorStore();
const redColor: Color = {
    name: "Red",
    red: 255,
    hex: "FF0000"
};

let colorID: string | undefined;
let color: Color;

// for authorization to access endpoints
const userStore = new UserStore();
let authUser: User;
let authUserId: string | undefined;
let authJWT: string;

/*
// remove all colors from table before any test and add 1 color
beforeEach( async function() {
    console.log("B4 EACH COLORS")
    colorStore.deleteAll();
    color = await colorStore.create(redColor);
    colorID = color.id;
});
*/

describe('Test colors endpoint responses', () => {    
    beforeAll(async function(){
        console.log("BEFORE ALL COLORS")
        userStore.deleteAll();
        let testUserA: User = {
            first_name: "Test",
            last_name: "User",
            email: "testuser@bios.com",
            password_hash: "badPassword"
        };
        authUser = await userStore.create(testUserA);
        authUserId = authUser.id;

        const response = await request
            .get(`/authenticate`)
            .send({
                email: testUserA.email,
                password: testUserA.password_hash
            });
        authJWT = `Bearer ${response.body}`;
    });

    afterAll(async function(){
        // TODO
    })

    it('index: GET /colors', async(done) => {   
        const response = await request.get('/colors');
        expect(response.status).toBe(200);         
        done();     
    })

    it(`show: GET /colors/:id`, async(done) => {   
        const response = await request.get(`/colors/${colorID}`);
        expect(response.status).toBe(200);      
        expect(response.body.name).toEqual(color.name);   
        expect(response.body.red).toEqual(color.red);   
        expect(response.body.hex).toEqual(color.hex);   
        done();     
    })

    it(`create: POST /colors`, async(done) => {   
        console.log("GLOB 4: " + authJWT)
        const response = await request
            .post(`/colors`)
            .set('Authorization', authJWT)
            .send(redColor);
        expect(response.status).toBe(200);      
        expect(response.body.name).toEqual(color.name);   
        done();     
    })

    it(`destroy: DELETE /colors/:id`, async(done) => {   
        const response = await request
            .delete(`/colors/${colorID}`)
        expect(response.status).toBe(200);      
        expect(response.body.name).toEqual(color.name);   
        done();     
    })
});
