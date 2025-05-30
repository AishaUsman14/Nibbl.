import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthContext } from "../hooks/useAuthContext.js";
import { faStar, faClock, faUsers, faChartSimple, faUtensils, faExclamationCircle, faTimes, faComment, faUser } from "@fortawesome/free-solid-svg-icons";

const RecipeModal = ({ recipe, onClose }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const { user } = useAuthContext();
    const token = user?.token;

    // Fetch comments when modal opens
    useEffect(() => {
        const fetchComments = async () => {
            setCommentsLoading(true);
            try {
                const response = await fetch(`/api/comments/${recipe._id}`, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                    }
                });
                
                if (!response.ok) {
                    throw new Error("Failed to fetch comments");
                }
                
                const data = await response.json();
                setComments(data);
            } catch (err) {
                console.error("Error fetching comments:", err);
            } finally {
                setCommentsLoading(false);
            }
        };
        
        if (recipe._id) {
            fetchComments();
        }
    }, [recipe._id, token]);

    const handleSubmit = async () => {
        if (!token) {
            setError("You must be logged in to submit a rating.");
            return;
        }
        if (rating === 0) {
            setError("Please select a star rating before submitting.");
            return;
        }

        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const res = await fetch(`/api/mod/rate/${recipe._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ rating, text: comment }),
            });

            if (!res.ok) throw new Error("Failed to submit rating. You have already rated this recipe or your rating is pending approval.");

            setMessage("Thanks for your rating! Your comment is awaiting approval.");
            setRating(0);
            setComment("");
        } catch (err) {
            setError(err.message || "Error submitting rating.");
        } finally {
            setLoading(false);
        }
    };

    // Helper function to render star rating
    const renderStars = (ratingValue) => {
        return (
            <div className="comment-stars">
                {[...Array(5)].map((_, index) => (
                    <FontAwesomeIcon
                        key={index}
                        icon={faStar}
                        className={`star-icon ${index < ratingValue ? 'active' : ''}`}
                    />
                ))}
            </div>
        );
    };

    // Format date for comments
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content "  onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                
                <div className="modal-header">
                    <img src={recipe.image} alt={recipe.title} className="modal-image" />
                    <h2>{recipe.title}</h2>
                </div>
                
                <div className="modal-info-grid">
                    <div className="modal-info-item">
                        <FontAwesomeIcon icon={faClock} className="modal-icon" />
                        <div>
                            <span className="modal-info-label">Prep Time</span>
                            <span className="modal-info-value">{recipe.prepTime} mins</span>
                        </div>
                    </div>
                    
                    <div className="modal-info-item">
                        <FontAwesomeIcon icon={faUsers} className="modal-icon" />
                        <div>
                            <span className="modal-info-label">Servings</span>
                            <span className="modal-info-value">{recipe.servings}</span>
                        </div>
                    </div>
                    
                    <div className="modal-info-item">
                        <FontAwesomeIcon icon={faChartSimple} className="modal-icon" />
                        <div>
                            <span className="modal-info-label">Difficulty</span>
                            <span className="modal-info-value">{recipe.difficulty}</span>
                        </div>
                    </div>
                </div>
                
                <div className="modal-section">
                    <h3>Ingredients</h3>
                    <ul className="ingredients-list">
                        {recipe.ingredients.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                </div>
                
                <div className="modal-section">
                    <h3>Instructions</h3>
                    <p className="instructions-text">{recipe.instructions}</p>
                </div>

                {recipe.tools.length > 0 && (
                    <div className="modal-section modal-tools">
                        <h3><FontAwesomeIcon icon={faUtensils} /> Tools</h3>
                        <div className="tools-list">
                            {recipe.tools.map((tool, idx) => (
                                <span key={idx} className="tool-tag">{tool}</span>
                            ))}
                        </div>
                    </div>
                )}
                
                {recipe.allergens.length > 0 && (
                    <div className="modal-section modal-allergens">
                        <h3><FontAwesomeIcon icon={faExclamationCircle} /> Allergens</h3>
                        <div className="allergens-list">
                            {recipe.allergens.map((allergen, idx) => (
                                <span key={idx} className="allergen-tag">{allergen}</span>
                            ))}
                        </div>
                    </div>
                )}
                <div className="modal-divider"></div>
                <div className="rating-section">
                    <h3>Rate this Recipe</h3>
                    <div className="rating-input-container">
                        <textarea
                            placeholder="Share your thoughts about this recipe..."
                            className="comment-box"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            disabled={loading}
                        />

                        <div className="stars-container">
                            <div className="stars">
                                {[...Array(5)].map((_, index) => {
                                    const starValue = index + 1;
                                    return (
                                        <FontAwesomeIcon
                                            key={index}
                                            icon={faStar}
                                            className={`star-icon ${starValue <= (hover || rating) ? 'active' : ''}`}
                                            onClick={() => !loading && setRating(starValue)}
                                            onMouseEnter={() => !loading && setHover(starValue)}
                                            onMouseLeave={() => !loading && setHover(0)}
                                        />
                                    );
                                })}
                            </div>

                            {rating > 0 && (
                                <p className="rating-confirmation">
                                    You gave this <strong>{rating}</strong> star{rating > 1 ? "s" : ""}!
                                </p>
                            )}
                        </div>

                        {message && <p className="rating-success">{message}</p>}
                        {error && <p className="rating-error">{error}</p>}

                        <button
                            className="rating-submit-btn"
                            onClick={handleSubmit}
                            disabled={loading || !token || rating === 0}
                        >
                            {loading ? "Submitting..." : "Submit Rating"}
                        </button>
                    </div>
                </div>
                <div className="modal-divider"></div>

                {/* Comments Section */}
                <div className="modal-section comments-section">
                    <h3>
                        <FontAwesomeIcon icon={faComment} /> 
                        Reviews {comments.length > 0 && `(${comments.length})`}
                    </h3>

                    {commentsLoading ? (
                        <div className="comments-loading">Loading reviews...</div>
                    ) : comments.length > 0 ? (
                        <div className="comments-list">
                            {comments.map((comment) => (
                                <div key={comment._id} className="comment-card">
                                    <div className="comment-header">
                                        <div className="comment-user">
                                            <FontAwesomeIcon icon={faUser} className="comment-user-icon" />
                                            <span className="comment-username">{comment.user.username}</span>
                                        </div>
                                        <div className="comment-date">{formatDate(comment.createdAt)}</div>
                                    </div>
                                    <div className="comment-rating">
                                        {renderStars(comment.rating)}
                                    </div>
                                    <p className="comment-text">{comment.text}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-comments">
                            <p>No reviews yet. Be the first to review this recipe!</p>
                        </div>
                    )}
                </div>


            </div>
        </div>
    );
};

export default RecipeModal;
