
import Recipe from '../models/recipemodel.js';

import mongoose from 'mongoose';

const getRecipes = async (req, res) => {
    const recipes = await Recipe.find({}).sort({ createdAt: -1 });
    res.status(200).json(recipes);
}
const getRecipe = async (req,res) => {
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: 'No such recipe'});
    }
    const recipe = await Recipe.findById(id);
    if(!recipe){
        return res.status(404).json({error:'No such recipe'});
    }
    res.status(200).json(recipe);
}

const createRecipe = async (req, res) => {
    const { title, ingredients, servings, prepTime, instructions, tags, image, allergens, tools, difficulty } = req.body;

    // Validate required fields
    if (!title || !ingredients || !servings || !prepTime || !instructions) {
        return res.status(400).json({ error: 'Please fill all required fields: title, ingredients, servings, prepTime, instructions' });
    }

    // Validate data types for some fields
    if (!Array.isArray(ingredients)) {
        return res.status(400).json({ error: 'Ingredients must be an array of strings' });
    }
    if (typeof title !== 'string') {
        return res.status(400).json({ error: 'Title must be a string' });
    }
    if (typeof servings !== 'number' || servings <= 0) {
        return res.status(400).json({ error: 'Servings must be a positive number' });
    }
    if (typeof prepTime !== 'number' || prepTime <= 0) {
        return res.status(400).json({ error: 'Prep time must be a positive number' });
    }
    if (image && typeof image !== 'string') {
        return res.status(400).json({ error: 'Image must be a string (URL or file path)' });
    }

    // Validate optional fields: Allow empty arrays or null if not provided
    if (tags && !Array.isArray(tags)) {
        return res.status(400).json({ error: 'Tags must be an array' });
    }
    if (allergens && !Array.isArray(allergens)) {
        return res.status(400).json({ error: 'Allergens must be an array' });
    }
    if (tools && !Array.isArray(tools)) {
        return res.status(400).json({ error: 'Tools must be an array' });
    }
    if (difficulty && typeof difficulty !== 'string') {
        return res.status(400).json({ error: 'Difficulty must be a string' });
    }

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
            rating: 0,  // Default to 0
            numRatings: 0,  // Default to 0
            createdBy: req.user._id // 🔥 here's the connection
        });
        res.status(200).json(recipe);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
};

const updateRecipe = async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No such recipe' });
    }

    const { title, ingredients, servings, prepTime, instructions, tags, image, allergens, tools, difficulty } = req.body;

    // Validate required fields
    if (!title || !ingredients || !servings || !prepTime || !instructions) {
        return res.status(400).json({ error: 'Please fill all required fields: title, ingredients, servings, prepTime, instructions' });
    }

    // Validate data types for some fields
    if (!Array.isArray(ingredients)) {
        return res.status(400).json({ error: 'Ingredients must be an array of strings' });
    }
    if (typeof title !== 'string') {
        return res.status(400).json({ error: 'Title must be a string' });
    }
    if (typeof servings !== 'number' || servings <= 0) {
        return res.status(400).json({ error: 'Servings must be a positive number' });
    }
    if (typeof prepTime !== 'number' || prepTime <= 0) {
        return res.status(400).json({ error: 'Prep time must be a positive number' });
    }
    if (image && typeof image !== 'string') {
        return res.status(400).json({ error: 'Image must be a string (URL or file path)' });
    }

    // Validate optional fields: Allow empty arrays or null if not provided
    if (tags && !Array.isArray(tags)) {
        return res.status(400).json({ error: 'Tags must be an array' });
    }
    if (allergens && !Array.isArray(allergens)) {
        return res.status(400).json({ error: 'Allergens must be an array' });
    }
    if (tools && !Array.isArray(tools)) {
        return res.status(400).json({ error: 'Tools must be an array' });
    }
    if (difficulty && typeof difficulty !== 'string') {
        return res.status(400).json({ error: 'Difficulty must be a string' });
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

const deleteRecipe = async (req,res) => {
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: 'No such recipe'});
    }
    const recipe = await Recipe.findOneAndDelete({_id: id});
    if(!recipe){
       return res.status(400).json({error: 'No such recipe'});
    }
    res.status(200).json(recipe);
}

export {
    getRecipes,
    getRecipe,
    createRecipe,
    updateRecipe,
    deleteRecipe
};