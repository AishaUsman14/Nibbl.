import express from 'express'
import requireAuth from "../middleware/requireAuth.js";
import { createRecipe, getRecipe, getRecipes, updateRecipe, deleteRecipe } from '../controllers/recipeController.js';
const router = express.Router();

router.use(requireAuth);
router.get('/',getRecipes);

router.get('/:id',getRecipe);

router.post('/',createRecipe);


router.patch('/:id',updateRecipe);

router.delete('/:id',deleteRecipe);

export default router;