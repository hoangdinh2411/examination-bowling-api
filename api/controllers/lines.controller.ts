import { Request, Response } from 'express';
import dayjs from 'dayjs';
import Booking from '../models/booking.model';

const LinesController = {
  getLinesByDate: async (req: Request, res: Response) => {
    const interval_time = req.params.date.split('&');
    const start_date = dayjs(interval_time[0]).format('YYYY-MM-DD');
    const end_date = dayjs(interval_time[1]).format('YYYY-MM-DD');
    console.log(req.params.date);

    try {
      let lines;
      if (!req.params.date) {
        lines = await Booking.getAllLine();
      } else {
        lines = await Booking.getAvailableTimes(start_date, end_date);
      }
      return res.status(200).json({ success: true, lines });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
  getLines: async (req: Request, res: Response) => {
    try {
      const lines = await Booking.getAllLine();
      return res.status(200).json({ success: true, lines });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
};

export default LinesController;
