import Feedback from '../models/feedbackModel.js';

export const createFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const fb = new Feedback({ user: req.user.id, rating, comment });
    await fb.save();
    return res.status(201).json({ success: true, feedback: fb });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const listApprovedFeedback = async (req, res) => {
  try {
    const items = await Feedback.find({ approved: true }).populate('user', 'name').sort({ createdAt: -1 });
    return res.json({ success: true, items });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const listPendingFeedback = async (req, res) => {
  try {
    const items = await Feedback.find({ approved: false }).populate('user', 'name email').sort({ createdAt: -1 });
    return res.json({ success: true, items });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const approveFeedback = async (req, res) => {
  try {
    const fb = await Feedback.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    if (!fb) return res.status(404).json({ message: 'Feedback not found' });
    return res.json({ success: true, feedback: fb });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};


