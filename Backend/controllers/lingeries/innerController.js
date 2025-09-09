import Innerwear from '../../models/innerModel.js';

// Add new innerwear item
export const addInner = async (req, res) => {
  try {
    const item = new Innerwear(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all innerwear items
export const getInner = async (req, res) => {
  try {
    const items = await Innerwear.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get one item by ID
export const getInnerById = async (req, res) => {
  try {
    const item = await Innerwear.findById(req.params.id);
    res.status(200).json(item);
  } catch (err) {
    res.status(404).json({ error: 'Item not found' });
  }
};

// Update item
export const updateInner = async (req, res) => {
  try {
    const updated = await Innerwear.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete item
export const deleteInner = async (req, res) => {
  try {
    const deleted = await Innerwear.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Item not found' });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};