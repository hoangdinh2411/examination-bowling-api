import mongoose from 'mongoose';
import CONFIG from '../../util/constant';
import { generatePlayingTimeArray } from '../../util/helper';
import BookingModel from '../schemas/booking.schema';
import LinesModel from '../schemas/lines.schema';
import Shoes from './shoes.model';

const Booking = {
  checkPlayingTime: (booking_time: number, playing_time: number) => {
    if (booking_time + playing_time > CONFIG.closing_time) {
      return false;
    }
    return true;
  },
  getAllLine: () => {
    return LinesModel.find({}).select('-booking_ids -__v');
  },
  getAvailableTimes: (start_date: string, end_date: string) => {
    return LinesModel.aggregate([
      {
        // calculate the booked times for each line when the booking date matches the date i params
        $lookup: {
          from: 'bookings',
          localField: 'booking_ids',
          foreignField: '_id',
          let: {
            booking_id: '$_id',
          },
          as: 'bookings',
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $gte: ['$booking_date', start_date],
                    },
                    {
                      $lte: ['$booking_date', end_date],
                    },
                  ],
                },
              },
            },
            {
              $addFields: {
                booked_times: {
                  $range: [
                    { $toInt: '$booking_time' },
                    { $toInt: '$end_time' },
                    1,
                  ],
                },
              },
            },

            // // if the booking date matches the date in params, return the booked times , otherwise return an empty array
            {
              $project: {
                _id: 0,
                booking_date: 1,
                booked_times: {
                  $cond: {
                    if: { $in: ['$$booking_id', '$line_ids'] },
                    then: {
                      $concatArrays: [[], '$booked_times'],
                    },
                    else: [],
                  },
                },
              },
            },
            // unwind the booked times array
            {
              $unwind: '$booked_times',
            },
            // // group all the booked times into one array
            {
              $group: {
                _id: '$booking_date',
                booked_times: {
                  $push: '$booked_times',
                },
              },
            },
            {
              $project: {
                _id: 1,
                booked_times: {
                  $sortArray: {
                    input: '$booked_times',
                    sortBy: 1,
                  },
                },
              },
            },
          ],
        },
      },
      {
        $project: {
          booking_ids: 0,
          __v: 0,
        },
      },
    ]);
  },

  checkNewBooking: (
    line_ids: string[],
    booking_date: string,
    booking_time: number,
    playing_time: number
  ) => {
    const playing_time_array = generatePlayingTimeArray(
      booking_time,
      playing_time
    );

    const converted_line_ids = line_ids.map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    console.log(line_ids);

    return BookingModel.aggregate([
      {
        $addFields: {
          booked_times: {
            $range: [{ $toInt: '$booking_time' }, { $toInt: '$end_time' }, 1],
          },
        },
      },
      {
        $match: {
          booking_date: booking_date,
          line_ids: {
            $in: converted_line_ids,
          },
          booked_times: {
            $in: playing_time_array,
          },
        },
      },
    ]);
  },
  checkBookingNumber: (booking_number: string) => {
    return BookingModel.findOne({
      booking_number,
    }).populate({
      path: 'line_ids',
      select: '_id',
    });
  },
  checkShoeSizeChanged: async (
    shoe_ids_on_db: mongoose.Types.ObjectId[],
    shoe_ids: string[]
  ) => {
    return shoe_ids_on_db.some((id) => !shoe_ids.includes(id.toString()));
  },
  checkLineIdsChanged: async (
    old_line_ids: mongoose.Types.ObjectId[],
    new_line_ids: mongoose.Types.ObjectId[]
  ) => {
    return old_line_ids.some((id) => !new_line_ids.includes(id));
  },
  deleteBooking: (booking_number: string) => {
    return BookingModel.findOneAndRemove({
      booking_number: booking_number,
    });
  },
};

export default Booking;
