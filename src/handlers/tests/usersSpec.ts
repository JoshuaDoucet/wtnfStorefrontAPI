
// usersSpec.ts

// Tests for testing users endpoints

import supertest from 'supertest';
import app from'../../server'; // Where app is an Express server object
import {Location, LocationStore} from '../../models/location'
import {User, UserStore} from '../../models/user'
import utilities from '../../utilities/utilities'

const request = supertest(app); 

const locationStore = new LocationStore();
const foodLoc: Location = {
    name: "Burger Hut",
    street_addr_1: "6044 Yum Rd",
    city: "Springs Hermosa",
    zip: 0,
    country: "MEXICO",
    other_info: "The best burger in Mexico"
};
let locId: string | undefined;
let location: Location;

const userStore = new UserStore();
const testUser: User = {
    first_name: "Everly",
    last_name: "Penelo",
    password_hash: "sampleHash4432423dccc",
    phone: 5552221678,
    email: "everly.penelo@live.com",
    location_id: "1"
}
const testUser2: User = {
    first_name: "Kyle",
    last_name: "Cane",
    password_hash: "sampleHash4432423dccc",
    phone: 5552221678,
    email: "kyle.cane@live.com",
    location_id: "1"
}
let userId: string | undefined;
let user: User;

// remove all users and locations from tables before any test 
// and add 1 location and user
beforeEach( async function() {
    userStore.deleteAll();
    user = await userStore.create(testUser);
    userId = user.id;
});

describe('Test users endpoint responses', () => {    
     it('index: GET /users', async(done) => {   
        const response = await request.get('/users');
        expect(response.status).toBe(200);         
        done();     
    })

    it(`show: GET /users/:id`, async(done) => {   
        const response = await request.get(`/users/${userId}`);
        // create a copy of response body to change null values to undefined 
        const bodyCopy = (utilities.objectNullValsToUndefined(response.body) as User);
        // Check for valid status code
        expect(response.status).toBe(200);  
        // check 2 properties of user in the response body    
        expect(bodyCopy.first_name).toEqual(user.first_name);  
        expect(bodyCopy.last_name).toEqual(user.last_name);      
        done();     
    })

    it(`create: POST /users`, async(done) => {   
        const response = await request
            .post(`/users`)
            .send(testUser2);
        expect(response.status).toBe(200);      
        expect(response.body.length).toBeGreaterThan(1);   
        done();     
    })

    it(`destroy: DELETE /users/:id`, async(done) => {   
        const response = await request
            .delete(`/users/${userId}`)
        expect(response.status).toBe(200);      
        expect(response.body.email).toEqual(user.email);   
        done();     
    })

    it(`authenticate: GET /authenticate`, async(done) => {   
        const response = await request
            .get(`/authenticate`)
            .send({
                email: testUser.email,
                password: testUser.password_hash
            })
        expect(response.status).toBe(200);      
        done();     
    })
});
