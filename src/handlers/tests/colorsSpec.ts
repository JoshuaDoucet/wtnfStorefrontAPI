// colorsSpec.ts

// Tests for testing colors endpoints

import supertest from 'supertest';
import app from '../../server'; // Where app is an Express server object
import { Color, ColorStore } from '../../models/color';
import { User, UserStore } from '../../models/user';

const request = supertest(app);

describe('Test colors endpoint responses', () => {
  const colorStore = new ColorStore();
  const redColor: Color = {
    name: 'Red',
    red: 255,
    hex: 'FF0000'
  };
  let colorID: string | undefined;
  let color: Color;

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

  afterAll(async function() {
    await colorStore.deleteAll();
    await userStore.deleteAll();
  });

  // remove all colors from table before any test and add 1 color
  beforeEach(async function() {
    colorStore.deleteAll();
    color = await colorStore.create(redColor);
    colorID = color.id;
  });

  it('index: GET /colors', async done => {
    const response = await request.get('/colors');
    expect(response.status).toBe(200);
    done();
  });

  it(`show: GET /colors/:id`, async done => {
    const response = await request.get(`/colors/${colorID}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toEqual(color.name);
    expect(response.body.red).toEqual(color.red);
    expect(response.body.hex).toEqual(color.hex);
    done();
  });

  it(`create: POST /colors`, async done => {
    const response = await request
      .post(`/colors`)
      .set('Authorization', userJWT)
      .send(redColor);
    expect(response.status).toBe(200);
    expect(response.body.name).toEqual(color.name);
    done();
  });

  it(`destroy: DELETE /colors/:id`, async done => {
    const response = await request
      .delete(`/colors/${colorID}`)
      .set('Authorization', userJWT);
    expect(response.status).toBe(200);
    expect(response.body.name).toEqual(color.name);
    done();
  });
});
