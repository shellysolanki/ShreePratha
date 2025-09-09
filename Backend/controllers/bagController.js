import Bag from '../models/BagModel.js';

// ✅ Add a new bag
export const addBag = async (req, res) => {
  try {
    const bag = new Bag(req.body);
    await bag.save();
    res.status(201).json(bag);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get all bags
export const getAllBags = async (req, res) => {
  try {
    const bags = await Bag.find();
    res.status(200).json(bags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get single bag by ID
export const getBagById = async (req, res) => {
  try {
    const bag = await Bag.findById(req.params.id);
    if (!bag) return res.status(404).json({ error: 'Bag not found' });
    res.status(200).json(bag);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update bag by ID
export const updateBag = async (req, res) => {
  try {
    const bag = await Bag.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!bag) return res.status(404).json({ error: 'Bag not found' });
    res.status(200).json(bag);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete bag by ID
export const deleteBag = async (req, res) => {
  try {
    const deleted = await Bag.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Bag not found' });
    res.status(200).json({ message: 'Bag deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};