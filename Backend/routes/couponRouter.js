import express from 'express';
import {
  createCoupon,
  getAllCoupons,
  validateCoupon,
} from '../controllers/couponController.js';

const router = express.Router();

// Create a new coupon
router.post('/', createCoupon);

// Get all coupons
router.get('/', getAllCoupons);

// Validate a coupon code
router.post('/validate', validateCoupon);

export default router;