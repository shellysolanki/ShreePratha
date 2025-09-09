import Makeup from '../../models/makeupModel.js';


// Add makup
export const createMakeup = async (req, res) => {
  try {
    const order = new Makeup(req.body);
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all makup
export const getMakeups = async (req, res) => {
  try {
    const orders = await Makeup.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get makup by ID
export const getMakeupById = async (req, res) => {
  try {
    const order = await Makeup.findById(req.params.id);
    res.json(order);
  } catch (err) {
    res.status(404).json({ error: "Order not found" });
  }
};

// Update makup
export const updateMakeup = async (req, res) => {
  try {
    const order = await Makeup.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete makup
export const deleteMakeup = async (req, res) => {
  try {
    await Makeup.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
