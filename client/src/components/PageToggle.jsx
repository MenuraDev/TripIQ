import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PageToggle = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // If path is exactly '/' it is home. Otherwise, we assume it's a dashboard (or other pages).
    const isHome = location.pathname === '/';

    const handleToggle = (dest) => {
        if (dest === 'home' && !isHome) {
            navigate('/');
        } else if (dest === 'dashboard' && isHome) {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                if (user.role === 'admin') navigate('/admin-dashboard');
                else if (user.role === 'driver') navigate('/driver-dashboard');
                else navigate('/user-dashboard');
            } else {
                navigate('/login');
            }
        }
    };

    return (
        <div style={{
            display: 'flex',
            background: 'rgba(241, 245, 249, 0.8)',
            backdropFilter: 'blur(8px)',
            borderRadius: '24px',
            padding: '4px',
            gap: '4px',
            border: '1px solid var(--outline-variant, #e2e8f0)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02), 0 2px 8px rgba(0,0,0,0.02)',
            margin: '0 auto'
        }}>
            <button
                onClick={() => handleToggle('home')}
                style={{
                    padding: '8px 24px',
                    borderRadius: '20px',
                    border: 'none',
                    background: isHome ? 'white' : 'transparent',
                    color: isHome ? '#1a6b2e' : '#64748b',
                    fontWeight: isHome ? '600' : '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isHome ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.95rem'
                }}
            >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>home</span>
                Home
            </button>
            <button
                onClick={() => handleToggle('dashboard')}
                style={{
                    padding: '8px 24px',
                    borderRadius: '20px',
                    border: 'none',
                    background: !isHome ? 'white' : 'transparent',
                    color: !isHome ? '#1a6b2e' : '#64748b',
                    fontWeight: !isHome ? '600' : '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: !isHome ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.95rem'
                }}
            >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>dashboard</span>
                Dashboard
            </button>
        </div>
    );
};

export default PageToggle;
