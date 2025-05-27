import Comment from '../models/comments.js';
import Recipe from '../models/recipemodel.js';
import User from '../models/userModel.js';

// GET all pending comments
export const getPendingComments = async (req, res) => {
    try {
        const comments = await Comment.find({ approved: false })
            .populate('user', 'username')
            .populate('recipe', 'title');

        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({
            error: 'Failed to fetch pending comments',
            details: err.message
        });
    }
};
export const createComment = async (req, res) => {
    const { rating, text } = req.body;
    const recipeId = req.params.recipeId;
    const userId = req.user._id;

    try {
        // Optional: prevent duplicate comments
        const alreadyCommented = await Comment.findOne({ user: userId, recipe: recipeId });
        if (alreadyCommented) {
            return res.status(400).json({ error: 'You already rated this recipe.' });
        }

        const comment = await Comment.create({
            recipe: recipeId,
            user: userId,
            rating,
            text,
        });

        res.status(201).json({ message: 'Comment submitted and awaiting approval', comment });
    } catch (err) {
        res.status(500).json({ error: 'Failed to submit comment', details: err.message });
    }
};

// APPROVE a comment
export const approveComment = async (req, res) => {
    try {
        console.log('Approving comment ID:', req.params.id);

        // Step 1: Approve the comment
        const comment = await Comment.findByIdAndUpdate(
            req.params.id,
            { approved: true },
            { new: true }
        );

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Step 2: Update the recipe's rating if rating exists
        if (comment.rating !== null) {
            const recipe = await Recipe.findById(comment.recipe);

            if (recipe) {
                const currentTotal = recipe.rating * recipe.numRatings;
                const newTotal = currentTotal + comment.rating;
                const newNumRatings = recipe.numRatings + 1;
                const newAverage = newTotal / newNumRatings;

                recipe.rating = newAverage;
                recipe.numRatings = newNumRatings;

                await recipe.save();
            }
        }

        // Step 3: Return updated list of pending comments
        const updatedComments = await Comment.find({ approved: false })
            .populate('user', 'username')
            .populate('recipe', 'title');

        res.status(200).json({
            message: 'Comment approved and recipe rating updated',
            comment,
            updatedComments
        });

    } catch (err) {
        res.status(500).json({
            error: 'Failed to approve comment',
            details: err.message
        });
    }
};


// DENY (delete) a comment
export const denyComment = async (req, res) => {
    try {
        console.log('Denying comment ID:', req.params.id);  // for dev/debug

        const comment = await Comment.findByIdAndDelete(req.params.id);

        if (!comment) return res.status(404).json({ error: 'Comment not found' });

        const updatedComments = await Comment.find({ approved: false })
            .populate('user', 'username')
            .populate('recipe', 'title');

        res.status(200).json({
            message: 'Comment denied and deleted',
            deletedComment: comment,
            updatedComments
        });
    } catch (err) {
        res.status(500).json({
            error: 'Failed to deny comment',
            details: err.message
        });
    }
};
