import Comment from '../models/comments.js'; // adjust path if needed
import Recipe from '../models/recipemodel.js';
import User from '../models/userModel.js';

// GET /admin/recipes
export const getAllRecipes = async (req, res) => {
    try {
        const { sortBy } = req.query;
        const sortOption = sortBy === 'newest' ? { createdAt: -1 } : sortBy === 'popular' ? { rating: -1 } : {};
        const recipes = await Recipe.find().sort(sortOption);
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
};

// POST /admin/recipes
export const createRecipe = async (req, res) => {
    try {
        const newRecipe = new Recipe(req.body);
        await newRecipe.save();
        res.status(201).json(newRecipe);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create recipe' });
    }
};

// PUT /admin/recipes/:id
export const updateRecipe = async (req, res) => {
    try {
        const updated = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ error: 'Recipe not found' });
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update recipe' });
    }
};

// DELETE /admin/recipes/:id
export const deleteRecipe = async (req, res) => {
    try {
        const deleted = await Recipe.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Recipe not found' });
        res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete recipe' });
    }
};

export const approveComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        comment.approved = true;
        await comment.save();

        res.status(200).json({ message: 'Comment approved', comment });
    } catch (error) {
        console.error('Error approving comment:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
// GET /admin/users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Hide password
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

// DELETE /admin/users/:id
export const deleteUser = async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

// PUT /admin/users/:id/role
export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!['admin', 'user'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const updated = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');

        if (!updated) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update role' });
    }
};
// PUT /admin/users/:id
export const updateUser = async (req, res) => {
    try {
        const { username, email } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { username, email },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) return res.status(404).json({ error: 'User not found' });

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
};


