// imagesSpec.ts

// Tests for testing images endpoints

import supertest from 'supertest';
import app from '../../server'; // Where app is an Express server object
import { Image, ImageStore } from '../../models/image';
import { User, UserStore } from '../../models/user';

const request = supertest(app);

describe('Test images endpoint responses', () => {
  const imageStore = new ImageStore();
  const bagImg: Image = { 
    name: 'Black Bag Crossbody',
    path: 'public/images/products/blackbag.jpg' 
};

  let imgID: string | undefined;
  let image: Image;

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

  // remove all images from table before any test and add 1 material
  beforeEach(async function() {
    imageStore.deleteAll();
    image = await imageStore.create(bagImg);
    imgID = image.id;
  });

  it('index: GET /images', async done => {
    const response = await request.get('/images');
    expect(response.status).toBe(200);
    done();
  });


  it(`show: GET /images/:id`, async done => {
    const response = await request.get(`/images/${imgID}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toEqual(image.name);
    expect(response.body.path).toEqual(image.path);
    done();
  });

  it('getImage: GET /imagefile/:id', async done => {
    const response = await request.get(`/imagefile/${image.id}`);
    expect(response.status).toBe(200);
    expect(response.type).toBe('image/jpeg');
    done();
  });

  it(`create: POST /images`, async done => {
    const response = await request
      .post(`/images`)
      .set('Authorization', userJWT)
      .send(bagImg);
    expect(response.status).toBe(200);
    expect(response.body.name).toEqual(image.name);
    done();
  });

  it(`destroy: DELETE /images/:id`, async done => {
    const response = await request
      .delete(`/images/${imgID}`)
      .set('Authorization', userJWT);
    expect(response.status).toBe(200);
    expect(response.body.name).toEqual(image.name);
    done();
  });
});
