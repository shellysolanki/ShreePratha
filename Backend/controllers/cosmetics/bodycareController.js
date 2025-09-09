import Bodycare from '../../models/bodycareModel.js';

// Get all products
export const getAllBodyProducts = async (req, res) => {
  try {
    const products = await Bodycare.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Get one product by ID
export const getBodyProductById = async (req, res) => {
  try {
    const product = await Bodycare.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching product' });
  }
};

// Create new product
export const createBodyProduct = async (req, res) => {
  try {
    const product = new Bodycare(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Error creating product' });
  }
};

// Update product
export const updateBodyProduct = async (req, res) => {
  try {
    const updated = await Bodycare.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Error updating product' });
  }
};

// Delete product
export const deleteBodyProduct = async (req, res) => {
  try {
    const deleted = await Bodycare.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting product' });
  }
};