import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { KeyRound, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import './Auth.css';
import API_URL from "../api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(password !== confirmPassword) {
      return toast.error("Passwords strictly do not match!");
    }
    
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/resetpassword/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      
      if(res.ok) {
        toast.success('Awesome! Password completely reset. Please login.');
        navigate('/login');
      } else {
        toast.error(`Error: ${data.message || 'Invalid or Expired Link'}`);
      }
    } catch (err) {
      toast.error('Network Error: Could not connect to API.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-elements">
        <div className="auth-bg-blur-1"></div>
      </div>
      <div className="auth-container animate-fade-in-up">
        <div className="auth-header">
          <Link to="/login" className="auth-logo" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '1.5rem' }}>
             &larr; Back to Login
          </Link>
          <h2 className="auth-title">Create New Password</h2>
          <p className="auth-subtitle">Your new password must be securely different from previously used passwords.</p>
        </div>

        <div className="auth-card">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label htmlFor="password" className="auth-label">New Password</label>
              <input
                id="password"
                type="password"
                required
                placeholder="********"
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="auth-input-group">
              <label htmlFor="confirmPassword" className="auth-label">Confirm New Password</label>
              <input
                id="confirmPassword"
                type="password"
                required
                placeholder="********"
                className="auth-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary auth-submit-btn" disabled={isLoading}>
              {isLoading ? (
                <span className="animate-pulse">Resetting securely...</span>
              ) : (
                <>
                  <div className="auth-submit-content">
                    <span>Reset Password</span>
                    <ArrowRight size={20} />
                  </div>
                  <div className="auth-submit-icon">
                    <KeyRound size={20} />
                  </div>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
