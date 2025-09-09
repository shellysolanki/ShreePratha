import mongoose from 'mongoose';

const bodycareSchema = new mongoose.Schema(
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
    type: {
      type: String,
      required: true,
      trim: true, // e.g. cream, lotion, scrub
    },
    skinType: {
      type: String,
      trim: true, // e.g. dry, oily, sensitive
    },
    usage: {
      type: String,
      trim: true, // e.g. daily, weekly, night-only
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: null,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      default: 'bodycare',
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

const Bodycare = mongoose.model('Bodycare', bodycareSchema);
export default Bodycare;