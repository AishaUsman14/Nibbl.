import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    ingredients: {
        type: [String],
        required: true
    },
    servings: {
        type: Number,
        required: true
    },
    prepTime: {
        type: Number,
        required: true
    },
    instructions: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        default: []  // e.g., ["vegan", "dessert", "quick"]
    },
    image: {
        type: String  // store a URL or image path
    },
    allergens: {
        type: [String],
        default: []  // e.g., ["gluten", "peanuts"]
    },
    tools: {
        type: [String],
        default: []  // e.g., ["oven", "mixer"]
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'easy'
    },
    rating: {
        type: Number,
        default: 0
    },
    numRatings: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;
