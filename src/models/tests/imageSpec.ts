import { ImageStore, Image } from '../image';

describe('Image model tests', () => {
  const imageStore = new ImageStore();
  const blackBagImg: Image = { 
      name: 'Black Bag Crossbody',
      path: 'public/images/products/blackbag.jpg' 
  };

  beforeAll(async function() {
    await imageStore.deleteAll();
    await imageStore.create(blackBagImg);
  });

  afterAll(async function() {
    await imageStore.deleteAll();
  });
  // READ tests
  it('Should have an index method', () => {
    expect(imageStore.index).toBeDefined();
  });
  it('index should return a list with 1 image', async () => {
    const result = await imageStore.index();
    expect(result.length).toEqual(1);
  });
  it('Should have an show method', () => {
    expect(imageStore.show).toBeDefined();
  });

  // CREATE tests
  it('Should have a create method', () => {
    expect(imageStore.create).toBeDefined();
  });
  it('Should add black bag image to the images table', async () => {
    const createResult = await imageStore.create(blackBagImg);
    expect(createResult.name).toEqual('Black Bag Crossbody');
    expect(createResult.path).toEqual('public/images/products/blackbag.jpg');
  });

  // DELETE tests
  it('Should have a delete method', () => {
    expect(imageStore.delete).toBeDefined();
  });
  it('delete should remove an image from the images table', async () => {
    // create image row
    const createResult = await imageStore.create(blackBagImg);
    const imgId = createResult.id?.toString();
    // check id is defined for added material
    if (imgId) {
      // delete image row
      const delResult = await imageStore.delete(imgId.toString());
      // check to see if correct image was deleted
      expect(delResult.id).toEqual(createResult.id);
      expect(delResult.name).toEqual(createResult.name);
    } else {
      throw new Error('Invalid image id');
    }
  });

  it('Should have a deletAll method', () => {
    expect(imageStore.deleteAll).toBeDefined();
  });

  it('deleteAll should return a value that is defined', async () => {
    const result = await imageStore.deleteAll();
    expect(result).toBeDefined();
  });
});
