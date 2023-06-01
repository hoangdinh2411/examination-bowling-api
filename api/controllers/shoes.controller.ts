import { Request, Response } from 'express';
import ShoesModel from '../schemas/shoes.schema';

const ShoesController = {
  getShoeSizes: async (req: Request, res: Response) => {
    try {
      const lines = await ShoesModel.find({}).select('-__v');
      res.status(200).json({ success: true, lines });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
};

export default ShoesController;
