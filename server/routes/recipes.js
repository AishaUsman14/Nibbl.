import express from 'express';
import requireAuth from '../middleware/requireAuth.js';
import { getRecipes, getRecipe
    // , createRecipe, updateRecipe, deleteRecipe
} from '../controllers/recipeController.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', getRecipes);
router.get('/:id', getRecipe);
// You need to add this route to your existing recipe routes file

// Add this new route to check if a user has already rated a specific recipe
router.get('/:id/user-rating', requireAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const recipeId = req.params.id;

        // Check for approved ratings
        const approvedRating = await Comment.findOne({
            user: userId,
            recipe: recipeId,
            approved: true
        });

        // Check for pending ratings
        const pendingRating = await Comment.findOne({
            user: userId,
            recipe: recipeId,
            approved: false
        });

        res.status(200).json({
            hasApprovedRating: !!approvedRating,
            hasPendingRating: !!pendingRating
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ...existing routes...

// 🔒 Routes below are admin-only, moved to admin controller
// router.post('/', createRecipe);
// router.patch('/:id', updateRecipe);
// router.delete('/:id', deleteRecipe);

export default router;
