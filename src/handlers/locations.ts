// locations.ts

// handler for locations

import express, { Request, Response } from 'express';
import { Location, LocationStore } from '../models/location';
import utilities from '../utilities/utilities';

const store = new LocationStore();

// /locations [GET]
const index = async (_req: Request, res: Response) => {
  try {
    const locations = await store.index();
    res.json(locations);
  } catch (err) {
    res.status(503);
    res.json(`Cannot GET locations index. ERR -- ${err}`);
  }
};

// /locations/:id [GET]
const show = async (req: Request, res: Response) => {
  try {
    const location = await store.show(req.params.id);
    if (location) {
      res.json(location);
    } else {
      res.status(404);
      res.json(`Cannot GET location with id ${req.params.id}`);
    }
  } catch (err) {
    res.status(503);
    res.json(`Cannot GET location with id ${req.params.id} ERR -- ${err}`);
  }
};

// /locations [PUT]
const create = async (req: Request, res: Response) => {
  let locName: string | undefined;
  try {
    // Pull value for error handling
    locName = req.body.name;
    const location: Location = {
      name: req.body.name,
      street_addr_1: req.body.street_addr_1,
      street_addr_2: req.body.street_addr_2,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
      country: req.body.country,
      lat: req.body.lat,
      long: req.body.long,
      other_info: req.body.other_info
    };
    const newLoc = await store.create(location);
    res.json(newLoc);
  } catch (error) {
    res.status(400);
    res.json(`Location name [${locName}] not added. ERR -- ${error}`);
  }
};

// /locations/:id [DELETE]
const destroy = async (req: Request, res: Response) => {
  try {
    const delLocation = await store.delete(req.params.id);
    if (delLocation) {
      res.json(delLocation);
    } else {
      res.status(404);
      res.json(`Cannot DELETE location with id ${req.params.id}`);
    }
  } catch (err) {
    res.status(400);
    res.json(`Location id [${req.params.id}] not deleted. ERR -- ${err}`);
  }
};

// Routes to connect the Express application to locations data
const locationRoutes = (app: express.Application) => {
  app.get('/locations', utilities.verifyAuthJWT, index);
  app.get('/locations/:id', utilities.verifyAuthJWT, show);
  app.post('/locations', utilities.verifyAuthJWT, create);
  app.delete('/locations/:id', utilities.verifyAuthJWT, destroy);
};

export default locationRoutes;
