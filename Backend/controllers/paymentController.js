// controllers/paymentController.js
import Payment from "../models/paymentModel.js";
import crypto from "crypto";
import Razorpay from "razorpay";
import jwt from "jsonwebtoken";

const getRazorpay = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  console.log('Razorpay Key ID:', keyId);
  console.log('Razorpay Key Secret:', keySecret ? 'Present' : 'Missing');
  if (!keyId || !keySecret) {
    throw new Error("Razorpay keys are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET");
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

// Add payment
export const createPayment = async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all payments
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    res.json(payment);
  } catch (err) {
    res.status(404).json({ error: "Payment not found" });
  }
};

// Update payment
export const updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete payment
export const deletePayment = async (req, res) => {
  try {
    await Payment.findByIdAndDelete(req.params.id);
    res.json({ message: "Payment deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Razorpay: Create order
export const createRazorpayOrder = async (req, res) => {
  try {
    console.log('Razorpay order creation request:', req.body);
    console.log('Headers:', req.headers);
    
    const { amount, currency = "INR", receipt } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Valid amount is required" });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    };

    console.log('Razorpay options:', options);
    const razorpay = getRazorpay();
    const order = await razorpay.orders.create(options);
    console.log('Razorpay order created successfully:', order.id);
    return res.json({ order });
  } catch (err) {
    console.error('Razorpay order creation error:', err);
    return res.status(500).json({ error: err.message });
  }
};

// Razorpay: Verify signature and capture payment (webhook-style or client callback)
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, userId, paymentMethod = "card" } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing Razorpay params" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValid = generatedSignature === razorpay_signature;
    if (!isValid) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    // Determine user id: prefer body.userId, else decode from Authorization bearer token
    let resolvedUserId = userId;
    if (!resolvedUserId) {
      const authHeader = req.headers.authorization || req.headers.Authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        try {
          const token = authHeader.substring(7);
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          resolvedUserId = decoded?.id;
        } catch {}
      }
    }
    if (!resolvedUserId) {
      return res.status(400).json({ error: "user is required" });
    }

    const paymentDoc = new Payment({
      user: resolvedUserId,
      orderId: razorpay_order_id,
      amount: amount,
      currency: "INR",
      status: "success",
      paymentMethod,
      transactionId: razorpay_payment_id,
    });
    await paymentDoc.save();

    return res.json({ success: true, payment: paymentDoc });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Public key endpoint (for frontend to initialize Checkout)
export const getRazorpayKey = (req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID || null;
  if (!keyId) {
    return res.status(500).json({ error: "Razorpay key not configured" });
  }
  return res.json({ key: keyId });
};

// Logged-in user's purchase summary
export const getMyPurchaseSummary = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const successPayments = await Payment.find({ user: userId, status: 'success' }).lean();
    const totalOrders = successPayments.length;
    const totalSpent = successPayments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
    return res.json({ success: true, totalOrders, totalSpent });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Logged-in user's successful purchases (basic list)
export const getMyPurchases = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const items = await Payment.find({ user: userId, status: 'success' })
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ success: true, items });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
