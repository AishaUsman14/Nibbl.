import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import MyRecipeCard from "../components/myRecipeCard.jsx";
import RecipeModal from "../components/RecipeModal.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";

const normalizeId = (recipe) => recipe._id || recipe.id;

const MyRecipes = () => {
    const { user } = useAuthContext();
    const [recipes, setRecipes] = useState([]);
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSavedRecipes = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/saved', {
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch: ${response.status} - ${errorText}`);
            }

            // Avoid parsing JSON on 204 No Content
            const data = response.status !== 204 ? await response.json() : [];

            setRecipes(data);
            setSavedRecipes(data.map(r => r._id || r.id));
        } catch (err) {
            console.error("Error fetching saved recipes:", err.message);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.token) {
            fetchSavedRecipes();
        }
    }, [user?.token]);

    useEffect(() => {
        document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isModalOpen]);

    const handleRecipeClick = (recipe) => {
        setSelectedRecipe(recipe);
        setIsModalOpen(true);
    };

    const handleSave = async (recipe, isSaving) => {
        const method = isSaving ? 'POST' : 'DELETE';

        try {
            const response = await fetch(`/api/saved/${normalizeId(recipe)}`, {
                method,
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to update saved recipes.');

            setSavedRecipes(prev =>
                isSaving
                    ? [...prev, normalizeId(recipe)]
                    : prev.filter(id => id !== normalizeId(recipe))
            );

            if (!isSaving) {
                setRecipes(prev => prev.filter(r => normalizeId(r) !== normalizeId(recipe)));
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    if (loading) return <div className="loading-container"><div className="loading-spinner"></div></div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="my-recipes-container">
            <div className="my-recipes-header">
                <FontAwesomeIcon icon={faBookmark} className="bookmark-icon" />
                <h1>My Saved Recipes</h1>
                <p className="subtitle">Your personal collection of delicious recipes</p>
            </div>
            
            {recipes.length === 0 ? (
                <div className="no-recipes">
                    <p>You haven't saved any recipes yet.</p>
                    <p>Browse recipes and click the heart icon to save them here!</p>
                </div>
            ) : (
                <div className="my-recipes-grid">
                    {recipes.map(recipe => (
                        <MyRecipeCard
                            key={normalizeId(recipe)}
                            recipe={recipe}
                            onClick={handleRecipeClick}
                            onSave={handleSave}
                            isSaved={savedRecipes.includes(normalizeId(recipe))}
                        />
                    ))}
                </div>
            )}
            
            {isModalOpen && (
                <RecipeModal recipe={selectedRecipe} onClose={() => setIsModalOpen(false)} />
            )}
        </div>
    );
};

export default MyRecipes;
