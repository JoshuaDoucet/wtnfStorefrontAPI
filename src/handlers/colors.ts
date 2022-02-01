// color.ts

// handler for color

import express, { Request, Response } from 'express';
import { Color, ColorStore } from '../models/color';
import utilities from '../utilities/utilities';

const store = new ColorStore();

// /colors [GET]
const index = async (_req: Request, res: Response) => {
  try {
    const colors = await store.index();
    res.json(colors);
  } catch (err) {
    res.status(503);
    res.json(`Cannot GET colors index. ERR -- ${err}`);
  }
};

// /colors/:id [GET]
const show = async (req: Request, res: Response) => {
  try {
    const color = await store.show(req.params.id);
    if (color) {
      res.json(color);
    } else {
      res.status(404);
      res.json(`Cannot GET color with id ${req.params.id}`);
    }
  } catch (err) {
    res.status(503);
    res.json(`Cannot GET color with id ${req.params.id} ERR -- ${err}`);
  }
};

// /colors [POST]
const create = async (req: Request, res: Response) => {
  let colorName: string | undefined;
  try {
    // Pull value for error handling
    colorName = req.body.name;
    const color: Color = {
      name: req.body.name,
      red: req.body.red,
      green: req.body.green,
      blue: req.body.blue,
      hex: req.body.hex
    };
    const newColor = await store.create(color);
    res.json(newColor);
  } catch (error) {
    res.status(400);
    res.json(`Color name [${colorName}] not added. ERR -- ${error}`);
  }
};

// /colors/:id [DELETE]
const destroy = async (req: Request, res: Response) => {
  try {
    const deletedColor = await store.delete(req.params.id);
    if (deletedColor) {
      res.json(deletedColor);
    } else {
      res.status(404);
      res.json(`Cannot DELETE color with id ${req.params.id}`);
    }
  } catch (err) {
    res.status(400);
    res.json(`Color id [${req.params.id}] not deleted. ERR -- ${err}`);
  }
};

// Routes to connect the Express application to colors data
const colorRoutes = (app: express.Application) => {
  app.get('/colors', index);
  app.get('/colors/:id', show);
  app.post('/colors', utilities.verifyAuthJWT, create);
  app.delete('/colors/:id', utilities.verifyAuthJWT, destroy);
};

export default colorRoutes;
