import mongoose from 'mongoose';
import LinesModel from '../schemas/lines.schema';
import CONFIG from '../../util/constant';

const Lines = {
  insertLines: async function () {
    try {
      let lines = [];
      for (let index = 0; index < CONFIG.number_of_lines; index++) {
        const new_line = {
          price_per_line: CONFIG.price_per_line,
          price_per_person: CONFIG.price_per_person,
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
  checkLinesNotDuplicated: function (line_ids: mongoose.Types.ObjectId[]) {
    return new Set(line_ids).size !== line_ids.length;
  },
};

export default Lines;
