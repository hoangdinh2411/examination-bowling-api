import mongoose from 'mongoose';

interface SHOES_SCHEMA_TYPE {
  size: number;
  quantity: number;
}

const ShoesSchema = new mongoose.Schema<SHOES_SCHEMA_TYPE>({
  size: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});
const ShoesModel = mongoose.model('Shoes', ShoesSchema);

export default ShoesModel;
