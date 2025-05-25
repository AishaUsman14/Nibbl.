import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

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
            navigate('/login'); // redirect to recipes page
        }
    };

    return (
        <div className="signup-container">
            <h1>Join the Zest Club 🍋</h1>
            <form onSubmit={handleSubmit} className="signup-form">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button>Sign Up</button>
                {error && <p className="error-message">{error}</p>}
                <p style={{ fontSize: '14px', textAlign: 'center' }}>
                    Already have an account?<a href="/login" style={{ color: '#f39c12', textDecoration: 'underline' }}>Login</a>
                </p>
            </form>
        </div>
    );
}
    export default Signup;
