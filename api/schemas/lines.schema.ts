import mongoose from 'mongoose';

export interface LINE_SCHEMA_TYPE {
  price_per_line: number;
  price_per_person: number;
  booking_ids: [mongoose.Types.ObjectId];
}

const LinesSchema = new mongoose.Schema<LINE_SCHEMA_TYPE>({
  price_per_line: {
    type: Number,
    required: true,
    min: 0,
  },
  price_per_person: {
    type: Number,
    required: true,
    min: 0,
  },
  booking_ids: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bookings',
    },
  ],
});

const LinesModel = mongoose.model('Lines', LinesSchema);

export default LinesModel;
