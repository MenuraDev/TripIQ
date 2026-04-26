// client\src\pages\auth\RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const styles = `
  html, body { margin: 0; padding: 0; min-height: 100vh; }
  .auth-container { min-height: 100vh; width: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(160deg, #f0faf2 0%, #e8f5e9 40%, #f9fff9 100%); padding: 60px 20px; font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
  .auth-box { background: white; border-radius: 24px; padding: 40px; width: 100%; max-width: 520px; box-shadow: 0 20px 60px rgba(26,107,46,0.1); border: 1px solid #e8f5e9; }
  .back-home { display: flex; align-items: center; gap: 8px; color: #1a6b2e; text-decoration: none; font-size: 0.9rem; font-weight: 600; transition: all 0.2s; margin-bottom: 24px; width: fit-content; }
  .back-home:hover { transform: translateX(-4px); color: #2d9e4f; }
  .auth-logo { text-align: center; margin-bottom: 24px; }
  .nav-logo-icon { width:46px; height:46px; border-radius:12px; display:inline-flex; align-items:center; justify-content:center; font-size:24px; background:linear-gradient(135deg, #1a6b2e, #2d9e4f); color: white; margin-bottom:12px; box-shadow: 0 4px 12px rgba(26,107,46,0.2); }
  .auth-logo h2 { font-family: 'DM Sans', sans-serif; font-size: 2rem; color: #0f2318; margin-bottom: 5px; font-weight: 700; }
  .auth-logo p { color: #4a6b4a; font-size: 0.95rem; font-weight: 300; }
  
  .role-toggle { display: flex; background: #f0faf2; border-radius: 12px; padding: 4px; margin-bottom: 24px; border: 1px solid #c8e6c9; }
  .role-btn { flex: 1; padding: 12px; text-align: center; background: transparent; border: none; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.95rem; color: #4a6b4a; cursor: pointer; transition: all 0.3s; }
  .role-btn.active { background: white; color: #1a6b2e; box-shadow: 0 2px 8px rgba(26,107,46,0.15); }

  .form-row-group { display: flex; gap: 16px; }
  .form-row-group .form-group { flex: 1; }

  .form-group { margin-bottom: 16px; }
  .form-group label { display: block; font-size: 0.85rem; font-weight: 600; color: #1a6b2e; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; }
  .form-group input { width: 100%; padding: 12px 16px; border: 1px solid #d4edda; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; outline: none; transition: all 0.2s; box-sizing: border-box; background: #f9fff9; color: #0f2318;}
  .form-group input:focus { border-color: #2d9e4f; box-shadow: 0 0 0 3px rgba(45,158,79,0.15); background: white; }
  
  .auth-btn { width: 100%; background: linear-gradient(135deg, #1a6b2e, #2d9e4f); color: white; border: none; padding: 14px; border-radius: 12px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.3s; margin-top: 10px; font-family: 'DM Sans', sans-serif; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(26,107,46,0.25); }
  .auth-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(26,107,46,0.35); }
  
  .auth-footer { text-align: center; margin-top: 24px; font-size: 0.95rem; color: #4a6b4a; }
  .auth-footer a { color: #2d9e4f; font-weight: 600; text-decoration: none; transition: color 0.2s; }
  .auth-footer a:hover { color: #1a6b2e; text-decoration: underline; }
  .error-msg { background: #fee2e2; color: #b91c1c; padding: 12px; border-radius: 12px; font-size: 0.9rem; margin-bottom: 20px; text-align: center; border: 1px solid #fca5a5; }
`;

export default function RegisterPage() {
    const navigate = useNavigate();
    const [role, setRole] = useState('tourist'); // 'tourist' or 'driver'
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        phone: '',
        license_no: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) return setError("Full name is required");

        const username = formData.username.trim();
        if (!username) return setError("Username is required");
        if (username.length < 4) return setError("Username must be at least 4 characters long");
        if (!/^[a-zA-Z0-9_]+$/.test(username)) return setError("Username can only contain letters, numbers, and underscores");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) return setError("Please enter a valid email address");

        if (formData.phone) {
            const phoneRegex = /^\+?[0-9\s-]{9,15}$/;
            if (!phoneRegex.test(formData.phone)) return setError("Please enter a valid phone number format");
        }

        if (role === 'driver' && !formData.license_no.trim()) {
            return setError("License number is required for drivers");
        }

        if (formData.password.length < 6) return setError("Password must be at least 6 characters long");
        if (formData.password !== formData.confirmPassword) return setError("Passwords do not match");

        try {
            const res = await fetch('http://localhost:5007/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    role,
                    name: formData.name,
                    username: formData.username,
                    email: formData.email,
                    phone: formData.phone,
                    license_no: formData.license_no,
                    password: formData.password
                }),
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('user', JSON.stringify(data));
                if (data.role === 'driver') {
                    navigate('/driver-dashboard');
                } else {
                    navigate('/user-dashboard');
                }
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Server Error. Please try again.');
        }
    };

    return (
        <>
            <style>{styles}</style>
            <div className="auth-container">
                <div className="auth-box">
                    <Link to="/" className="back-home">
                        <span>←</span> Back to home
                    </Link>
                    <div className="auth-logo">
                        <Link to="/" style={{ textDecoration: 'none' }}><div className="nav-logo-icon">🌿</div></Link>
                        <h2>Create Account</h2>
                        <p>Join SurangaTours and start your journey</p>
                    </div>

                    <div className="role-toggle">
                        <button
                            type="button"
                            className={`role-btn ${role === 'tourist' ? 'active' : ''}`}
                            onClick={() => { setRole('tourist'); setError(''); }}
                        >
                            Traveler
                        </button>
                        <button
                            type="button"
                            className={`role-btn ${role === 'driver' ? 'active' : ''}`}
                            onClick={() => { setRole('driver'); setError(''); }}
                        >
                            Driver
                        </button>
                    </div>

                    {error && <div className="error-msg">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-row-group">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" name="name" required placeholder="John Doe" value={formData.name} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Username</label>
                                <input type="text" name="username" required placeholder="johndoe88" value={formData.username} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="form-row-group">
                            <div className="form-group">
                                <label>Email Address</label>
                                <input type="email" name="email" required placeholder="john@example.com" value={formData.email} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input type="tel" name="phone" required placeholder="+94 77 123 4567" value={formData.phone} onChange={handleChange} />
                            </div>
                        </div>

                        {role === 'driver' && (
                            <div className="form-group">
                                <label>License Number</label>
                                <input type="text" name="license_no" required placeholder="e.g. B1234567" value={formData.license_no} onChange={handleChange} />
                            </div>
                        )}

                        <div className="form-row-group">
                            <div className="form-group">
                                <label>Password</label>
                                <input type="password" name="password" required placeholder="••••••••" value={formData.password} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Confirm Password</label>
                                <input type="password" name="confirmPassword" required placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} />
                            </div>
                        </div>

                        <button className="auth-btn" type="submit">Sign Up as {role === 'driver' ? 'Driver' : 'Traveler'}</button>
                    </form>

                    <div className="auth-footer">
                        Already have an account? <Link to="/login">Sign in here</Link>
                    </div>
                </div>
            </div>
        </>
    );
}
