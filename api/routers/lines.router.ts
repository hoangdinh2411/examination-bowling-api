import express from 'express';
import LinesController from '../controllers/lines.controller';

const router = express.Router();

router.get('/:date', LinesController.getLinesByDate);
router.get('/', LinesController.getLines);

export default router;
