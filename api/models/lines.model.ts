import mongoose from 'mongoose';
import LinesModel from '../schemas/lines.schema';

const Lines = {
  number_of_lines: 8,
  price_per_line: 100,
  price_per_person: 120,
  insertLines: async function () {
    try {
      let lines = [];
      for (let index = 0; index < this.number_of_lines; index++) {
        const new_line = {
          price_per_line: this.price_per_line,
          price_per_person: this.price_per_person,
        };

        lines.push(new_line);
      }
      await LinesModel.insertMany(lines);
      console.log('Lines inserted');
    } catch (error) {
      console.log(error);
    }
  },

  checkLineIds: function (line_ids: mongoose.Types.ObjectId[]) {
    return LinesModel.find({
      _id: {
        $in: line_ids,
      },
    });
  },

  saveBookingIdsOnLines: function (
    booking_id: mongoose.Types.ObjectId,
    line_ids: string[]
  ) {
    return LinesModel.updateMany(
      {
        _id: {
          $in: line_ids,
        },
        booking_ids: {
          $nin: [booking_id],
        },
      },
      {
        $push: {
          booking_ids: booking_id,
        },
      }
    );
  },
  deleteBookingIdsOnLines: function (
    line_ids: mongoose.Types.ObjectId[],
    booking_id: mongoose.Types.ObjectId
  ) {
    return LinesModel.updateMany(
      {
        _id: {
          $in: line_ids,
        },
        booking_ids: {
          $in: [booking_id],
        },
      },
      {
        $pull: {
          booking_ids: booking_id,
        },
      }
    );
  },
};

export default Lines;
