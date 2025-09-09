import Coupon from '../models/couponModel.js';

// Create
export const createCoupon = async (req, res) => {
  try {
    const coupon = new Coupon(req.body);
    await coupon.save();
    res.status(201).json(coupon);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json(coupons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Validate
export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code });

    if (!coupon || coupon.expiry < Date.now()) {
      return res.status(400).json({ valid: false, message: 'Invalid or expired coupon' });
    }

    res.status(200).json({ valid: true, discount: coupon.discount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};