import { Request, Response } from 'express';
import Shoes from '../models/shoes.model';
import BookingModel from '../schemas/booking.schema';
import {
  formatCurrentDateAndTime,
  generateBookingNumber,
} from '../../util/helper';
import Booking from '../models/booking.model';
import Lines from '../models/lines.model';

const BookingController = {
  bookLine: async (req: Request, res: Response) => {
    const { line_ids, booking_time, booking_date, playing_time, shoe_ids } =
      req.body;

    try {
      const wasBooked = await Booking.checkNewBooking(
        line_ids,
        booking_date,
        booking_time,
        playing_time
      );

      if (wasBooked.length !== 0) {
        return res.status(400).json({
          success: false,
          message: `Please choose another time or line `,
        });
      }
      await Shoes.checkShoeIds(shoe_ids);

      const isOutOfStock: number[] = await Shoes.checkQuantityShoe(shoe_ids);

      if (isOutOfStock.length !== 0) {
        return res.status(400).json({
          success: false,
          message: `Shoe size ${isOutOfStock.join(',')} is out of stock`,
        });
      }
      const booking_number = generateBookingNumber();
      const booking = new BookingModel({
        booking_number,

        ...req.body,
      });
      const new_booking = await booking.save();
      if (new_booking) {
        await Lines.saveBookingIdsOnLines(new_booking._id, line_ids);
        await Shoes.updateQuantity(shoe_ids);
        return res.status(201).json({ success: true });
      }
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  updateBooking: async (req: Request, res: Response) => {
    const booking_number = req.params.booking_number;
    const {
      line_ids,
      booking_time,
      booking_date,
      playing_time,
      shoe_ids,
      amount_of_player,
    } = req.body;
    try {
      let isChanged = false;
      const booking = await Booking.checkBookingNumber(booking_number);
      if (!booking) {
        return res.status(400).json({
          success: false,
          message: 'Booking number is not valid',
        });
      }

      const wasBooked = await Booking.checkNewBooking(
        line_ids,
        booking_date,
        booking_time,
        playing_time
      );

      const isLineIdsChanged = await Booking.checkLineIdsChanged(
        booking.line_ids,
        line_ids
      );
      if (wasBooked.length !== 0) {
        if (wasBooked[0].booking_number !== booking_number) {
          return res.status(400).json({
            success: false,
            message: `Other booking has already booked the lines and time you chose. Please choose another time or line `,
          });
        } else {
          const shoeSizeChanged = await Booking.checkShoeSizeChanged(
            booking.shoe_ids,
            shoe_ids
          );
          if (shoeSizeChanged) {
            isChanged = true;
          }
          if (booking.playing_time !== playing_time) {
            isChanged = true;
          }
          if (booking.booking_time !== booking_time) {
            isChanged = true;
          }
          if (booking.amount_of_player !== amount_of_player) {
            isChanged = true;
          }
          if (isLineIdsChanged) {
            isChanged = true;
          }
        }
      }

      if (isChanged) {
        await Shoes.checkShoeIds(shoe_ids);
        await Shoes.refundQuantityShoeFromUpdatedBooking(booking.shoe_ids);
        const isOutOfStock: number[] = await Shoes.checkQuantityShoe(shoe_ids);
        if (isOutOfStock.length !== 0) {
          return res.status(400).json({
            success: false,
            message: `Shoe size ${isOutOfStock.join(',')} is out of stock`,
          });
        }

        await Shoes.updateQuantity(shoe_ids);

        await BookingModel.updateOne(
          {
            booking_number,
          },
          {
            ...req.body,
            updated_at: formatCurrentDateAndTime(),
          }
        );
        if (isLineIdsChanged) {
          await Lines.deleteBookingIdsOnLines(booking.line_ids, booking._id);
          await Lines.saveBookingIdsOnLines(booking._id, line_ids);
        }
        return res.status(200).json({ success: true });
      }

      return res
        .status(200)
        .json({ success: true, message: 'Nothing changed' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  getBookingByBookingNumber: async (req: Request, res: Response) => {
    const booking_number = req.params.booking_number;
    try {
      const booking = await Booking.checkBookingNumber(booking_number);
      if (!booking) {
        return res.status(400).json({
          success: false,
          message: 'Booking number is not valid',
        });
      }
      return res.status(200).json({ success: true, booking });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  deleteBookingByBookingNumber: async (req: Request, res: Response) => {
    const booking_number = req.params.booking_number;
    if (!booking_number) {
      return res
        .status(400)
        .json({ success: false, message: 'Booking number is required' });
    }
    try {
      const deleted_booking = await Booking.deleteBooking(booking_number);
      if (!deleted_booking) {
        return res.status(400).json({
          success: false,
          message: 'Booking number is not valid',
        });
      }

      await Lines.deleteBookingIdsOnLines(
        deleted_booking.line_ids,
        deleted_booking._id
      );
      await Shoes.refundQuantityShoeFromUpdatedBooking(
        deleted_booking?.shoe_ids
      );
      return res.status(200).json({ success: true });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
};

export default BookingController;
