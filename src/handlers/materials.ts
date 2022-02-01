// materials.ts

// handler for material

import express, { Request, Response } from 'express';
import { Material, MaterialStore } from '../models/material';
import utilities from '../utilities/utilities';

const store = new MaterialStore();

// /materials [GET]
const index = async (_req: Request, res: Response) => {
  try {
    const materials = await store.index();
    res.json(materials);
  } catch (err) {
    res.status(503);
    res.json(`Cannot GET materials index. ERR -- ${err}`);
  }
};

// /materials/:id [GET]
const show = async (req: Request, res: Response) => {
  try {
    const material = await store.show(req.params.id);
    if (material) {
      res.json(material);
    } else {
      res.status(404);
      res.json(`Cannot GET material with id ${req.params.id}`);
    }
  } catch (err) {
    res.status(503);
    res.json(`Cannot GET material with id ${req.params.id} ERR -- ${err}`);
  }
};

// /materials [POST]
const create = async (req: Request, res: Response) => {
  let matName: string | undefined;
  try {
    // Pull value for error handling
    matName = req.body.name;
    const material: Material = {
      name: req.body.name
    };
    const newMat = await store.create(material);
    res.json(newMat);
  } catch (error) {
    res.status(400);
    res.json(`Material name [${matName}] not added. ERR -- ${error}`);
  }
};

// /materials/:id [DELETE]
const destroy = async (req: Request, res: Response) => {
  try {
    const delMat = await store.delete(req.params.id);
    if (delMat) {
      res.json(delMat);
    } else {
      res.status(404);
      res.json(`Cannot DELETE material with id ${req.params.id}`);
    }
  } catch (err) {
    res.status(400);
    res.json(`Material id [${req.params.id}] not deleted. ERR -- ${err}`);
  }
};

// Routes to connect the Express application to materials data
const materialRoutes = (app: express.Application) => {
  app.get('/materials', index);
  app.get('/materials/:id', show);
  app.post('/materials', utilities.verifyAuthJWT, create);
  app.delete('/materials/:id', utilities.verifyAuthJWT, destroy);
};

export default materialRoutes;
