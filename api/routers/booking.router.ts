import express from 'express';
import BookingController from '../controllers/booking.controller';
import { checkBody } from '../middleware/booking.middleware';

const router = express.Router();

router.get('/:booking_number', BookingController.getBookingByBookingNumber);
router.post('/', checkBody, BookingController.bookLine);
router.put('/:booking_number', checkBody, BookingController.updateBooking);
router.delete(
  '/:booking_number',
  BookingController.deleteBookingByBookingNumber
);

export default router;
