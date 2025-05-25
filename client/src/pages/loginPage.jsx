import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const {dispatch} = useAuthContext();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        });

        const data = await res.json();
        if (!res.ok) {
            setError(data.error);
        } else {
            localStorage.setItem('user', JSON.stringify(data));
            dispatch({type: 'LOGIN', payload: data});
            navigate('/');
        }
    };

    return (
        <div className="login-container">
            <h1>Login to Zest 🍋</h1>
            <form onSubmit={handleSubmit} className="login-form">
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
                <button>Login</button>
                {error && <p className="error-message">{error}</p>}
                <p style={{ fontSize: '14px', textAlign: 'center' }}>
                    Don't have an account? <a href="/signup" style={{ color: '#f39c12', textDecoration: 'underline' }}>Sign up</a>
                </p>

            </form>
        </div>
    );
};
    export default Login;
