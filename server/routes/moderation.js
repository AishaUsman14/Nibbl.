import express from 'express';
import requireAuth from '../middleware/requireAuth.js';
import isAdmin from '../middleware/isAdmin.js';
import { getPendingComments, approveComment, denyComment, createComment } from '../controllers/commentController.js';

const router = express.Router();

// Public to logged-in users
router.post('/rate/:recipeId', requireAuth, createComment);

// Admin-only routes
router.use(requireAuth);
router.use(isAdmin);

router.get('/comments', getPendingComments);
router.patch('/comments/:id/approve', approveComment);
router.delete('/comments/:id/deny', denyComment);

export default router;
