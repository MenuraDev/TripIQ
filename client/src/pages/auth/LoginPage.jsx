import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const styles = `
  html, body { margin: 0; padding: 0; min-height: 100vh; }
  .auth-container { min-height: 100vh; width: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(160deg, #f0faf2 0%, #e8f5e9 40%, #f9fff9 100%); padding: 40px 20px; font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
  .auth-box { background: white; border-radius: 24px; padding: 40px; width: 100%; max-width: 440px; box-shadow: 0 20px 60px rgba(26,107,46,0.1); border: 1px solid #e8f5e9; }
  .back-home { display: flex; align-items: center; gap: 8px; color: #1a6b2e; text-decoration: none; font-size: 0.9rem; font-weight: 600; transition: all 0.2s; margin-bottom: 24px; width: fit-content; }
  .back-home:hover { transform: translateX(-4px); color: #2d9e4f; }
  .auth-logo { text-align: center; margin-bottom: 30px; }
  .nav-logo-icon { width:46px; height:46px; border-radius:12px; display:inline-flex; align-items:center; justify-content:center; font-size:24px; background:linear-gradient(135deg, #1a6b2e, #2d9e4f); color: white; margin-bottom:12px; box-shadow: 0 4px 12px rgba(26,107,46,0.2); }
  .auth-logo h2 { font-family: 'DM Sans', sans-serif; font-size: 2rem; color: #0f2318; margin-bottom: 5px; font-weight: 700; }
  .auth-logo p { color: #4a6b4a; font-size: 0.95rem; font-weight: 300; }
  .form-group { margin-bottom: 20px; }
  .form-group label { display: block; font-size: 0.85rem; font-weight: 600; color: #1a6b2e; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; }
  .form-group input { width: 100%; padding: 14px 16px; border: 1px solid #d4edda; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; outline: none; transition: all 0.2s; box-sizing: border-box; background: #f9fff9; color: #0f2318;}
  .form-group input:focus { border-color: #2d9e4f; box-shadow: 0 0 0 3px rgba(45,158,79,0.15); background: white; }
  .auth-btn { width: 100%; background: linear-gradient(135deg, #1a6b2e, #2d9e4f); color: white; border: none; padding: 14px; border-radius: 12px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.3s; margin-top: 10px; font-family: 'DM Sans', sans-serif; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(26,107,46,0.25); }
  .auth-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(26,107,46,0.35); }
  .auth-footer { text-align: center; margin-top: 24px; font-size: 0.95rem; color: #4a6b4a; }
  .auth-footer a { color: #2d9e4f; font-weight: 600; text-decoration: none; transition: color 0.2s; }
  .auth-footer a:hover { color: #1a6b2e; text-decoration: underline; }
  .error-msg { background: #fee2e2; color: #b91c1c; padding: 12px; border-radius: 12px; font-size: 0.9rem; margin-bottom: 20px; text-align: center; border: 1px solid #fca5a5; }
  
  .divider { display: flex; align-items: center; text-align: center; margin: 24px 0; color: #4a6b4a; font-size: 0.85rem; }
  .divider::before, .divider::after { content: ''; flex: 1; border-bottom: 1px solid #d4edda; }
  .divider:not(:empty)::before { margin-right: .5em; }
  .divider:not(:empty)::after { margin-left: .5em; }
  
  .social-login { display: flex; flex-direction: column; gap: 12px; }
  .social-btn { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 12px; border: 1px solid #d4edda; border-radius: 12px; background: white; color: #0f2318; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.95rem; cursor: pointer; transition: all 0.2s; }
  .social-btn:hover { background: #f0faf2; border-color: #c8e6c9; }
  .social-icon { width: 20px; height: 20px; }
  .recaptcha-container { margin: 20px 0; display: flex; justify-content: center; min-height: 78px; }
  .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none !important; }
`;

