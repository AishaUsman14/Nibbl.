import express from  'express';
const router = express.Router();
import {approveComment, updateUser} from '../controllers/adminController.js';
import {
    getAllUsers,
    deleteUser,
    updateUserRole
} from '../controllers/adminController.js';
import  requireAuth  from '../middleware/requireAuth.js';
import  isAdmin  from '../middleware/isAdmin.js';
import {
    getAllRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe
} from '../controllers/adminController.js';



// Admin-only route to approve a comment
router.put('/comments/:id/approve', requireAuth, isAdmin, approveComment);

// Middleware stack: logged in + is admin
router.use(requireAuth);
router.use(isAdmin);
// Users: UPDATE user details
router.put('/users/:id', updateUser);

// Get all recipes (with optional query filters)
router.get('/recipes', getAllRecipes);

// Add a new recipe
router.post('/recipes', createRecipe);

// Update a recipe
router.put('/recipes/:id', updateRecipe);

// Delete a recipe
router.delete('/recipes/:id', deleteRecipe);

// Users: GET all
router.get('/users', getAllUsers);

// Users: DELETE
router.delete('/users/:id', deleteUser);

// (optional) Users: Update role (promote/demote admin)
router.put('/users/:id/role', updateUserRole);

export default router;
