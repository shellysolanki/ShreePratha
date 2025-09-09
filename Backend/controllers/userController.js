// controllers/userController.js
import User from "../models/userModel.js";
import dotenv from 'dotenv';
import bcrypt from "bcrypt";
import mailtransporter from '../utils/email.js'; // adjust path as needed
import jwt from 'jsonwebtoken';
//import { OAuth2Client } from 'google-auth-library';

dotenv.config();

//register

export const register = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, role });
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '7d' }
    );
    res.status(201).json({ token, role: user.role });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// login
export const createUser = async (req, res) => {
  try {
    const { email, password, role, ...rest } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ ...rest, email, password: hashedPassword, role });
    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      role: user.role
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// google authentication

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// export const googleLogin = async (req, res) => {
//   try {
//     const { token } = req.body;
//     if (!token) return res.status(400).json({ message: 'Token missing' });

//     // Verify Google token
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     const { email, name, picture } = payload;

//     // Check if user exists
//     let user = await User.findOne({ email });
//     if (!user) {
//       user = await User.create({ name, email, avatar: picture });
//     }

//     // Issue JWT
//     const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: '30d',
//     });
//    res.status(200).json({ token: jwtToken, user });
//   } catch (err) {
//     console.error('Google login error:', err);
//     res.status(500).json({ message: 'Authentication failed' });
//   }
// };



// logout
export const logoutUser = (req, res) => {
  // JWT is stateless, so logout means frontend should delete the token
  res.status(200).json({ message: "Logout successful" });
};

// Get current user (from token)
export const getMe = async (req, res) => {
  try {
    const id = req.user?.id;
    if (!id) return res.status(401).json({ message: 'Unauthorized' });
    const user = await User.findById(id).select('-password');
    return res.json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Update current user
export const updateMe = async (req, res) => {
  try {
    const id = req.user?.id;
    if (!id) return res.status(401).json({ message: 'Unauthorized' });
    
    const allowed = ['name', 'phone', 'email'];
    const updates = {};
    for (const k of allowed) if (k in req.body) updates[k] = req.body[k];
    
    // Check if email is being updated and if it already exists
    if (updates.email) {
      const existingUser = await User.findOne({ email: updates.email.toLowerCase(), _id: { $ne: id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      updates.email = updates.email.toLowerCase();
    }
    
    const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
    return res.json({ success: true, user });
  } catch (err) {
    console.error('Update user error:', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    return res.status(400).json({ message: err.message });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ error: "User not found" });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//get All user
export const getUserWithDetails = async (req, res) => {
  const user = await User.findById(req.params.id)
    .populate("bodycare")
    .populate("coupon")
    .populate("inner")
    .populate("jewellery")
    .populate("makeup")
    .populate("order")
    .populate("payments")
    .populate("cart");

  res.json(user);
};

