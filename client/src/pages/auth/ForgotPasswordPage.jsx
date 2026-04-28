import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
  .step-indicator { display: flex; justify-content: center; gap: 8px; margin-bottom: 24px; }
  .step-dot { width: 10px; height: 10px; border-radius: 50%; background: #d4edda; transition: all 0.3s; }
  .step-dot.active { background: #1a6b2e; transform: scale(1.2); }
  .step-dot.completed { background: #2d9e4f; }
  .otp-inputs { display: flex; gap: 8px; justify-content: center; margin: 20px 0; }
  .otp-input { width: 45px; height: 55px; text-align: center; font-size: 1.5rem; font-weight: 700; border: 2px solid #d4edda; border-radius: 12px; outline: none; transition: all 0.2s; background: #f9fff9; color: #0f2318; }
  .otp-input:focus { border-color: #2d9e4f; box-shadow: 0 0 0 3px rgba(45,158,79,0.15); }
  .resend-link { text-align: center; margin-top: 16px; font-size: 0.9rem; color: #4a6b4a; }
  .resend-link button { background: none; border: none; color: #2d9e4f; font-weight: 600; cursor: pointer; font-size: 0.9rem; }
  .resend-link button:disabled { color: #a0a0a0; cursor: not-allowed; }
  .resend-link button:hover:not(:disabled) { text-decoration: underline; }
`;

export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const otpInputRefs = useRef([]);

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('http://localhost:5000/api/auth/forgot-password-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();

            if (res.ok) {
                setSuccess(data.message);
                setStep(2);
                setResendTimer(60); // 60 seconds cooldown
            } else {
                setError(data.message || 'Failed to send verification code');
            }
        } catch (err) {
            setError('Server error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

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

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            setError('Please enter the complete 6-digit code');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/auth/forgot-password-verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: otpCode }),
            });
            const data = await res.json();

            if (res.ok) {
                setSuccess('Verification successful! You can now reset your password.');
                setStep(3);
            } else {
                setError(data.message || 'Invalid verification code');
            }
        } catch (err) {
            setError('Server error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const otpCode = otp.join('');
        setIsLoading(true);

        try {
            const res = await fetch('http://localhost:5000/api/auth/forgot-password-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email, 
                    code: otpCode, 
                    newPassword 
                }),
            });
            const data = await res.json();

            if (res.ok) {
                setSuccess(data.message);
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                setError(data.message || 'Failed to reset password');
            }
        } catch (err) {
            setError('Server error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (resendTimer > 0) return;
        
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const res = await fetch('http://localhost:5000/api/auth/forgot-password-request', {
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

    return (
        <>
            <style>{styles}</style>
            <div className="auth-container">
                <div className="auth-box">
                    <Link to="/login" className="back-home">
                        <span>←</span> Back to login
                    </Link>
                    
                    <div className="auth-logo">
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <div className="nav-logo-icon">🔐</div>
                        </Link>
                        <h2>
                            {step === 1 && 'Forgot Password'}
                            {step === 2 && 'Verify Your Email'}
                            {step === 3 && 'Reset Password'}
                        </h2>
                        <p>
                            {step === 1 && 'Enter your email to receive a verification code'}
                            {step === 2 && 'Enter the 6-digit code sent to your email'}
                            {step === 3 && 'Create a new password for your account'}
                        </p>
                    </div>

                    {/* Step Indicator */}
                    <div className="step-indicator">
                        <div className={`step-dot ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}></div>
                        <div className={`step-dot ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}></div>
                        <div className={`step-dot ${step >= 3 ? 'active' : ''}`}></div>
                    </div>

                    {error && <div className="error-msg">{error}</div>}
                    {success && <div className="success-msg">{success}</div>}

                    {/* Step 1: Email Input */}
                    {step === 1 && (
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
                    )}

                    {/* Step 2: OTP Verification */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyOtp}>
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
                                {isLoading ? 'Verifying...' : 'Verify Code'}
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

                    {/* Step 3: New Password */}
                    {step === 3 && (
                        <form onSubmit={handleResetPassword}>
                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                            <button className="auth-btn" type="submit" disabled={isLoading}>
                                {isLoading ? 'Resetting Password...' : 'Reset Password'}
                            </button>
                        </form>
                    )}

                    <div className="auth-footer">
                        Remember your password? <Link to="/login">Sign in</Link>
                    </div>
                </div>
            </div>
        </>
    );
}
