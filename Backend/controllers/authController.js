import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
dotenv.config();

const ADMIN_SECRET = process.env.ADMIN_SECRET;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
console.log("CLIENT_ID from env:", process.env.GOOGLE_CLIENT_ID);


export const Register = async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password || !phone) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = password === process.env.ADMIN_SECRET ? 'admin' : 'user';

    const newUser = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      phone,
      role,
      avatar: ''
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user details so frontend can persist role and block admin on user pages
    const safeUser = { _id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role, avatar: newUser.avatar };
    res.status(201).json({ message: 'Registered successfully', token, role: newUser.role, user: safeUser });
  } catch (err) {
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  try {
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Include user payload to ensure frontend stores role for route guards
    const safeUser = { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar };
    res.status(200).json({ message: 'Login successful', token, role: user.role, user: safeUser });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Token missing' });

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;
    const normalizedEmail = email.toLowerCase();
    
    console.log('Google login payload:', { email, name, picture });

    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
      const role = adminEmails.includes(normalizedEmail) ? 'admin' : 'user';

      user = await User.create({
        name,
        email: normalizedEmail,
        avatar: picture || '',
        role,
      });
    } else {
      // Update existing user with latest Google data
      user.name = name;
      user.avatar = picture || user.avatar;
      try {
        await user.save();
      } catch (saveError) {
        console.error('Error saving user data:', saveError);
        // If save fails due to duplicate key, just continue with existing user data
      }
    }

    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    console.log('Returning user data:', { name: user.name, email: user.email, avatar: user.avatar });
    res.status(200).json({ token: jwtToken, user });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({ message: 'Authentication failed' });
  }
};

// import bcrypt from 'bcryptjs';
// import User from '../models/userModel.js';
// import jwt from 'jsonwebtoken';
// import { OAuth2Client } from "google-auth-library";

// const ADMIN_SECRET = process.env.ADMIN_SECRET; // 🔐 Your secret admin password

// export const Register = async (req, res) => {
//   const { name, email, password, phone } = req.body;

//   if (!name || !email || !password || !phone) {
//     return res.status(400).json({ message: 'All fields are required' });
//   }

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(409).json({ message: 'Email already registered' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const role = password === ADMIN_SECRET ? 'admin' : 'user';

//     const newUser = new User({ name, email, password: hashedPassword, phone, role });
//     await newUser.save();

//     const token = jwt.sign(
//       { id: newUser._id, role: newUser.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     res.status(201).json({ message: 'Registered successfully', token, role: newUser.role });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error during registration' });
//   }
// };

// export const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: 'Email and password required' });
//   }

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     res.status(200).json({ message: 'Login successful', token, role: user.role });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error during login' });
//   }
// };

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// export const googleLogin = async (req, res) => {
//   try {
//     const { token } = req.body;
//     if (!token) return res.status(400).json({ message: "Token missing" });

//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     const { email, name, picture } = payload;

//     let user = await User.findOne({ email });
//     if (!user) {
//       const role = email === "admin@example.com" ? "admin" : "user";
//       user = await User.create({ name, email, avatar: picture, role });
//     }

//     const jwtToken = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "30d" }
//     );

//     res.status(200).json({ token: jwtToken, user });
//   } catch (err) {
//     console.error("Google login error:", err);
//     res.status(500).json({ message: "Authentication failed" });
//   }
// };