import express from 'express';
import { addBag, getAllBags, getBagById, updateBag, deleteBag } from '../controllers/bagController.js';

const router = express.Router();

router.post('/', addBag);
router.get('/', getAllBags);
router.get('/:id', getBagById);
router.put('/:id', updateBag);
router.delete('/:id', deleteBag);

export default router;