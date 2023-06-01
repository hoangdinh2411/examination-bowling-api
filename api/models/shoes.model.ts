import mongoose from 'mongoose';
import ShoesModel from '../schemas/shoes.schema';
import { calculateNumberOfShoeOfEachSize } from '../../util/helper';

const Shoes = {
  sizeArray: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
  quantity: 20,
  insertShoeSizes: async function () {
    try {
      let shoes = [];
      for (let index = 0; index < this.sizeArray.length; index++) {
        const newShoe = {
          size: this.sizeArray[index],
          quantity: this.quantity,
        };

        shoes.push(newShoe);
      }
      if (shoes.length > 0) {
        await ShoesModel.insertMany(shoes);
        console.log('Shoes inserted');
      }
    } catch (error) {
      console.log(error);
    }
  },

  checkShoeIds: async function (shoe_ids: string[]) {
    return ShoesModel.find({
      _id: {
        $in: shoe_ids,
      },
    });
  },
  checkQuantityShoe: async function (shoe_ids: mongoose.Types.ObjectId[]) {
    const new_shoes = calculateNumberOfShoeOfEachSize(shoe_ids);
    let result = [];
    for (let index = 0; index < new_shoes.length; index++) {
      const shoe = await ShoesModel.findOne({
        _id: new_shoes[index]._id,
        quantity: {
          $lt: new_shoes[index].quantity,
        },
      });
      if (shoe) {
        result.push(shoe.size);
      }
    }
    return result;
  },
  updateQuantity: async (shoe_ids: mongoose.Types.ObjectId[]) => {
    const new_shoe_ids = calculateNumberOfShoeOfEachSize(shoe_ids);
    for (let index = 0; index < new_shoe_ids.length; index++) {
      await ShoesModel.updateOne(
        { _id: new_shoe_ids[index]._id },
        { $inc: { quantity: -new_shoe_ids[index].quantity } }
      );
    }
  },
  refundQuantityShoeFromUpdatedBooking: async (
    old_shoe_ids: mongoose.Types.ObjectId[]
  ) => {
    const new_shoe_ids = calculateNumberOfShoeOfEachSize(old_shoe_ids);
    for (let index = 0; index < new_shoe_ids.length; index++) {
      await ShoesModel.updateOne(
        { _id: new_shoe_ids[index]._id },
        { $inc: { quantity: new_shoe_ids[index].quantity } }
      );
    }
  },
};

export default Shoes;
