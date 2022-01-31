
// usersSpec.ts

// Tests for testing users endpoints

import supertest from 'supertest';
import app from'../../server'; // Where app is an Express server object
import {Location, LocationStore} from '../../models/location'
import {User, UserStore} from '../../models/user'
import utilities from '../../utilities/utilities'

const request = supertest(app); 

describe('Test users endpoint responses', () => {        
    const locationStore = new LocationStore();
    const testLocation: Location = {
        name: "Burger Hut",
        zip: 0,
        country: "MEXICO",
    };
    let locId: string | undefined;

    const userStore = new UserStore();
    const testUser: User = {
        first_name: "Everly",
        last_name: "Penelope",
        password_hash: "sample432423dccc",
        phone: 5552221678,
        email: "everly.penelope@live.com",
        location_id: "1"
    }
    let userJWT: string;
    let userId: string | undefined;
    let user: User;

    const testUser2: User = {
        first_name: "Leroy",
        last_name: "Jenkins",
        password_hash: "sfdsfklf",
        phone: 5551114444,
        email: "leroy.jenkins@live.com",
        location_id: "1"
    }

    beforeAll(async function(){
        await userStore.deleteAll()
        await locationStore.deleteAll();
        const location = await locationStore.create(testLocation);
        locId = location.id;
        testUser.location_id = locId;
    });

    beforeEach( async function() {
        userStore.deleteAll();
        user = await userStore.create(testUser);
        userId = user.id;

        const response = await request
            .get(`/authenticate`)
            .send({
                email: testUser.email,
                password: testUser.password_hash
        });
         userJWT = `Bearer ${response.body}`;
    });


    it('index: GET /users', async(done) => {   
        const response = await request.get('/users')
            .set('Authorization', userJWT);
        expect(response.status).toBe(200);         
        done();     
    })

    it(`show: GET /users/:id`, async(done) => {   
        const response = await request.get(`/users/${userId}`)
                                    .set('Authorization', userJWT);
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
            .set('Authorization', userJWT)
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
