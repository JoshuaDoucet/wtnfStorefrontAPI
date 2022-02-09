// images.ts

// handler for images

import express, { Request, Response } from 'express';
import path from 'path'
import { Image, ImageStore } from '../models/image';
import utilities from '../utilities/utilities';

const store = new ImageStore();

// /images [GET]
const index = async (_req: Request, res: Response) => {
  try {
    const images = await store.index();
    res.json(images);
  } catch (err) {
    res.status(503);
    res.json(`Cannot GET images index. ERR -- ${err}`);
  }
};

// /images/:id [GET]
const show = async (req: Request, res: Response) => {
  try {
    const image = await store.show(req.params.id);
    if (image) {
      res.json(image);
    } else {
      res.status(404);
      res.json(`Cannot GET image with id ${req.params.id}`);
    }
  } catch (err) {
    res.status(503);
    res.json(`Cannot GET image with id ${req.params.id} ERR -- ${err}`);
  }
};


// /imagefile/:id [GET]
const getImage = async (req: Request, res: Response) => {
  try {
    const image = await store.show(req.params.id);
    if (image && image.path) {
      const pathToImage = path.resolve(image.path);
      res.sendFile(pathToImage);
    } else {
      res.status(404);
      res.json(`Cannot GET image with id ${req.params.id}`);
    }
  } catch (err) {
    res.status(503);
    res.json(`Cannot GET image with id ${req.params.id} ERR -- ${err}`);
  }
};

// /images [POST]
const create = async (req: Request, res: Response) => {
  let imgName: string | undefined;
  try {
    // Pull value for error handling
    imgName = req.body.name;
    const image: Image = {
      name: req.body.name,
      path: req.body.path
    };
    const newImg = await store.create(image);
    res.json(newImg);
  } catch (error) {
    res.status(400);
    res.json(`Image name [${imgName}] not added. ERR -- ${error}`);
  }
};

// /images/:id [DELETE]
const destroy = async (req: Request, res: Response) => {
  try {
    const delImg = await store.delete(req.params.id);
    if (delImg) {
      res.json(delImg);
    } else {
      res.status(404);
      res.json(`Cannot DELETE image with id ${req.params.id}`);
    }
  } catch (err) {
    res.status(400);
    res.json(`Image id [${req.params.id}] not deleted. ERR -- ${err}`);
  }
};

// Routes to connect the Express application to images data
const imageRoutes = (app: express.Application) => {
  app.get('/images', index);
  app.get('/images/:id', show);
  app.get('/imagefile/:id', getImage);
  app.post('/images', utilities.verifyAuthJWT, create);
  app.delete('/images/:id', utilities.verifyAuthJWT, destroy);
};

export default imageRoutes;
