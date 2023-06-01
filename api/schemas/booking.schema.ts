import mongoose from 'mongoose';
import { formatCurrentDateAndTime } from '../../util/helper';
import { NextFunction } from 'express';

interface BOOKING_SCHEMA_TYPE {
  booking_number: string;
  line_ids: [mongoose.Types.ObjectId];
  customer_name: string;
  customer_email: string;
  booking_date: string;
  booking_time: number;
  playing_time: number;
  end_time: number;
  amount_of_player: number;
  shoe_ids: [mongoose.Types.ObjectId];
  created_at: String;
  updated_at: String;
  total_price: number;
  status: 'confirmed' | 'completed';
}

const BookingSchema = new mongoose.Schema<BOOKING_SCHEMA_TYPE>(
  {
    booking_number: {
      type: String,
      required: true,
    },
    line_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lines',
      },
    ],
    customer_name: {
      type: String,
      required: true,
    },
    customer_email: {
      type: String,
      required: true,
    },
    booking_date: {
      type: String,
      required: true,
    },
    booking_time: {
      type: Number,
      required: true,
    },
    playing_time: {
      type: Number,
      required: true,
    },
    end_time: {
      type: Number,
      required: true,
    },
    amount_of_player: {
      type: Number,
      required: true,
    },
    shoe_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shoes',
      },
    ],
    total_price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'completed'],
      default: 'confirmed',
    },
    created_at: {
      type: String,
      default: formatCurrentDateAndTime(),
    },
    updated_at: {
      type: String,
      default: formatCurrentDateAndTime(),
    },
  },
  {
    timestamps: false,
  }
);

// BookingSchema.pre('findOneAndUpdate', function (next: NextFunction) {
//   this.getUpdate().updated_at = formatCurrentDateAndTime();
//   next();
// });

const BookingModel = mongoose.model('Bookings', BookingSchema);

export default BookingModel;
