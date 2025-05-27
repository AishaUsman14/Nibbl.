import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/User.js';
import savedRecipesRoutes from './routes/savedRecipes.js';
import recipeRoutes from './routes/recipes.js';
import adminRoutes from './routes/admin.js';
import moderationRoutes from './routes/moderation.js';
import commentsRoutes from './routes/comments.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Custom request logger (good for debugging)
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.path}`);
    next();
});

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/saved', savedRecipesRoutes);
app.use('/api/mod', moderationRoutes);
app.use('/api/admin', adminRoutes); // Now grouped under /api
app.use('/api/comments', commentsRoutes);

// Error handling middleware (catches errors from async)
app.use((err, req, res, next) => {
    console.error("🔥 Server error:", err.stack);
    res.status(500).json({ error: "Something broke!" });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log('✅ Connected to MongoDB');
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Error connecting to MongoDB:", err);
        process.exit(1); // Exit if DB connection fails
    });
