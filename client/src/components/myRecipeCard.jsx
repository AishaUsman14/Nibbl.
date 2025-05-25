
// myRecipeCard.jsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MyRecipeCard = ({ recipe, onClick }) => {
    return (
        <div className="myrecipecard" onClick={() => onClick(recipe)} style={{ maxWidth: '600px', padding: '16px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <h2>{recipe.title}</h2>
            <p className="preptime">
                <FontAwesomeIcon icon="clock" className="clock-icon" />
                <span> {recipe.prepTime} minutes</span>
            </p>
            <div className="star-rating">
                {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon key={i} icon="star" className="star-icon" style={{ color: '#FFD700' }} />
                ))}
            </div>
        </div>
    );
};

export default MyRecipeCard;