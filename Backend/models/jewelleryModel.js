import mongoose from 'mongoose';

const jewellerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: [1, 'Price must be at least ₹1'],
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    material: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
  },
  { timestamps: true }
);

const Jewellery = mongoose.model('Jewellery', jewellerySchema);
export default Jewellery;