import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLemon, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { dispatch } = useAuthContext();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error);
        } else {
            localStorage.setItem('user', JSON.stringify(data));
            dispatch({ type: 'LOGIN', payload: data });
            navigate('/');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <FontAwesomeIcon icon={faLemon} className="auth-icon" />
                    <h1>Welcome Back</h1>
                    <p className="auth-subtitle">Login to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
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
                            placeholder="Your password"
                            required
                        />
                    </div>

                    <button type="submit" className="auth-button">Login</button>

                    {error && <p className="auth-error">{error}</p>}
                </form>

                <div className="auth-footer">
                    <p>Need an account? <a href="/signup">Sign Up</a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
