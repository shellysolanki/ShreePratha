import express from 'express';
import {
  getAllBodyProducts,
  getBodyProductById,
  createBodyProduct,
  updateBodyProduct,
  deleteBodyProduct
} from '../controllers/cosmetics/bodycareController.js';

const router = express.Router();

// GET all body products
router.get('/', getAllBodyProducts);

// GET single body product by ID
router.get('/:id', getBodyProductById);

// POST new body product
router.post('/', createBodyProduct);

// PUT update body product
router.put('/:id', updateBodyProduct);

// DELETE body product
router.delete('/:id', deleteBodyProduct);

export default router;