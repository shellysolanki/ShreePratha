import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One wishlist per user
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        productType: {
          type: String,
          required: true,
          enum: ['jewellery', 'makeup', 'inner', 'bodycare', 'bag'],
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
export default Wishlist;
