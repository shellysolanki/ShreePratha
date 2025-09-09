import mongoose from 'mongoose';

const bagSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true }, // Bag name
  description: { type: String, trim: true }, // Short story or details
  price: { type: Number, required: true }, // Selling price
  category: { type: String, default: 'bag' }, // Fixed for filtering
  material: { type: String, trim: true }, // e.g. jute, cotton, denim
  color: { type: String, trim: true }, // Optional
  size: { type: String, trim: true }, // e.g. small, medium, large
  handmade: { type: Boolean, default: true }, // Always true
  images: [{ type: String }], // Array of image URLs or filenames
  stock: { type: Number, default: 1 }, // Usually 1 or few pieces
  tags: [{ type: String }], // e.g. eco-friendly, embroidered
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Admin who uploaded
}, { timestamps: true });

const Bag = mongoose.model('Bag', bagSchema);
export default Bag;