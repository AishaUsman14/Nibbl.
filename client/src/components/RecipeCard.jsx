import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../components/icons.js';

const RecipeCard = ({ recipe, onClick, onSave, isSaved, compact = false }) => {
    const handleSaveClick = (e) => {
        e.stopPropagation();
        onSave(recipe, !isSaved);
    };

    // Function to truncate text to a certain length
    const truncateText = (text, maxLength) => {
        if (!text) return '';
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };

    // Function to render star rating
    const renderStarRating = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating || 0);
        const hasHalfStar = (rating || 0) - fullStars >= 0.5;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<FontAwesomeIcon key={i} icon="star" className="star-icon" style={{color: '#f6d967'}} />);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<FontAwesomeIcon key={i} icon="star-half-alt" className="star-icon" style={{color: '#f6d967'}} />);
            } else {
                stars.push(<FontAwesomeIcon key={i} icon={['far', 'star']} className="star-icon"style={{color: '#f6d967'}}  />);
            }
        }

        return stars;
    };

    return (
        <div
            className={`recipecard ${compact ? 'compact' : ''}`}
            onClick={() => onClick(recipe)}
        >
            <div className="heart-icon" onClick={handleSaveClick}>
                <FontAwesomeIcon
                    icon={isSaved ? 'heart' : ['far', 'heart']}
                    style={{ color: isSaved ? '#fbdb86' : '#fff' }}
                />
            </div>

            {recipe.image ? (
                <img
                    src={recipe.image}
                    alt={recipe.title || recipe.name}
                    loading="lazy"
                />
            ) : (
                <img
                    src="/default-recipe.jpg"
                    alt="Default recipe"
                    loading="lazy"
                />
            )}

            <div className="recipecard-content">
                <div className="recipe-category">
                    {recipe.category && (
                        <span className="category-tag">
                            {recipe.category}
                        </span>
                    )}
                </div>

                <h2 title={recipe.title || recipe.name}>
                    {truncateText(recipe.title || recipe.name, compact ? 20 : 28)}
                </h2>

                <div className="preptime">
                    <FontAwesomeIcon icon="clock" className="clock-icon" />
                    {recipe.prepTime ? `${recipe.prepTime} minutes` : 'Not specified'}
                </div>

                <div className="star-rating">
                    <div className="stars-display">
                        {renderStarRating(recipe.rating)}
                    </div>
                    <span className="rating-number">
                        {recipe.rating ? recipe.rating.toFixed(1) : "New"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default RecipeCard;
