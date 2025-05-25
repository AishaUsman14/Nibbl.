import { useState, useEffect } from 'react';
import './icons.js'; // your FontAwesome icons setup
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const RecipeCard = ({ recipe, onClick, onSave, isSaved }) => {
    const [isHeartFilled, setIsHeartFilled] = useState(isSaved);

    useEffect(() => {
        setIsHeartFilled(isSaved); // Sync when saved state changes
    }, [isSaved]);

    const handleHeartClick = async (e) => {
        e.stopPropagation();
        const newState = !isHeartFilled;
        setIsHeartFilled(newState); // Optimistic UI update

        try {
            await onSave(recipe, newState);
        } catch (error) {
            // Revert UI if API call fails
            setIsHeartFilled(!newState);
            alert('Failed to update saved recipes. Please try again.');
        }
    };

    return (
        <div className="recipecard" onClick={() => onClick(recipe)} style={{ cursor: 'pointer' }}>
            <img src={recipe.image} alt={recipe.title} />
            <div className="recipecard-content">
                <h2>{recipe.title}</h2>
                <p className="preptime">
                    <FontAwesomeIcon icon="clock" className="clock-icon" />
                    <span> {recipe.prepTime} minutes</span>
                </p>
            </div>

            <div className="star-rating">
                {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon key={i} icon="star" className="star-icon" style={{ color: '#FFD700' }} />
                ))}
            </div>

            <div
                className="heart-icon"
                onClick={handleHeartClick}
                aria-label={isHeartFilled ? "Remove from favorites" : "Add to favorites"}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleHeartClick(e);
                }}
            >
                <FontAwesomeIcon
                    icon="heart"
                    style={{ color: isHeartFilled ? '#ffc122' : 'rgba(255,255,255,0.92)' }}
                />
            </div>
        </div>
    );
};

export default RecipeCard;
