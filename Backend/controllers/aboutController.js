import About from '../models/aboutModel.js';

export const getAbout = async (_req, res) => {
  try {
    let doc = await About.findOne();
    if (!doc) {
      doc = await About.create({});
    }
    res.json(doc);
  } catch (e) {
    res.status(500).json({ error: 'Failed to load about' });
  }
};

export const updateAbout = async (req, res) => {
  try {
    const { imageUrl, videoUrl, lines } = req.body;
    const updated = await About.findOneAndUpdate({}, { imageUrl, videoUrl, lines }, { new: true, upsert: true });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: 'Failed to update about' });
  }
};












