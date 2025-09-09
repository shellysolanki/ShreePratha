// controllers/reviewController.js
import Review from "../models/reviewModel.js";
import Payment from "../models/paymentModel.js";

// Create review (logged-in users)
export const createReview = async (req, res) => {
  try {
    const { rating, comment, productId, productType } = req.body;
    if (!productId || !productType) {
      return res.status(400).json({ message: 'productId and productType are required' });
    }

    // Check that the user has at least one successful payment (basic purchase gate)
    // Commenting out payment verification for now to allow reviews without purchase
    // const hasAnyPurchase = await Payment.findOne({ user: req.user.id, status: 'success' }).lean();
    // if (!hasAnyPurchase) {
    //   return res.status(403).json({ message: 'You can review only after a successful purchase.' });
    // }

    // Prevent duplicate review per user per product
    const exists = await Review.findOne({ user: req.user.id, [productType]: productId });
    if (exists) {
      return res.status(409).json({ message: 'You have already reviewed this product' });
    }

    const doc = new Review({
      user: req.user.id,
      rating,
      comment,
      // store product reference into the correct field based on productType
      [productType]: productId,
      approved: true, // Auto-approve reviews
    });
    await doc.save();
    return res.status(201).json({ success: true, review: doc });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Public: get approved reviews for a product
export const getApprovedReviewsForProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { productType } = req.query; // jewellery|makeup|bag|inner|bodycare
    if (!productId || !productType) {
      return res.status(400).json({ message: 'productId and productType are required' });
    }
    const reviews = await Review.find({ [productType]: productId, approved: true })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    return res.json({ success: true, reviews });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Admin: approve review
export const approveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    if (!review) return res.status(404).json({ message: 'Review not found' });
    return res.json({ success: true, review });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Admin: delete review
export const deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Admin: list pending reviews
export const listPendingReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ approved: false })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    return res.json({ success: true, reviews });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// User: list own reviews
export const listMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    return res.json({ success: true, reviews });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
