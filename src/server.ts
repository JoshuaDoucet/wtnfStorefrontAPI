import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

//Route functions
import colorRoutes from './handlers/colors';
import imageRoutes from './handlers/images'
import locationRoutes from './handlers/locations';
import materialRoutes from './handlers/materials';
import orderRoutes from './handlers/orders';
import productRoutes from './handlers/products';
import userRoutes from './handlers/users';

const app: express.Application = express();
const address: string = 'localhost:3000';

app.use(bodyParser.json());
app.use(cors());

app.get('/', function(req: Request, res: Response) {
  res.send('Hi! Welcome to the WTNF Storefront!');
});

// Connect color routes to Express application
colorRoutes(app);
locationRoutes(app);
materialRoutes(app);
orderRoutes(app);
productRoutes(app);
userRoutes(app);
imageRoutes(app);

app.listen(3000, function() {
  console.log(`starting app on: ${address}`);
});

export default app;