export default function LoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const [error, setError] = useState('');
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const recaptchaWidgetId = useRef(null);
    const recaptchaContainerRef = useRef(null);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Load reCAPTCHA script if not already loaded
    useEffect(() => {
        const loadRecaptcha = () => {
            if (window.grecaptcha && window.grecaptcha.render) {
                renderRecaptchaWidget();
            } else {
                // Check if script is already in DOM
                let script = document.querySelector('script[src="https://www.google.com/recaptcha/api.js"]');
                if (!script) {
                    script = document.createElement('script');
                    script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit';
                    script.async = true;
                    script.defer = true;
                    document.body.appendChild(script);
                }

                // Set global callback
                window.onRecaptchaLoad = () => {
                    renderRecaptchaWidget();
                };
            }
        };

        const renderRecaptchaWidget = () => {
            if (recaptchaContainerRef.current && window.grecaptcha) {
                try {
                    const widgetId = window.grecaptcha.render(recaptchaContainerRef.current, {
                        sitekey: process.env.REACT_APP_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
                        callback: handleRecaptchaChange,
                        'expired-callback': handleRecaptchaExpired,
                        'error-callback': handleRecaptchaError,
                    });
                    recaptchaWidgetId.current = widgetId;
                } catch (err) {
                    console.error('Failed to render reCAPTCHA:', err);
                    setError('Failed to load reCAPTCHA. Please refresh the page.');
                }
            }
        };

        loadRecaptcha();

        // Cleanup on unmount
        return () => {
            if (recaptchaWidgetId.current !== null && window.grecaptcha) {
                try {
                    window.grecaptcha.reset(recaptchaWidgetId.current);
                } catch (err) {
                    // Ignore cleanup errors
                }
            }
        };
    }, []);

    // Handle reCAPTCHA change
    const handleRecaptchaChange = (token) => {
        setRecaptchaToken(token);
        setError(''); // Clear any previous reCAPTCHA errors
    };

    // Handle reCAPTCHA expiration
    const handleRecaptchaExpired = () => {
        setRecaptchaToken(null);
        setError('reCAPTCHA expired. Please verify again.');
    };

    // Handle reCAPTCHA error
    const handleRecaptchaError = () => {
        setRecaptchaToken(null);
        setError('reCAPTCHA verification failed. Please try again.');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!recaptchaToken) {
            setError('Please complete the reCAPTCHA verification');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: formData.password,
                    email: formData.identifier,
                    username: formData.identifier,
                    recaptchaToken: recaptchaToken,
                }),
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('user', JSON.stringify(data));
                if (data.role === 'admin') navigate('/admin-dashboard');
                else if (data.role === 'driver') navigate('/driver-dashboard');
                else navigate('/user-dashboard');
            } else if (res.status === 403 && data.requires_verification) {
                // Email needs verification
                localStorage.setItem('pending_verification_email', data.email);
                setError(data.message);
                // Redirect to verification page after a short delay
                setTimeout(() => {
                    navigate('/verify-email');
                }, 2000);
            } else {
                setError(data.message || 'Login failed');
                // Reset reCAPTCHA on failure
                if (window.grecaptcha && recaptchaWidgetId.current !== null) {
                    window.grecaptcha.reset(recaptchaWidgetId.current);
                }
                setRecaptchaToken(null);
            }
        } catch (err) {
            setError('Server Error. Please try again.');
            // Reset reCAPTCHA on error
            if (window.grecaptcha && recaptchaWidgetId.current !== null) {
                window.grecaptcha.reset(recaptchaWidgetId.current);
            }
            setRecaptchaToken(null);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSocialLogin = (provider) => {
        // Placeholder for social login
        alert(`Social login with ${provider} is not yet implemented.`);
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
                        <h2>Welcome Back</h2>
                        <p>Sign in to your SurangaTours account</p>
                    </div>

                    {error && <div className="error-msg">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email Address or Username</label>
                            <input
                                type="text"
                                name="identifier"
                                required
                                placeholder="Enter email or username"
                                value={formData.identifier}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" name="password" required placeholder="••••••••" value={formData.password} onChange={handleChange} />
                            <div style={{ textAlign: 'right', marginTop: '8px' }}>
                                <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: '#2d9e4f', textDecoration: 'none', fontWeight: 600 }}>Forgot Password?</Link>
                            </div>
                        </div>

                        {/* reCAPTCHA Widget */}
                        <div className="recaptcha-container" ref={recaptchaContainerRef}></div>

                        <button className="auth-btn" type="submit" disabled={isSubmitting || !recaptchaToken}>
                            {isSubmitting ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="divider">OR</div>

                    <div className="social-login">
                        <button type="button" className="social-btn" onClick={() => handleSocialLogin('Google')}>
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="social-icon" />
                            Continue with Google
                        </button>
                        <button type="button" className="social-btn" onClick={() => handleSocialLogin('Facebook')}>
                            <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="social-icon" />
                            Continue with Facebook
                        </button>
                    </div>

                    <div className="auth-footer">
                        New to SurangaTours? <Link to="/register">Create an account</Link>
                    </div>
                </div>
            </div>
        </>
    );
}
