import mongoose from 'mongoose';

const innerwearSchema = new mongoose.Schema(
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
    sizes: [
      {
        type: String,
        trim: true,
      },
    ],
    colors: [
      {
        type: String,
        trim: true,
      },
    ],
    style: {
      type: String,
      trim: true, // e.g. padded, non-padded, wired, bralette
    },
    fabric: {
      type: String,
      trim: true, // e.g. cotton, lace, satin
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
    category: {
      type: String,
      default: 'lingerie',
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

const Innerwear = mongoose.model('Innerwear', innerwearSchema);
export default Innerwear;