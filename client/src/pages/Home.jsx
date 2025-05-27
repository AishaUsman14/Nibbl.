import {useState, useEffect, useRef} from "react";
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
    const [searchTerm, setSearchTerm] = useState('');
    const exploreRef = useRef(null);

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
    const scrollToExplore = () => {
        exploreRef.current.scrollIntoView({ behavior: 'smooth' });
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

            const data = await res.json(); // backend response with savedRecipes array

            setSavedRecipes(data.savedRecipes.map(id => id.toString()));
        } catch (err) {
            console.error("Failed to update saved recipes:", err);
            alert("Oops! Couldn't update saved recipes. Try again.");
        }
    };

    // Filter recipes based on searchTerm (case-insensitive)
    const filteredRecipes = recipes.filter(recipe => {
        const title = recipe.title || recipe.name || '';
        return title.toLowerCase().includes(searchTerm.toLowerCase());
    });

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
        return () => (document.body.style.overflow = 'auto');
    }, [isModalOpen]);

    if (loading) return <div>Loading recipes...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="home">

            <div className="hero-section">
                <img
                    src="/hermes-rivera-Ww8eQWjMJWk-unsplash.jpg"
                    alt="cooking background"
                    className="hero-img"
                />
                <div className="hero-overlay">
                    <h1 className="hero-heading">Discover Delicious <span className="highlight">Recipes</span></h1>
                    <h3 className="hero-tagline">For solo cooks, first-timers, and flavor chasers</h3>
                    <button className="explore-btn" onClick={scrollToExplore}>
                        Start Cooking
                        <FontAwesomeIcon icon="utensils" className="cta-icon" />
                    </button>
                </div>
            </div>

            <div className="searchbar-container">
                <div className="search-wrapper">
                    <FontAwesomeIcon icon="search" className="search-icon" />
                    <input
                        type="text"
                        className="search"
                        placeholder="Find the perfect recipe for any occasion."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <h3 className="featured" ref={exploreRef} >Explore All Recipes.</h3>

            <div className="recipeslist">
                {filteredRecipes.length === 0 ? (
                    <p className="no-results">No recipes found matching your search.</p>
                ) : (
                    filteredRecipes.map(recipe => (
                        <RecipeCard
                            key={normalizeId(recipe)}
                            recipe={recipe}
                            onClick={handleRecipeClick}
                            onSave={handleSave}
                            isSaved={savedRecipes.includes(normalizeId(recipe))}
                        />
                    ))
                )}
            </div>


            {isModalOpen && (
                <RecipeModal recipe={selectedRecipe} onClose={() => setIsModalOpen(false)} />
            )}

        </div>
    );
};

export default Home;
