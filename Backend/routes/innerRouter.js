import express from 'express';
import {
  addInner,
  getInner,
  getInnerById,
  updateInner,
  deleteInner,
} from '../controllers/lingeries/innerController.js';

const router = express.Router();

router.post('/', addInner);
router.get('/', getInner);
router.get('/:id', getInnerById);
router.put('/:id', updateInner);
router.delete('/:id', deleteInner);

export default router;