// locationsSpec.ts

// Tests for testing locations endpoints

import supertest from 'supertest';
import app from'../../server'; // Where app is an Express server object
import {Location, LocationStore} from '../../models/location'
import utilities from '../../utilities/utilities'

const request = supertest(app); 
const locationStore = new LocationStore();
const sampleLoc: Location = {
    name: "Sooper 77",
    street_addr_1: "1070 Baptist Rd",
    city: "Colorado Springs",
    state: "CO",
    zip: 80921,
    country: "USA",
    other_info: "A grocery store near Monument, CO"
};

let locId: string | undefined;
let location: Location;

/*
// remove all locations from table before any test and add 1 location
beforeEach( async function() {
    console.log("B4 EACH LOCATIONS")
    locationStore.deleteAll();
    location = await locationStore.create(sampleLoc);
    locId = location.id;
});
*/

describe('Test locations endpoint responses', () => {    
     it('index: GET /locations', async(done) => {   
        const response = await request.get('/locations');
        expect(response.status).toBe(200);         
        done();     
    })

    it(`show: GET /locations/:id`, async(done) => {   
        const response = await request.get(`/locations/${locId}`);
        // create a copy of response body to change null values to undefined 
        const bodyCopy = (utilities.objectNullValsToUndefined(response.body) as Location);
        // Check for valid status code
        expect(response.status).toBe(200);  
        // check 2 properties of location in the response body    
        expect(bodyCopy.name).toEqual(location.name);  
        expect(bodyCopy.zip).toEqual(location.zip);      
        done();     
    })

    it(`create: POST /locations`, async(done) => {   
        const response = await request
            .post(`/locations`)
            .send(sampleLoc);
        expect(response.status).toBe(200);      
        expect(response.body.name).toEqual(location.name);   
        done();     
    })

    it(`destroy: DELETE /locations/:id`, async(done) => {   
        const response = await request
            .delete(`/locations/${locId}`)
        expect(response.status).toBe(200);      
        expect(response.body.name).toEqual(location.name);   
        done();     
    })
});
