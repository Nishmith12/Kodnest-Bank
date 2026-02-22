import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Use environment variable or default to localhost:3000
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post(`${API_URL}/login`, formData, {
                withCredentials: true // Crucial for setting cookies
            });
            if (res.status === 200) {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="brand-dot"></div>
                    <h2>Kodbank</h2>
                </div>
                <h3>Welcome Back</h3>
                <p className="auth-subtitle">Sign in to continue to your dashboard.</p>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {error && <div className="error-msg">{error}</div>}
                    <button type="submit" className="btn-primary auth-submit">Sign In</button>
                </form>
                <div className="auth-footer">
                    <Link to="/register">New here? Create an account</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
