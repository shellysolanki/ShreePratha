import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    bodycare: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bodycare',
    },
    inner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inner',
    },
    jewellery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Jewellery',
    },
    makeup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Makeup',
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must be at most 5'],
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be an integer',
      },
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [500, 'Comment must be under 500 characters'],
    },
    approved: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);
export default Review;