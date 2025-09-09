import mongoose from 'mongoose';

const makeupSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [1, 'Price must be at least ₹1'],
    },
    type: {
      type: String,
      required: [true, 'Makeup type is required'],
      enum: {
        values: ['foundation', 'lipstick', 'eyeliner', 'mascara', 'blush', 'concealer', 'other'],
        message: 'Invalid makeup type',
      },
    },
    shade: {
      type: String,
      required: [true, 'Shade is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
     },

    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
  },
  { timestamps: true }
);

const Makeup = mongoose.model('Makeup', makeupSchema);
export default Makeup;