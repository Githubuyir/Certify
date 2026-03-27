import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/forgotpassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role })
      });
      const data = await res.json();
      
      if(res.ok) {
        toast.success('Password reset link successfully sent to your email!');
        setIsSent(true);
      } else {
        toast.error(`Error: ${data.message || 'Email not found'}`);
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
          <h2 className="auth-title">Forgot Password?</h2>
          <p className="auth-subtitle">No worries, we'll send you reset instructions.</p>
        </div>

        <div className="auth-card">
          {/* Role Selection */}
          <div className="auth-role-tabs">
            <button
              type="button"
              className={`auth-role-btn ${role === 'student' ? 'active' : ''}`}
              onClick={() => setRole('student')}
            >
              Student
            </button>
            <button
              type="button"
              className={`auth-role-btn ${role === 'admin' ? 'active' : ''}`}
              onClick={() => setRole('admin')}
            >
              Admin
            </button>
          </div>

          {isSent ? (
            <div className="text-center py-6">
              <Mail size={48} className="mx-auto text-blue-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Check your email</h3>
              <p className="text-gray-500 mb-6">We've sent a password reset link to <strong>{email}</strong>.</p>
              <button onClick={() => setIsSent(false)} className="text-blue-600 font-medium hover:underline">
                Try another email
              </button>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-input-group">
                <label htmlFor="email" className="auth-label">Email Address</label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="Enter the email associated with your account"
                  className="auth-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary auth-submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <span className="animate-pulse">Sending link...</span>
                ) : (
                  <>
                    <div className="auth-submit-content">
                      <span>Send Recovery Link</span>
                      <ArrowRight size={20} />
                    </div>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
