import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLemon, faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { dispatch } = useAuthContext();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error);
        } else {
            localStorage.setItem('user', JSON.stringify(data));
            dispatch({ type: 'LOGIN', payload: data });
            navigate('/login'); // Redirect after successful signup
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <FontAwesomeIcon icon={faLemon} className="auth-icon" />
                    <h1>Join The Zest Club</h1>
                    <p className="auth-subtitle">Create your account and start exploring recipes</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-field">
                        <label htmlFor="username">
                            <FontAwesomeIcon icon={faUser} style={{ marginRight: '5px', fontSize: '0.8rem' }} />
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Choose username"
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="email">
                            <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '5px', fontSize: '0.8rem' }} />
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your email"
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="password">
                            <FontAwesomeIcon icon={faLock} style={{ marginRight: '5px', fontSize: '0.8rem' }} />
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create password"
                            required
                        />
                    </div>

                    <button type="submit" className="auth-button">Sign Up</button>

                    {error && <p className="auth-error">{error}</p>}
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <a href="/login">Login</a></p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
