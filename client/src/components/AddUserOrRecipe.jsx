import React, { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext'; // Adjust path as needed

const AddUserOrRecipe = () => {
    const { user } = useAuthContext();

    const [formType, setFormType] = useState('user');
    const [formData, setFormData] = useState({
        // User
        username: '',
        email: '',
        password: '',
        role: 'user',

        // Recipe
        title: '',
        ingredients: '',
        servings: '',
        prepTime: '',
        instructions: '',
        tags: '',
        image: '',
        allergens: '',
        tools: '',
        difficulty: 'easy',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMsg('');

        if (!user || !user.token) {
            setError('You must be logged in as an admin to perform this action.');
            setLoading(false);
            return;
        }

        try {
            let url = '';
            let payload = {};

            if (formType === 'user') {
                url = '/api/admin/users';

                if (!formData.username || !formData.email || !formData.password) {
                    throw new Error('Please fill in all user fields');
                }

                payload = {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                };
            } else {
                url = '/api/admin/recipes';

                if (
                    !formData.title ||
                    !formData.ingredients ||
                    !formData.servings ||
                    !formData.prepTime ||
                    !formData.instructions
                ) {
                    throw new Error('Please fill in all required recipe fields');
                }

                payload = {
                    title: formData.title,
                    ingredients: formData.ingredients.split(',').map(s => s.trim()),
                    servings: parseInt(formData.servings),
                    prepTime: parseInt(formData.prepTime),
                    instructions: formData.instructions,
                    tags: formData.tags ? formData.tags.split(',').map(s => s.trim()) : [],
                    image: formData.image,
                    allergens: formData.allergens ? formData.allergens.split(',').map(s => s.trim()) : [],
                    tools: formData.tools ? formData.tools.split(',').map(s => s.trim()) : [],
                    difficulty: formData.difficulty,
                };
            }

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to submit');
            }

            setSuccessMsg(`${formType === 'user' ? 'User' : 'Recipe'} added successfully!`);
            setFormData({
                username: '',
                email: '',
                password: '',
                role: 'user',
                title: '',
                ingredients: '',
                servings: '',
                prepTime: '',
                instructions: '',
                tags: '',
                image: '',
                allergens: '',
                tools: '',
                difficulty: 'easy',
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-form-container">
            {/* Toggle Buttons */}
            <div className="form-toggle">
                <button
                    type="button"
                    className={`toggle-button ${formType === 'user' ? 'active' : ''}`}
                    onClick={() => setFormType('user')}
                >
                    Add User
                </button>
                <button
                    type="button"
                    className={`toggle-button ${formType === 'recipe' ? 'active' : ''}`}
                    onClick={() => setFormType('recipe')}
                >
                    Add Recipe
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="admin-form">
                {formType === 'user' ? (
                    <>
                        <Input label="Username" name="username" value={formData.username} onChange={handleChange} />
                        <Input label="Email" name="email" value={formData.email} onChange={handleChange} type="email" />
                        <Input label="Password" name="password" value={formData.password} onChange={handleChange} type="password" />
                        <Select label="Role" name="role" value={formData.role} onChange={handleChange} options={['user', 'admin']} />
                    </>
                ) : (
                    <>
                        <Input label="Title" name="title" value={formData.title} onChange={handleChange} />
                        <Input label="Ingredients (comma separated)" name="ingredients" value={formData.ingredients} onChange={handleChange} />
                        <Input label="Servings" name="servings" value={formData.servings} onChange={handleChange} type="number" />
                        <Input label="Prep Time (in minutes)" name="prepTime" value={formData.prepTime} onChange={handleChange} type="number" />
                        <Textarea label="Instructions" name="instructions" value={formData.instructions} onChange={handleChange} />
                        <Input label="Tags (comma separated)" name="tags" value={formData.tags} onChange={handleChange} />
                        <Input label="Image URL" name="image" value={formData.image} onChange={handleChange} />
                        <Input label="Allergens (comma separated)" name="allergens" value={formData.allergens} onChange={handleChange} />
                        <Input label="Tools (comma separated)" name="tools" value={formData.tools} onChange={handleChange} />
                        <Select label="Difficulty" name="difficulty" value={formData.difficulty} onChange={handleChange} options={['easy', 'medium', 'hard']} />
                    </>
                )}

                <button type="submit" disabled={loading} className="submit-button">
                    {loading ? 'Submitting...' : `Add ${formType === 'user' ? 'User' : 'Recipe'}`}
                </button>

                {error && <p className="error-message">{error}</p>}
                {successMsg && <p className="success-message">{successMsg}</p>}
            </form>
        </div>
    );
};

// Reusable input components
const Input = ({ label, name, value, onChange, type = 'text' }) => (
    <div className="form-group">
        <label>{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            required
            className="form-input"
        />
    </div>
);

const Textarea = ({ label, name, value, onChange }) => (
    <div className="form-group">
        <label>{label}</label>
        <textarea
            name={name}
            value={value}
            onChange={onChange}
            required
            className="form-input"
        />
    </div>
);

const Select = ({ label, name, value, onChange, options }) => (
    <div className="form-group">
        <label>{label}</label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            className="form-input"
        >
            {options.map(opt => (
                <option key={opt} value={opt}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
            ))}
        </select>
    </div>
);

export default AddUserOrRecipe;
