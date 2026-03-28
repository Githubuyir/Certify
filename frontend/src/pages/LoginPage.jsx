import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, LogIn, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import './Auth.css';
import API_URL from "../api";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // 'student' or 'admin'
  const [isLoading, setIsLoading] = useState(false);
  
  // Use a ref to bypass stale React closures within memoized Google Login frames
  const roleRef = React.useRef(role);
  React.useEffect(() => { roleRef.current = role; }, [role]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('${API_URL}/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });

      const data = await res.json();
      
      if (res.ok) {
        // Enforce strict alignment of UI tab selection and backend Role validation 
        if(data.role !== role) {
          setIsLoading(false);
          return toast.error(`Access Denied: You cannot log into the ${role} portal with a ${data.role} account.`);
        }

        toast.success(`Welcome back, ${data.name}!`);
        localStorage.setItem("user", JSON.stringify(data));
        // Route dynamically based on backend verified role
        if (data.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      } else {
        toast.error(`Login Failed: ${data.message || 'Invalid credentials'}`);
      }
    } catch (error) {
      toast.error('Error connecting to server. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const currentRole = roleRef.current;
      const res = await fetch('${API_URL}/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token: credentialResponse.credential, 
          role: currentRole, 
          action: 'login' 
        })
      });
      const data = await res.json();
      
      if(res.ok) {
        toast.success(`Google verification seamless! Welcome, ${data.name}!`);
        localStorage.setItem("user", JSON.stringify(data));
        if (data.role === 'admin') navigate('/admin/dashboard');
        else navigate('/student/dashboard');
      } else {
        toast.error(`Google Login Failed: ${data.message}`);
      }
    } catch(err) {
      toast.error('Network error linking Google account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background Decorative Rings */}
      <div className="auth-bg-elements">
        <div className="auth-bg-blur-1"></div>
        <div className="auth-bg-blur-2"></div>
      </div>

      <div className="auth-container animate-fade-in-up">
        <div className="auth-header">
          <Link to="/" className="auth-logo" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '1.5rem' }}>
            &larr; Back to Home
          </Link>
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Enter your details to access your dashboard</p>
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

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="auth-input-group">
              <label htmlFor="email" className="auth-label">Email Address</label>
              <input
                id="email"
                type="email"
                required
                placeholder="you@university.edu"
                className="auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="auth-input-group">
              <div className="auth-input-header">
                <label htmlFor="password" className="auth-label">Password</label>
                <Link to="/forgot-password" className="auth-forgot-pwd">Forgot password?</Link>
              </div>
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="animate-pulse">Signing in...</span>
              ) : (
                <>
                  <div className="auth-submit-content">
                    <span>Sign In</span>
                    <ArrowRight size={20} />
                  </div>
                  <div className="auth-submit-icon">
                    <LogIn size={20} />
                  </div>
                </>
              )}
            </button>

            <div className="auth-divider">
              <span>OR</span>
            </div>
            
            <div className="auth-google-wrapper" style={{display: 'flex', justifyContent: 'center'}}>
              <GoogleLogin 
                onSuccess={handleGoogleSuccess} 
                onError={() => toast.error('Google authorization popup failed')} 
                theme="outline" 
                size="large" 
                width="100%"
                text="continue_with"
              />
            </div>
          </form>
        </div>

        <p className="auth-footer-text">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;