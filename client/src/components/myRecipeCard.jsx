import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faStar, faHeart, faUtensils, faTrash } from "@fortawesome/free-solid-svg-icons";

const MyRecipeCard = ({ recipe, onClick, onSave, isSaved }) => {
    const handleSaveClick = (e) => {
        e.stopPropagation();
        onSave(recipe, !isSaved);
    };

    // Calculate rating display
    const rating = recipe.rating || 0;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
        <div className="myrecipecard">
            <div className="myrecipecard-content-wrapper">
                <div className="myrecipecard-image-container">
                    <img 
                        src={recipe.image || 'https://via.placeholder.com/300x200?text=No+Image'} 
                        alt={recipe.title} 
                        className="myrecipecard-image"
                    />
                </div>
                
                <div className="myrecipecard-content">
                    <h2 className="myrecipecard-title">{recipe.title}</h2>
                    
                    <div className="myrecipecard-info">
                        <div className="myrecipecard-details">
                            <div className="myrecipecard-time">
                                <FontAwesomeIcon icon={faClock} className="icon" />
                                <span>{recipe.prepTime || recipe.cookingTime || 30} mins</span>
                            </div>
                            
                            {recipe.category && (
                                <div className="myrecipecard-category">
                                    <FontAwesomeIcon icon={faUtensils} className="icon" />
                                    <span>{recipe.category}</span>
                                </div>
                            )}
                        </div>
                        
                        <div className="myrecipecard-rating">
                            {[...Array(5)].map((_, i) => (
                                <FontAwesomeIcon 
                                    key={i} 
                                    icon={faStar} 
                                    className={`star-icon ${
                                        i < fullStars ? 'full' : 
                                        (i === fullStars && hasHalfStar) ? 'half' : 'empty'
                                    }`} 
                                />
                            ))}
                            <span className="rating-count">
                                ({recipe.numRatings || 0})
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="myrecipecard-actions">
                <button 
                    className="view-recipe-btn"
                    onClick={() => onClick(recipe)}
                >
                    View Recipe
                </button>
                <button 
                    className="remove-recipe-btn"
                    onClick={handleSaveClick}
                    aria-label={isSaved ? "Unsave recipe" : "Save recipe"}
                >
                    <FontAwesomeIcon icon={faTrash} />
                    <span>Remove</span>
                </button>
            </div>
        </div>
    );
};

export default MyRecipeCard;
