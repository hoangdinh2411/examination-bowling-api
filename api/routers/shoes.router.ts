import express from 'express';
import ShoesController from '../controllers/shoes.controller';

const router = express.Router();

router.get('/', ShoesController.getShoeSizes);

export default router;
