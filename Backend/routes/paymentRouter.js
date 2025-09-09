// routes/paymentRouter.js
import express from "express";
import {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getRazorpayKey,
  getMyPurchaseSummary,
  getMyPurchases,
} from "../controllers/paymentController.js";
import { verifyToken } from "../utils/authHelpers.js";

const router = express.Router();

router.post("/add", createPayment);
router.get("/all", getPayments);
router.get("/:id", getPaymentById);
router.put("/update/:id", updatePayment);
router.delete("/delete/:id", deletePayment);

// Razorpay routes
router.post("/razorpay/order", createRazorpayOrder);
router.post("/razorpay/verify", verifyRazorpayPayment);
router.get("/razorpay/key", getRazorpayKey);

// user summary
router.get('/me/summary', verifyToken, getMyPurchaseSummary);
router.get('/me/list', verifyToken, getMyPurchases);

export default router;
