import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import confetti from 'canvas-confetti';

const Dashboard = () => {
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const API_URL = 'http://localhost:3000';

    const triggerConfetti = () => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const random = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    };

    const handleCheckBalance = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.get(`${API_URL}/balance`, {
                withCredentials: true
            });
            setBalance(res.data.balance);
            triggerConfetti();
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                alert('Session expired. Please login again.');
                navigate('/login');
            } else {
                setError('Failed to fetch balance.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            // Optional: call backend logout to clear cookie
            await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
        } catch (e) {
            console.error(e);
        }
        // Clear local state if any
        navigate('/login');
    };

    return (
        <div className="glass-container" style={{ maxWidth: '450px' }}>
            <h2>Dashboard</h2>
            <div className="party-icon">🎉</div>
            <p style={{ opacity: 0.8 }}>Welcome to your secure banking dashboard.</p>

            <div className="balance-card">
                {balance !== null ? (
                    <span className={`balance-amount ${balance !== null ? 'visible' : ''}`}>
                        ₹ {balance}
                    </span>
                ) : (
                    <div style={{ height: '60px' }}></div>
                )}
            </div>

            <button onClick={handleCheckBalance} disabled={loading} style={{ background: 'linear-gradient(45deg, #00b894, #00cec9)' }}>
                {loading ? 'Checking...' : 'Check Balance'}
            </button>

            {error && <div className="error-msg">{error}</div>}

            <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.1)', marginTop: '2rem', border: '1px solid rgba(255,255,255,0.2)' }}>
                Logout
            </button>
        </div>
    );
};

export default Dashboard;
