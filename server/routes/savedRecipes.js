import express from 'express';
const router = express.Router();
import requireAuth from '../middleware/requireAuth.js';
import User from '../models/userModel.js';

// Get all saved recipes for the logged-in user
router.get('/', requireAuth, async (req, res) => {
    try {
        // populate savedRecipes for full recipe details (optional)
        await req.user.populate('savedRecipes');
        res.status(200).json(req.user.savedRecipes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to load saved recipes' });
    }
});

// Save a recipe (add recipe ID to user's savedRecipes array)
router.post('/:recipeId', requireAuth, async (req, res) => {
    const { recipeId } = req.params;

    if (!recipeId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: 'Invalid recipe ID format' });
    }

    try {
        req.user.savedRecipes = req.user.savedRecipes || [];

        if (!req.user.savedRecipes.includes(recipeId)) {
            req.user.savedRecipes.push(recipeId);
            await req.user.save();
        }
        res.status(200).json({ message: 'Recipe saved', savedRecipes: req.user.savedRecipes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save recipe' });
    }
});

// Remove a saved recipe
router.delete('/:recipeId', requireAuth, async (req, res) => {
    const { recipeId } = req.params;

    if (!recipeId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: 'Invalid recipe ID format' });
    }

    try {
        req.user.savedRecipes = req.user.savedRecipes || [];

        req.user.savedRecipes = req.user.savedRecipes.filter(
            (id) => id.toString() !== recipeId
        );
        await req.user.save();
        res.status(200).json({ message: 'Recipe removed', savedRecipes: req.user.savedRecipes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to remove saved recipe' });
    }
});

export default router;
