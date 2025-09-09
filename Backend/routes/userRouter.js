// routes/userRouter.js
import express from "express";
import {
  register,
  createUser,
  logoutUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserWithDetails,
  getMe,
  updateMe
} from "../controllers/userController.js";
import { verifyToken } from "../utils/authHelpers.js";

const router = express.Router();

// 👇 Simple routes
//router.get("/send-email",sendEmail);
router.post('/register',register)
router.post("/add", createUser);       // Add user
//router.post("/google-login", googleLogin);  //googlr Login
router.post("/add", logoutUser);  // logout
router.get("/all", getUsers);          // Get all users
router.get("/:id", getUserById);       // Get user by ID
router.put("/update/:id", updateUser); // Update user
router.delete("/delete/:id", deleteUser); // Delete user
router.get("/getuser/:id", getUserWithDetails);// get All user with association

// current user
router.get('/me', verifyToken, getMe);
router.put('/me', verifyToken, updateMe);

export default router;
