import express, { Express, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import connectDb from './util/db';
import mainRouter from './api/index';
import Lines from './api/models/lines.model';
import Shoes from './api/models/shoes.model';
dotenv.config();
const app: Express = express();
app.use(express.json());

app.use('/api', mainRouter);
app.use('/*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'API not found',
  });
});

const port = process.env.PORT || 8001;
app.listen(port, () => {
  console.log('The server listening on port ' + port);
  connectDb();
  // Lines.insertLines();
  // Shoes.insertShoeSizes();
});
