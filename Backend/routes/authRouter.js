// 📁 routes/authRouter.js
import express from 'express';
import {
  Register,
  loginUser,
  googleLogin
} from '../controllers/authController.js'; // ✅ Make sure file name/path matches

const router = express.Router();

// 🔐 Email/password register
router.post('/register', Register);

// 🔐 Email/password login
router.post('/login', loginUser);

// 🔐 Google login (token-based)
router.post('/google-login', googleLogin);

export default router;
