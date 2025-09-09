import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getWishlistCount,
  checkWishlistItem
} from '../controllers/wishlistController.js';
import { verifyToken } from '../utils/authHelpers.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get user's wishlist
router.get('/', getWishlist);

// Add item to wishlist
router.post('/add', addToWishlist);

// Remove item from wishlist
router.delete('/remove', removeFromWishlist);

// Get wishlist count
router.get('/count', getWishlistCount);

// Check if item is in wishlist
router.get('/check', checkWishlistItem);

export default router;
