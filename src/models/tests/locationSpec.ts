// locationSpec.ts

// Tests for location model

import { LocationStore, Location } from '../location';
import utilities from '../../utilities/utilities';

describe('Location model tests', () => {
  const locationStore = new LocationStore();
  const sampleLoc: Location = {
    name: 'Sooper 77',
    street_addr_1: '1070 Baptist Rd',
    city: 'Colorado Springs',
    state: 'CO',
    zip: 80921,
    country: 'USA',
    other_info: 'A grocery store near Monument, CO'
  };

  beforeAll(async function() {
    await locationStore.deleteAll();
    await locationStore.create(sampleLoc);
  });

  afterAll(async function() {
    await locationStore.deleteAll();
  });

  // READ tests
  it('Should have an index method', () => {
    expect(locationStore.index).toBeDefined();
  });
  it('index should return a list of 1 location', async () => {
    const result = await locationStore.index();
    expect(result.length).toEqual(1);
  });
  it('Should have a show method', () => {
    expect(locationStore.show).toBeDefined();
  });

  // CREATE tests
  it('Should have a create method', () => {
    expect(locationStore.create).toBeDefined();
  });
  it('Should add sample location to the locations table', async () => {
    const createResult = await locationStore.create(sampleLoc);

    // create a copy of result to change null values to undefined
    const copyResult = utilities.objectNullValsToUndefined(
      createResult
    ) as Location;

    // check to see if correct location details were added to new row
    expect(copyResult.name).toEqual(sampleLoc.name);
    expect(copyResult.street_addr_1).toEqual(sampleLoc.street_addr_1);
    expect(copyResult.street_addr_2).toEqual(sampleLoc.street_addr_2);
    expect(copyResult.city).toEqual(sampleLoc.city);
    expect(copyResult.state).toEqual(sampleLoc.state);
    expect(copyResult.zip).toEqual(sampleLoc.zip);
    expect(copyResult.lat).toEqual(sampleLoc.lat);
    expect(copyResult.long).toEqual(sampleLoc.long);
    expect(copyResult.country).toEqual(sampleLoc.country);
    expect(copyResult.other_info).toEqual(sampleLoc.other_info);
  });

  // DELETE tests
  it('Should have a delete method', () => {
    expect(locationStore.delete).toBeDefined();
  });
  it('delete should remove a location from the locations table', async () => {
    // create location row
    const createResult = await locationStore.create(sampleLoc);
    const locId = createResult.id?.toString();
    // check id is defined for added location
    if (locId) {
      // delete location row
      const delResult = await locationStore.delete(locId.toString());
      // check to see if correct row was deleted
      expect(delResult.id).toEqual(createResult.id);
      expect(delResult.name).toEqual(createResult.name);
    } else {
      throw new Error('Invalid location id');
    }
  });

  it('Should have a deletAll method', () => {
    expect(locationStore.deleteAll).toBeDefined();
  });

  it('deleteAll should return a value that is defined', async () => {
    const result = await locationStore.deleteAll();
    expect(result).toBeDefined();
  });
});
