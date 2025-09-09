import express from 'express';
import {
  createCart,
  getCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
} from '../controllers/cartController.js';

const router = express.Router();

// Add item to cart
router.post('/', createCart);

// Get current cart
router.get('/:userId', getCart);

//  Update quantity
router.put('/:userId/:productId', updateCartItem);

// Remove item
router.delete('/:userId/:productId', deleteCartItem);

// Clear entire cart
router.delete('/clear/:userId', clearCart);

export default router;