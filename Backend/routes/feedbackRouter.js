import express from 'express';
import { verifyToken, requireRole } from '../utils/authHelpers.js';
import { createFeedback, listApprovedFeedback, listPendingFeedback, approveFeedback, deleteFeedback } from '../controllers/feedbackController.js';

const router = express.Router();

router.post('/', verifyToken, createFeedback);
router.get('/approved', listApprovedFeedback);

router.get('/pending', verifyToken, requireRole('admin'), listPendingFeedback);
router.put('/:id/approve', verifyToken, requireRole('admin'), approveFeedback);
router.delete('/:id', verifyToken, requireRole('admin'), deleteFeedback);

export default router;


