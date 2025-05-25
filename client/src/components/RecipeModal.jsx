// components/RecipeModal.jsx
const RecipeModal = ({ recipe, onClose }) => {
    if (!recipe) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>X</button>
                <img src={recipe.image} alt={recipe.title} className="modal-image" />
                <h2>{recipe.title}</h2>
                <p><strong>Prep Time:</strong> {recipe.prepTime} mins</p>
                <p><strong>Servings:</strong> {recipe.servings}</p>
                <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
                <p><strong>Ingredients:</strong></p>
                <ul>
                    {recipe.ingredients.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
                <p><strong>Instructions:</strong></p>
                <p>{recipe.instructions}</p>
                {recipe.tools.length > 0 && (
                    <>
                        <p><strong>Tools:</strong> {recipe.tools.join(", ")}</p>
                    </>
                )}
                {recipe.allergens.length > 0 && (
                    <>
                        <p><strong>Allergens:</strong> {recipe.allergens.join(", ")}</p>
                    </>
                )}

                {/* Placeholder for future rating system */}
                <div className="rating-placeholder">
                    <textarea placeholder="Tel us how much you love it..." className="comment-box" />
                    <div className="stars">⭐ ⭐ ⭐ ⭐ ⭐</div>
                </div>
            </div>
        </div>
    );
};

export default RecipeModal;
