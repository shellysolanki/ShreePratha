import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send('Wrong password');

    // JWT token mein role bhi add karo
    const token = jwt.sign(
      { id: user._id, role: user.role }, // <-- role include kiya
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '30d' }
    );

    res.send({
      token,
      role: user.role,
      message: user.role === 'admin' ? 'Go to admin dashboard' : 'Go to user dashboard'
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

export default router;
// ✅ Correct