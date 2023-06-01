import { NextFunction, Request, Response } from 'express';
import { bookingBodySchema } from '../../util/validation';
import {
  calculateTotalPrice,
  getCurrentDate,
  getCurrentHour,
} from '../../util/helper';
import Booking from '../models/booking.model';
import CONFIG from '../../util/constant';
import Lines from '../models/lines.model';

export const checkBody = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (Object.keys(req.body).length === 0)
    return res.status(400).json({ success: false, message: 'No body found' });
  try {
    await bookingBodySchema.validateAsync(req.body);
    if (
      req.body.booking_date === getCurrentDate() &&
      req.body.booking_time < getCurrentHour()
    ) {
      return res.status(400).json({
        success: false,
        message: `Please choose another time or line `,
      });
    }
    if (
      !Booking.checkPlayingTime(req.body.booking_time, req.body.playing_time)
    ) {
      const available_hours = CONFIG.closing_time - req.body.booking_time;
      return res.status(400).json({
        success: false,
        message: `Can play only ${available_hours} ${
          available_hours > 1 ? 'hours' : 'hour'
        }`,
      });
    }
    const end_time = req.body.booking_time + req.body.playing_time;
    const total_price = await calculateTotalPrice(
      req.body.amount_of_player,
      req.body.line_ids
    );
    const lines = await Lines.checkLineIds(req.body.line_ids);
    if (!lines || lines.length !== req.body.line_ids.length) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book the lines. Please try again',
      });
    }
    req.body.end_time = end_time;
    req.body.total_price = total_price;
    next();
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
