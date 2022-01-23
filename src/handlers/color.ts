import express, { Request, Response } from 'express'
import { Color, ColorStore } from '../models/color'

const store = new ColorStore();

// /colors [GET]
const index = async (_req: Request, res: Response) => {
  const colors = await store.index()
  res.json(colors);
}

// /colors/:id [GET] 
const show = async (req: Request, res: Response) => {
   const color = await store.show(req.body.id);
   res.json(color);
}

// /colors [PUT]
const create = async (req: Request, res: Response) => {
    var colorName: string | undefined;
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
    } catch(error) {
        res.status(400);
        res.json(`Color name [${colorName}] not added. -- ${error}`);
    }
}

// /colors/:id [DELETE]
const destroy = async (req: Request, res: Response) => {
    const deletedColor = await store.delete(req.body.id);
    res.json(deletedColor);
}

// Routes to connect the Express application to colors data
const colorRoutes = (app: express.Application) => {
  app.get('/colors', index)
  app.get('/colors/:id', show)
  app.post('/colors', create)
  app.delete('/colors', destroy)
}

export default colorRoutes;