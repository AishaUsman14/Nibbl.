import Recipe from '../models/recipemodel.js';
import mongoose from 'mongoose';

// GET all recipes
const getRecipes = async (req, res) => {
    const recipes = await Recipe.find({}).sort({ createdAt: -1 });
    res.status(200).json(recipes);
};

// GET a single recipe by ID
const getRecipe = async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No such recipe' });
    }

    const recipe = await Recipe.findById(id);

    if (!recipe) {
        return res.status(404).json({ error: 'No such recipe' });
    }

    res.status(200).json(recipe);
};

/*
// 🚫 COMMENTED OUT: Only admins should do these

// CREATE a recipe
const createRecipe = async (req, res) => {
    const { title, ingredients, servings, prepTime, instructions, tags, image, allergens, tools, difficulty } = req.body;

    if (!title || !ingredients || !servings || !prepTime || !instructions) {
        return res.status(400).json({ error: 'Please fill all required fields: title, ingredients, servings, prepTime, instructions' });
    }

    if (!Array.isArray(ingredients)) return res.status(400).json({ error: 'Ingredients must be an array of strings' });
    if (typeof title !== 'string') return res.status(400).json({ error: 'Title must be a string' });
    if (typeof servings !== 'number' || servings <= 0) return res.status(400).json({ error: 'Servings must be a positive number' });
    if (typeof prepTime !== 'number' || prepTime <= 0) return res.status(400).json({ error: 'Prep time must be a positive number' });
    if (image && typeof image !== 'string') return res.status(400).json({ error: 'Image must be a string' });
    if (tags && !Array.isArray(tags)) return res.status(400).json({ error: 'Tags must be an array' });
    if (allergens && !Array.isArray(allergens)) return res.status(400).json({ error: 'Allergens must be an array' });
    if (tools && !Array.isArray(tools)) return res.status(400).json({ error: 'Tools must be an array' });
    if (difficulty && typeof difficulty !== 'string') return res.status(400).json({ error: 'Difficulty must be a string' });

    try {
        const recipe = await Recipe.create({
            title,
            ingredients,
            servings,
            prepTime,
            instructions,
            tags,
            image,
            allergens,
            tools,
            difficulty,
            rating: 0,
            numRatings: 0,
            createdBy: req.user._id
        });
        res.status(200).json(recipe);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
};

// UPDATE a recipe
const updateRecipe = async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No such recipe' });
    }

    try {
        const recipe = await Recipe.findOneAndUpdate({ _id: id }, { ...req.body }, { new: true });
        if (!recipe) {
            return res.status(400).json({ error: 'No such recipe' });
        }
        res.status(200).json(recipe);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
};

// DELETE a recipe
const deleteRecipe = async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No such recipe' });
    }

    const recipe = await Recipe.findOneAndDelete({ _id: id });

    if (!recipe) {
        return res.status(400).json({ error: 'No such recipe' });
    }

    res.status(200).json(recipe);
};
*/

export {
    getRecipes,
    getRecipe,
    // createRecipe,
    // updateRecipe,
    // deleteRecipe
};
