import express from 'express';
import {
  addJewellery,
  getJewellery,
  getJewelleryById,
  updateJewellery,
  deleteJewellery,
} from '../controllers/jewellery/jewelleryController.js';

const router = express.Router();

router.post('/add', addJewellery);
router.get('/all', getJewellery);
router.get('/:id', getJewelleryById);
router.put('/:id', updateJewellery);
router.delete('/:id', deleteJewellery);

export default router;