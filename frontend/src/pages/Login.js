import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally { setLoading(false); }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-badge">⚡ TaskFlow</div>
                <h1 className="auth-title">Welcome back</h1>
                <p className="auth-subtitle">Sign in to manage your projects and tasks</p>
                {error && <div className="error-msg">⚠ {error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                    </div>
                    <button className="btn-primary" type="submit" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign in →'}
                    </button>
                </form>
                <div className="auth-divider"><span>or</span></div>
                <div className="auth-link">
                    No account yet? <Link to="/register">Create one free</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;