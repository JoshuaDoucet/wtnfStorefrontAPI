// materialsSpec.ts

// Tests for testing materials endpoints

import supertest from 'supertest';
import app from '../../server'; // Where app is an Express server object
import { Material, MaterialStore } from '../../models/material';
import { User, UserStore } from '../../models/user';

const request = supertest(app);

describe('Test materials endpoint responses', () => {
  const materialStore = new MaterialStore();
  const leatherMat: Material = { name: 'Leather' };

  let materialID: string | undefined;
  let material: Material;

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
  });

  // remove all materials from table before any test and add 1 material
  beforeEach(async function() {
    materialStore.deleteAll();
    material = await materialStore.create(leatherMat);
    materialID = material.id;
  });

  it('index: GET /materials', async done => {
    const response = await request.get('/materials');
    expect(response.status).toBe(200);
    done();
  });

  it(`show: GET /materials/:id`, async done => {
    const response = await request.get(`/materials/${materialID}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toEqual(material.name);
    done();
  });

  it(`create: POST /materials`, async done => {
    const response = await request
      .post(`/materials`)
      .set('Authorization', userJWT)
      .send(leatherMat);
    expect(response.status).toBe(200);
    expect(response.body.name).toEqual(material.name);
    done();
  });

  it(`destroy: DELETE /materials/:id`, async done => {
    const response = await request
      .delete(`/materials/${materialID}`)
      .set('Authorization', userJWT);
    expect(response.status).toBe(200);
    expect(response.body.name).toEqual(material.name);
    done();
  });
});
