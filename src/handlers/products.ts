// products.ts

// handler for products

// TODO

import express, { Request, Response } from 'express';
import { Product, ProductStore, ProductUpdate } from '../models/product';
import utilities from '../utilities/utilities';

const store = new ProductStore();

// /products [GET]
const index = async (_req: Request, res: Response) => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (err) {
    res.status(503);
    res.json(`Cannot GET products index. ERR -- ${err}`);
  }
};

// /products/:id [GET]
const show = async (req: Request, res: Response) => {
  try {
    const product = await store.show(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      res.json(`Cannot GET product with id ${req.params.id}`);
    }
  } catch (err) {
    res.status(503);
    res.json(`Cannot GET product with id ${req.params.id} ERR -- ${err}`);
  }
};

// /products [POST]
const create = async (req: Request, res: Response) => {
  var prodName: string | undefined;
  try {
    // Pull name value for error handling
    prodName = req.body.name;
    const product: Product = {
      name: req.body.name,
      price: req.body.price,
      cost: req.body.cost,
      boh: req.body.boh,
      for_sale: req.body.for_sale,
      category: req.body.category,
      description: req.body.description,
      measurments: req.body.measurments,
      owner: req.body.owner,
      sku: req.body.sku,
      size_family: req.body.size_family,
      size: req.body.size,
      brand: req.body.brand,
      condition: req.body.condition,
      instructions: req.body.instructions,
      country_origin: req.body.country_origin,
      rn_num: req.body.rn_num,
      weight_grams: req.body.weight_grams,
      location_id: req.body.location_id,
      color_ids: req.body.color_ids,
      material_ids: req.body.material_ids,
      image_ids: req.body.image_ids
    };
    // create product
    const newProd = await store.create(product);
    res.json(newProd);
  } catch (error) {
    res.status(400);
    res.json(`Product name [${prodName}] not added. ERR -- ${error}`);
  }
};

// /products/:id [PUT]
const update = async (req: Request, res: Response) => {
  var prodName: string | undefined;
  try {
    const product: ProductUpdate = {
      id: req.params.id,
      name: req.body.name,
      price: req.body.price,
      cost: req.body.cost,
      boh: req.body.boh,
      for_sale: req.body.for_sale,
      category: req.body.category,
      description: req.body.description,
      measurments: req.body.measurments,
      owner: req.body.owner,
      sku: req.body.sku,
      size_family: req.body.size_family,
      size: req.body.size,
      brand: req.body.brand,
      condition: req.body.condition,
      instructions: req.body.instructions,
      country_origin: req.body.country_origin,
      rn_num: req.body.rn_num,
      weight_grams: req.body.weight_grams,
      location_id: req.body.location_id
    };
    // update product
    const updateProd = await store.update(product);
    res.json(updateProd);
  } catch (error) {
    res.status(400);
    res.json(`Product id [${req.params.id}] not updated. ERR -- ${error}`);
  }
};

// /products/:id/colors GET
const getColors = async (_req: Request, res: Response) => {
  const productId: string = _req.params.id;
  try {
    const colors = await store.getColors(productId);
    res.json(colors);
  } catch (err) {
    res.status(400);
    res.json('Cannot get colors for product. ERR -- ' + err);
  }
};

// /products/:id/colors POST
const addColor = async (_req: Request, res: Response) => {
  const productId: string = _req.params.id;
  const colorId: string = _req.body.color_id;
  try {
    const addedColor = await store.addColor(colorId, productId);
    res.json(addedColor);
  } catch (err) {
    res.status(400);
    res.json('Cannot add color to product. ERR -- ' + err);
  }
};

// /products/:id/images GET
const getImages = async (_req: Request, res: Response) => {
  const productId: string = _req.params.id;
  try {
    const images = await store.getImages(productId);
    res.json(images);
  } catch (err) {
    res.status(400);
    res.json('Cannot get images for product. ERR -- ' + err);
  }
};

// /products/:id/materials GET
const getMaterials = async (_req: Request, res: Response) => {
  const productId: string = _req.params.id;
  try {
    const colors = await store.getMaterials(productId);
    res.json(colors);
  } catch (err) {
    res.status(400);
    res.json('Cannot get materials for product. ERR -- ' + err);
  }
};

// /products/:id/images POST
const addImage = async (_req: Request, res: Response) => {
  const productId: string = _req.params.id;
  const imageId: string = _req.body.material_id;
  try {
    const addedImg = await store.addImage(imageId, productId);
    res.json(addedImg);
  } catch (err) {
    res.status(400);
    res.json('Cannot add image to product. ERR -- ' + err);
  }
};

// /products/:id/materials POST
const addMaterial = async (_req: Request, res: Response) => {
  const productId: string = _req.params.id;
  const materialId: string = _req.body.material_id;
  try {
    const addedMat = await store.addMaterial(materialId, productId);
    res.json(addedMat);
  } catch (err) {
    res.status(400);
    res.json('Cannot add material to product. ERR -- ' + err);
  }
};

// /products/:id [DELETE]
const destroy = async (req: Request, res: Response) => {
  try {
    const delProduct = await store.delete(req.params.id);
    if (delProduct) {
      res.json(delProduct);
    } else {
      res.status(404);
      res.json(`Cannot DELETE product with id ${req.params.id}`);
    }
  } catch (err) {
    res.status(400);
    res.json(`Product id [${req.params.id}] not deleted. ERR -- ${err}`);
  }
};

// Routes to connect the Express application to products data
const productRoutes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.get('/products/:id/colors', getColors);
  app.get('/products/:id/images', getImages);
  app.get('/products/:id/materials', getMaterials);
  app.post('/products', utilities.verifyAuthJWT, create);
  app.post('/products/:id/colors', utilities.verifyAuthJWT, addColor);
  app.post('/products/:id/images', utilities.verifyAuthJWT, addImage);
  app.post('/products/:id/materials', utilities.verifyAuthJWT, addMaterial);
  app.put('/products/:id', utilities.verifyAuthJWT, update);
  app.delete('/products/:id', utilities.verifyAuthJWT, destroy);
};

export default productRoutes;
