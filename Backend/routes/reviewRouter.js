// routes/reviewRouter.js
import express from "express";
import {
  createReview,
  getApprovedReviewsForProduct,
  approveReview,
  deleteReview,
  listPendingReviews,
  listMyReviews,
} from "../controllers/reviewController.js";
import { verifyToken, requireRole } from "../utils/authHelpers.js";

const router = express.Router();

// create review (user)
router.post("/", verifyToken, createReview);

// public: get approved reviews for a product
router.get("/product/:productId", getApprovedReviewsForProduct);

// admin moderation
router.get('/pending', verifyToken, requireRole('admin'), listPendingReviews);
router.put("/:id/approve", verifyToken, requireRole('admin'), approveReview);
router.delete("/:id", verifyToken, requireRole('admin'), deleteReview);

// user
router.get('/me', verifyToken, listMyReviews);

export default router;
