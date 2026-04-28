// client/src/pages/auth/VerifyEmailPage.jsx

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const styles = `
  html, body { margin: 0; padding: 0; min-height: 100vh; }
  .auth-container { min-height: 100vh; width: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(160deg, #f0faf2 0%, #e8f5e9 40%, #f9fff9 100%); padding: 40px 20px; font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
  .auth-box { background: white; border-radius: 24px; padding: 40px; width: 100%; max-width: 440px; box-shadow: 0 20px 60px rgba(26,107,46,0.1); border: 1px solid #e8f5e9; }
  .back-home { display: flex; align-items: center; gap: 8px; color: #1a6b2e; text-decoration: none; font-size: 0.9rem; font-weight: 600; transition: all 0.2s; margin-bottom: 24px; width: fit-content; }
  .back-home:hover { transform: translateX(-4px); color: #2d9e4f; }
  .auth-logo { text-align: center; margin-bottom: 30px; }
  .nav-logo-icon { width:46px; height:46px; border-radius:12px; display:inline-flex; align-items:center; justify-content:center; font-size:24px; background:linear-gradient(135deg, #1a6b2e, #2d9e4f); color: white; margin-bottom:12px; box-shadow: 0 4px 12px rgba(26,107,46,0.2); }
  .auth-logo h2 { font-family: 'DM Sans', sans-serif; font-size: 1.8rem; color: #0f2318; margin-bottom: 5px; font-weight: 700; }
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
  .success-msg { background: #d4edda; color: #155724; padding: 12px; border-radius: 12px; font-size: 0.9rem; margin-bottom: 20px; text-align: center; border: 1px solid #c3e6cb; }
  .otp-inputs { display: flex; gap: 8px; justify-content: center; margin: 20px 0; }
  .otp-input { width: 45px; height: 55px; text-align: center; font-size: 1.5rem; font-weight: 700; border: 2px solid #d4edda; border-radius: 12px; outline: none; transition: all 0.2s; background: #f9fff9; color: #0f2318; }
  .otp-input:focus { border-color: #2d9e4f; box-shadow: 0 0 0 3px rgba(45,158,79,0.15); }
  .resend-link { text-align: center; margin-top: 16px; font-size: 0.9rem; color: #4a6b4a; }
  .resend-link button { background: none; border: none; color: #2d9e4f; font-weight: 600; cursor: pointer; font-size: 0.9rem; }
  .resend-link button:disabled { color: #a0a0a0; cursor: not-allowed; }
  .resend-link button:hover:not(:disabled) { text-decoration: underline; }
  .email-display { background: #e8f5e9; padding: 12px; border-radius: 8px; text-align: center; margin-bottom: 20px; font-weight: 600; color: #1a6b2e; }
`;

export default function VerifyEmailPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const otpInputRefs = useRef([]);

    // Get email from localStorage if available (from registration)
    useEffect(() => {
        const storedEmail = localStorage.getItem('pending_verification_email');
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleOtpChange = (index, value) => {
        if (value.length > 1) value = value[0];
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            otpInputRefs.current[index + 1].focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpInputRefs.current[index - 1].focus();
        }
    };

    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        setError('');

        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            setError('Please enter the complete 6-digit code');
            return;
        }

        if (!email) {
            setError('Email address is required');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/auth/verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: otpCode }),
            });
            const data = await res.json();

            if (res.ok) {
                setSuccess(data.message);
                localStorage.removeItem('pending_verification_email');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError(data.message || 'Invalid verification code');
            }
        } catch (err) {
            setError('Server error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (resendTimer > 0) return;

        if (!email) {
            setError('Please provide your email address');
            return;
        }

        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const res = await fetch('http://localhost:5000/api/auth/resend-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();

            if (res.ok) {
                setSuccess(data.message);
                setResendTimer(60);
                setOtp(['', '', '', '', '', '']);
            } else {
                setError(data.message || 'Failed to resend code');
            }
        } catch (err) {
            setError('Server error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email address');
            return;
        }
        // Request a verification code for this email
        await handleResendCode();
    };

    return (
        <>
            <style>{styles}</style>
            <div className="auth-container">
                <div className="auth-box">
                    <Link to="/register" className="back-home">
                        <span>←</span> Back to registration
                    </Link>

                    <div className="auth-logo">
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <div className="nav-logo-icon">🌿</div>
                        </Link>
                        <h2>Verify Your Email</h2>
                        <p>Enter the 6-digit code sent to your email</p>
                    </div>

                    {error && <div className="error-msg">{error}</div>}
                    {success && <div className="success-msg">{success}</div>}

                    {!email ? (
                        <form onSubmit={handleEmailSubmit}>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <button className="auth-btn" type="submit" disabled={isLoading}>
                                {isLoading ? 'Sending Code...' : 'Send Verification Code'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyEmail}>
                            <div className="email-display">
                                {email}
                            </div>

                            <div className="form-group">
                                <label>Verification Code</label>
                                <div className="otp-inputs">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={el => otpInputRefs.current[index] = el}
                                            type="text"
                                            maxLength="1"
                                            className="otp-input"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <button className="auth-btn" type="submit" disabled={isLoading}>
                                {isLoading ? 'Verifying...' : 'Verify Email'}
                            </button>

                            <div className="resend-link">
                                Didn't receive the code?{' '}
                                <button
                                    type="button"
                                    onClick={handleResendCode}
                                    disabled={resendTimer > 0 || isLoading}
                                >
                                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="auth-footer">
                        Already verified? <Link to="/login">Sign in here</Link>
                    </div>
                </div>
            </div>
        </>
    );
}