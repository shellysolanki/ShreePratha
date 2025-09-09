import Jewellery from '../../models/jewelleryModel.js';

// Create
export const addJewellery = async (req, res) => {
  try {
    const item = new Jewellery(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Read All
export const getJewellery = async (req, res) => {
  try {
    const items = await Jewellery.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read One
export const getJewelleryById = async (req, res) => {
  try {
    const item = await Jewellery.findById(req.params.id);
    res.status(200).json(item);
  } catch (err) {
    res.status(404).json({ error: 'Item not found' });
  }
};

// Update
export const updateJewellery = async (req, res) => {
  try {
    const updated = await Jewellery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
export const deleteJewellery = async (req, res) => {
  try {
    await Jewellery.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};