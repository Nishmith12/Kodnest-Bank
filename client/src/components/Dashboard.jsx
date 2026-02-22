import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import confetti from 'canvas-confetti';
import ChatInterface from './ChatInterface';
import { LayoutDashboard, PieChart, CreditCard, Wallet, User, MessageSquare, Settings, LogOut } from 'lucide-react';

const Dashboard = () => {
    const [balance, setBalance] = useState(null);
    const [username, setUsername] = useState('User');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false);

    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    // Fetch initial basic info if needed, or rely on the Check Balance button.
    // Given the reference image has amounts initially, let's fetch on mount.
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const res = await axios.get(`${API_URL}/balance`, { withCredentials: true });
                setBalance(res.data.balance);
                setUsername(res.data.username || 'demo123'); // Fallback to demo123 as in image if needed
            } catch (err) {
                if (err.response?.status === 401 || err.response?.status === 403) {
                    navigate('/login');
                }
            }
        };
        fetchInitialData();
    }, [navigate, API_URL]);

    const triggerConfetti = () => {
        // ... (existing confetti code from previous phase) ...
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };
        const random = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    };

    const handleCheckBalance = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.get(`${API_URL}/balance`, { withCredentials: true });
            setBalance(res.data.balance);
            triggerConfetti();
        } catch (err) {
            setError('Failed to fetch balance.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
        } catch (e) {
            console.error(e);
        }
        navigate('/login');
    };

    return (
        <div className="dashboard-layout">
            {/* Sidebar matches the dark minimalist design in the image */}
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <div className="brand-dot"></div>
                    <h2>Kodbank</h2>
                </div>

                <nav className="nav-menu">
                    <p className="nav-label">Main Menu</p>
                    <a href="#" className="nav-item active"><LayoutDashboard size={18} /> Dashboard</a>
                    <a href="#" className="nav-item"><PieChart size={18} /> Analytics</a>
                    <a href="#" className="nav-item"><CreditCard size={18} /> Cards</a>
                    <a href="#" className="nav-item"><Wallet size={18} /> Assets</a>
                    <a href="#" className="nav-item"><User size={18} /> Profile</a>
                </nav>

                {/* Primary CTA from user image */}
                <div className="ask-brocode-wrapper">
                    <button className="btn-ask-brocode" onClick={() => setIsChatOpen(true)}>
                        <MessageSquare size={18} /> Ask brocode
                    </button>
                </div>

                <div className="sidebar-footer">
                    <a href="#" className="nav-item"><Settings size={18} /> Settings</a>
                    <button className="nav-item logout-btn" onClick={handleLogout}><LogOut size={18} /> Logout</button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="main-content">
                <header className="top-header">
                    <div>
                        <h1>Welcome back, {username}</h1>
                        <p>Here's what's happening with your finance today.</p>
                    </div>
                    <div className="header-actions">
                        <button className="btn-secondary" onClick={handleCheckBalance} disabled={loading}>
                            {loading ? 'Checking...' : 'Check Balance'}
                        </button>
                        <button className="btn-primary">Send Money</button>
                    </div>
                </header>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon-wrapper yellow">$</div>
                        <div className="stat-info">
                            <p>Total Balance</p>
                            <h3>${balance !== null ? balance.toLocaleString() : '---'}</h3>
                        </div>
                    </div>
                    {/* Placeholder cards to match UI */}
                    <div className="stat-card">
                        <div className="stat-icon-wrapper red">↗</div>
                        <div className="stat-info">
                            <p>Monthly Income</p>
                            <h3>$8,432.5</h3>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon-wrapper blue">↙</div>
                        <div className="stat-info">
                            <p>Monthly Expenses</p>
                            <h3>$3,120.45</h3>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon-wrapper yellow">💼</div>
                        <div className="stat-info">
                            <p>Total Savings</p>
                            <h3>$12,450</h3>
                        </div>
                    </div>
                </div>

                {error && <div className="error-msg">{error}</div>}
            </main>

            {/* AI Chat Modal */}
            {isChatOpen && <ChatInterface onClose={() => setIsChatOpen(false)} />}
        </div>
    );
};

export default Dashboard;
