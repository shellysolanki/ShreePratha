// 📁 routes/adminRouter.js
import express from 'express';
import {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getUserSummary,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/adminController.js';

const router = express.Router();

// user summary for dashboard - place BEFORE any dynamic :id route
router.get('/user-summary', getUserSummary);

// User management routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// GET all admins
router.get('/', getAllAdmins);

// GET one admin by ID
router.get('/:id', getAdminById);

// POST new admin
router.post('/', createAdmin);

// PUT update admin
router.put('/:id', updateAdmin);

// DELETE admin
router.delete('/:id', deleteAdmin);

// (kept above)

export default router;