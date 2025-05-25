import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/User.js';
import cors from 'cors';
import dotenv from 'dotenv';
import savedRecipesRoutes from './routes/savedRecipes.js';
import recipeRoutes from './routes/recipes.js';

dotenv.config(); // ✅ Load .env variables

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.path}`);
    next();
});

// Routes
app.use('/api/recipes', recipeRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/saved', savedRecipesRoutes);
// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`✅ Connected to DB`);
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    })
    .catch((err) => console.error("❌ Error connecting to MongoDB:", err));
