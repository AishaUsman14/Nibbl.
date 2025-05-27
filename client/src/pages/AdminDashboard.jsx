import React, { useState, useEffect } from 'react';
import AddUserOrRecipe from '../components/AddUserOrRecipe'; // Adjust path as needed
import { useAuthContext } from '../hooks/useAuthContext.js';  // Adjust path as needed


const AdminDashboard = () => {
    const { user } = useAuthContext(); // Get user object from AuthContext
    const token = user?.token; // Safely extract token
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentRecipe, setCurrentRecipe] = useState(null);

    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [pendingComments, setPendingComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            if (!token) {
                setError('You must be logged in as admin to view this page.');
                setLoading(false);
                return;
            }

            try {
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                };

                const [usersRes, recipesRes, commentsRes] = await Promise.all([
                    fetch('/api/admin/users', { headers }),
                    fetch('/api/admin/recipes', { headers }),
                    fetch('/api/mod/comments', { headers }),
                ]);

                if (!usersRes.ok) throw new Error('Failed to fetch users');
                if (!recipesRes.ok) throw new Error('Failed to fetch recipes');
                if (!commentsRes.ok) throw new Error('Failed to fetch comments');

                const usersData = await usersRes.json();
                const recipesData = await recipesRes.json();
                const commentsData = await commentsRes.json();

                setUsers(usersData);
                setRecipes(recipesData);
                setPendingComments(commentsData);
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    const handleDeleteRecipe = async (recipeId) => {
        if (!window.confirm('Delete this recipe?')) return;

        try {
            const res = await fetch(`/api/admin/recipes/${recipeId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error('Failed to delete recipe');
            setRecipes(recipes.filter(recipe => recipe._id !== recipeId));
        } catch (err) {
            alert('Error deleting recipe: ' + err.message);
        }
    };
    
    const handleRecipeUpdate = async (e) => {
        e.preventDefault();

        const form = e.target;
        const updatedData = {
            title: form.title.value,
            ingredients: form.ingredients.value.split(',').map(i => i.trim()),
            cookingTime: parseInt(form.cookingTime.value),
            category: form.category.value,
            tools: form.tools.value.split(',').map(t => t.trim()),
            image: form.image.value,
        };

        try {
            const res = await fetch(`/api/admin/recipes/${currentRecipe._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedData),
            });

            if (!res.ok) throw new Error('Failed to update recipe');
            const updatedRecipe = await res.json();

            setRecipes(recipes.map(r => r._id === currentRecipe._id ? updatedRecipe : r));
            setShowEditModal(false);
            setCurrentRecipe(null);
        } catch (err) {
            alert('Error updating recipe: ' + err.message);
        }
    };

    const handleEditRecipe = (recipe) => {
        setCurrentRecipe(recipe);
        setShowEditModal(true);
    };

    const handleApprove = async (commentId) => {
        try {
            const res = await fetch(`/api/mod/comments/${commentId}/approve`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error('Failed to approve comment');
            // Remove approved comment from UI
            setPendingComments(prev => prev.filter(c => c._id !== commentId));
        } catch (err) {
            console.error(err);
            alert('Error approving comment');
        }
    };
    
    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error('Failed to delete user');
            setUsers(users.filter(user => user._id !== userId));
        } catch (err) {
            alert('Error deleting user: ' + err.message);
        }
    };

    const handleToggleUserStatus = async (userId, disable) => {
        try {
            const res = await fetch(`/api/admin/users/${userId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ disabled: disable }),
            });

            if (!res.ok) throw new Error('Failed to update user status');
            const updated = await res.json();
            setUsers(users.map(u => (u._id === userId ? updated : u)));
        } catch (err) {
            alert('Error updating status: ' + err.message);
        }
    };

    const handleDeny = async (commentId) => {
        try {
            const res = await fetch(`/api/mod/comments/${commentId}/deny`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error('Failed to deny comment');
            setPendingComments(prev => prev.filter(c => c._id !== commentId));
        } catch (err) {
            console.error(err);
            alert('Error denying comment');
        }
    };

    return (
        <div className="admin-dashboard">
            <nav className="admin-sidebar">
                <h2 className="admin-title">Admin Panel</h2>
                <button 
                    className={`nav-button ${activeTab === 'users' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('users')}
                >
                    Users
                </button>
                <button 
                    className={`nav-button ${activeTab === 'recipes' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('recipes')}
                >
                    Recipes
                </button>
                <button 
                    className={`nav-button ${activeTab === 'comments' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('comments')}
                >
                    Pending Comments
                </button>
                <button 
                    className={`nav-button ${activeTab === 'add' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('add')}
                >
                    Add User/Recipe
                </button>
            </nav>

            <main className="admin-main">
                {loading && <p>Loading data...</p>}
                {error && <p className="error-message">{error}</p>}

                {!loading && !error && (
                    <>
                        {activeTab === 'users' && (
                            <>
                                <h2>Users</h2>
                                <table className="admin-table">
                                    <thead>
                                    <tr>
                                        <th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {users.length === 0 ? (
                                        <tr><td colSpan="6">No users found.</td></tr>
                                    ) : (
                                        users.map(user => (
                                            <tr key={user._id}>
                                                <td>{user._id}</td>
                                                <td>{user.username}</td>
                                                <td>{user.email}</td>
                                                <td>{user.role}</td>
                                                <td>{user.disabled ? 'Suspended' : 'Active'}</td>
                                                <td>
                                                    <button onClick={() => handleToggleUserStatus(user._id, !user.disabled)}>
                                                        {user.disabled ? 'Enable' : 'Suspend'}
                                                    </button>
                                                    <button className="delete-button" onClick={() => handleDeleteUser(user._id)}>
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                </table>
                            </>
                        )}

                        {activeTab === 'recipes' && (
                            <>
                                <h2>Recipes</h2>
                                <table className="admin-table">
                                    <thead>
                                    <tr>
                                        <th>ID</th><th>Title</th><th>Rating</th><th>Num Ratings</th><th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {recipes.length === 0 ? (
                                        <tr><td colSpan="5">No recipes found.</td></tr>
                                    ) : (
                                        recipes.map(recipe => (
                                            <tr key={recipe._id}>
                                                <td>{recipe._id}</td>
                                                <td>{recipe.title}</td>
                                                <td>{recipe.rating?.toFixed(2) || 'N/A'}</td>
                                                <td>{recipe.numRatings || 0}</td>
                                                <td>
                                                    <button onClick={() => handleEditRecipe(recipe)}>Edit</button>
                                                    <button className="delete-button" onClick={() => handleDeleteRecipe(recipe._id)}>Delete</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                </table>
                            </>
                        )}

                        {activeTab === 'comments' && (
                            <>
                                <h2>Pending Comments</h2>
                                <table className="admin-table">
                                    <thead>
                                    <tr>
                                        <th>ID</th><th>User</th><th>Recipe</th><th>Rating</th><th>Text</th><th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {pendingComments.length === 0 ? (
                                        <tr><td colSpan="6">No pending comments.</td></tr>
                                    ) : (
                                        pendingComments.map(comment => (
                                            <tr key={comment._id}>
                                                <td>{comment._id}</td>
                                                <td>{comment.user?.username || 'Unknown'}</td>
                                                <td>{comment.recipe?.title || 'Unknown'}</td>
                                                <td>{comment.rating || 'N/A'}</td>
                                                <td>{comment.text || ''}</td>
                                                <td>
                                                    <button className="approve-button" onClick={() => handleApprove(comment._id)}>✅ Approve</button>
                                                    <button className="deny-button" onClick={() => handleDeny(comment._id)}>❌ Deny</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                </table>
                            </>
                        )}

                        {activeTab === 'add' && <AddUserOrRecipe />}
                    </>
                )}
            </main>
            
            {showEditModal && currentRecipe && (
                <div className="modal-overlay">
                    <form onSubmit={handleRecipeUpdate} className="edit-recipe-form">
                        <h3>Edit Recipe</h3>
                        <label>Title:</label>
                        <input name="title" defaultValue={currentRecipe.title} required className="form-input" />

                        <label>Ingredients (comma-separated):</label>
                        <input name="ingredients" defaultValue={currentRecipe.ingredients.join(', ')} required className="form-input" />

                        <label>Cooking Time (mins):</label>
                        <input type="number" name="cookingTime" defaultValue={currentRecipe.cookingTime} required className="form-input" />

                        <label>Category:</label>
                        <input name="category" defaultValue={currentRecipe.category} required className="form-input" />

                        <label>Tools (comma-separated):</label>
                        <input name="tools" defaultValue={currentRecipe.tools.join(', ')} required className="form-input" />

                        <label>Image URL:</label>
                        <input name="image" defaultValue={currentRecipe.image} required className="form-input" />

                        <div className="form-buttons">
                            <button type="submit" className="save-button">Save</button>
                            <button type="button" onClick={() => { setShowEditModal(false); setCurrentRecipe(null); }} className="cancel-button">Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
