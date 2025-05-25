import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import '../components/icons.js';
import RecipeCard from "../components/RecipeCard";
import RecipeModal from "../components/RecipeModal";
import Footer from "../components/footer.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const normalizeId = (recipe) => recipe._id || recipe.id;

const Home = () => {
    const { user } = useAuthContext();
    const [recipes, setRecipes] = useState([]);
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleRecipeClick = (recipe) => {
        setSelectedRecipe(recipe);
        setIsModalOpen(true);
    };

    const fetchRecipes = async () => {
        try {
            const response = await fetch('/api/recipes', {
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                }
            });

            const json = await response.json();

            if (response.ok) {
                setRecipes(json);
            } else {
                setError("Oops! Failed to load recipes. Please try again later.");
            }
        } catch (err) {
            setError("Something went wrong. Please check your internet connection.");
        } finally {
            setLoading(false);
        }
    };

    const fetchSavedRecipes = async () => {
        try {
            const response = await fetch('/api/saved', {
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setSavedRecipes(data.map(r => normalizeId(r)));
            }
        } catch (err) {
            console.error("Failed to fetch saved recipes");
        }
    };

    const handleSave = async (recipe, shouldSave) => {
        try {
            const endpoint = `/api/saved/${normalizeId(recipe)}`;
            const method = shouldSave ? 'POST' : 'DELETE';

            const res = await fetch(endpoint, {
                method,
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                }
            });

            if (!res.ok) {
                throw new Error('Failed to update saved recipes');
            }

            const data = await res.json(); // Parse backend response which includes savedRecipes array

            // Update savedRecipes state with backend's source of truth
            setSavedRecipes(data.savedRecipes.map(id => id.toString()));
        } catch (err) {
            console.error("Failed to update saved recipes:", err);
            alert("Oops! Couldn't update saved recipes. Try again.");
        }
    };


    useEffect(() => {
        if (user) {
            fetchRecipes();
            fetchSavedRecipes();
        } else {
            setLoading(false);
            setError("Please log in to view recipes.");
        }
    }, [user]);

    useEffect(() => {
        document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';
        return () => document.body.style.overflow = 'auto';
    }, [isModalOpen]);

    if (loading) return <div>Loading recipes...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="home">
            <div className="hero-section">
                <img src="/hermes-rivera-Ww8eQWjMJWk-unsplash.jpg" alt="cooking background" className="hero-img" />
                <div className="hero-overlay">
                    <h1 className="hero-heading">Recipes & Cooking Ideas</h1>
                    <h3 className="hero-tagline">For solo cooks, first-timers, and flavor chasers</h3>
                    <a href="#explore" className="explore-btn">Explore</a>
                </div>
            </div>

            <div className="searchbar-container">
                <div className="search-wrapper">
                    <FontAwesomeIcon icon="search" className="search-icon" />
                    <input type="text" className="search" placeholder="Search for a recipe..." />
                </div>
            </div>

            <h3 className="featured">Featured Recipes...</h3>
            <div className="recipeslist">
                {recipes.map((recipe) => (
                    <RecipeCard
                        key={normalizeId(recipe)}
                        recipe={recipe}
                        onClick={handleRecipeClick}
                        onSave={handleSave}
                        isSaved={savedRecipes.includes(normalizeId(recipe))}
                    />
                ))}
            </div>

            {isModalOpen && (
                <RecipeModal recipe={selectedRecipe} onClose={() => setIsModalOpen(false)} />
            )}

            <Footer />
        </div>
    );
};

export default Home;
