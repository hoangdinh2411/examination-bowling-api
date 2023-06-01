import dayjs from 'dayjs';
import Lines from '../api/models/lines.model';
import LinesModel, { LINE_SCHEMA_TYPE } from '../api/schemas/lines.schema';
import mongoose, { mongo } from 'mongoose';
import CONFIG from './constant';

export const formatCurrentDateAndTime = () => {
  return dayjs().format('YYYY-MM-DD HH:mm:ss');
};

export const getCurrentDate = () => {
  return dayjs().format('YYYY-MM-DD');
};
export const getCurrentHour = () => {
  return dayjs().hour();
};

type ShoeType = {
  _id: mongoose.Types.ObjectId;
  quantity: number;
};
export const calculateNumberOfShoeOfEachSize = (
  shoe_ids: mongoose.Types.ObjectId[]
) => {
  return shoe_ids.reduce((shoes: ShoeType[], id: mongoose.Types.ObjectId) => {
    const found = shoes.find((shoe) => shoe._id === id);
    if (found) {
      found.quantity += 1;
    } else {
      shoes.push({ _id: id, quantity: 1 });
    }
    return shoes;
  }, []);
};

export const generateBookingNumber = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const amount_character = 6;
  let booking_number = '';
  const random_number = Math.floor(Math.random() * 9999).toString();
  for (let i = 0; i < amount_character; i++) {
    booking_number += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  booking_number += random_number;

  return booking_number;
};

interface LineType extends LINE_SCHEMA_TYPE {
  _id: mongoose.Types.ObjectId;
}
export const calculateTotalPrice = async (
  amount_of_players: number,
  line_ids: string[]
) => {
  const lines = await LinesModel.find({
    _id: {
      $in: line_ids,
    },
  });

  return lines.reduce((acc: number, curr: LineType) => {
    return (acc +=
      amount_of_players * curr.price_per_person + curr.price_per_line);
  }, 0);
};

export const generatePlayingTimeArray = (
  booking_time: number,
  playing_time: number
): number[] => {
  return Array.apply(0, {
    length: playing_time,
  }).map((_: any, index: number) => index + booking_time);
};
