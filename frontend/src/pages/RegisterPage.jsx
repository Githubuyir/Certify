import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, UserPlus, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import './Auth.css';
import API_URL from "../api";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [role, setRole] = useState('student'); // 'student' or 'admin'
  const [isLoading, setIsLoading] = useState(false);
  
  // Use a ref to bypass stale React closures within memoized Google Login frames
  const roleRef = React.useRef(role);
  React.useEffect(() => { roleRef.current = role; }, [role]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if(formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    
    setIsLoading(true);
    
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: formData.name, 
          email: formData.email, 
          password: formData.password,
          role: role
        })
      });
      
      const data = await res.json();
      
      if(res.ok) {
        toast.success(`Successfully registered as ${role}! Please sign in.`);
        navigate('/login');
      } else {
        toast.error(`Registration Failed: ${data.message || 'Unknown error'}`);
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
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token: credentialResponse.credential, 
          role: currentRole, 
          action: 'register' 
        })
      });
      const data = await res.json();
      
      if(res.ok) {
        toast.success(`Google mapped seamlessly! Welcome, ${data.name}!`);
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
        <div className="auth-bg-blur-1" style={{ top: 'auto', bottom: '-10%', left: '-10%' }}></div>
        <div className="auth-bg-blur-2" style={{ top: '-10%', bottom: 'auto', right: '-10%' }}></div>
      </div>

      <div className="auth-container animate-fade-in-up">
        <div className="auth-header">
          <Link to="/" className="auth-logo" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '1.5rem' }}>
             &larr; Back to Home
          </Link>
          <h2 className="auth-title">Create your account</h2>
          <p className="auth-subtitle">Join the modern standard in digital credentialing</p>
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

          <form className="auth-form" onSubmit={handleRegister}>
            <div className="auth-input-group">
              <label htmlFor="name" className="auth-label">Full Name</label>
              <input
                id="name"
                type="text"
                required
                placeholder="e.g. John Doe"
                className="auth-input"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
            <div className="auth-input-group">
              <label htmlFor="email" className="auth-label">Email Address</label>
              <input
                id="email"
                type="email"
                required
                placeholder="you@university.edu"
                className="auth-input"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="auth-input-group">
              <label htmlFor="password" className="auth-label">Password</label>
              <input
                id="password"
                type="password"
                required
                placeholder="Create a strong password"
                className="auth-input"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="auth-input-group">
              <label htmlFor="confirmPassword" className="auth-label">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                required
                placeholder="Repeat password"
                className="auth-input"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="animate-pulse">Creating access...</span>
              ) : (
                <>
                  <div className="auth-submit-content">
                    <span>Complete Registration</span>
                    <ArrowRight size={20} />
                  </div>
                  <div className="auth-submit-icon">
                    <UserPlus size={20} />
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
            
            <p className="auth-terms">
              By creating an account, you agree to our <a href="#" className="auth-link">Terms of Service</a> & <a href="#" className="auth-link">Privacy Policy</a>
            </p>
          </form>
        </div>

        <p className="auth-footer-text pb-8">
          Already have verified credentials?{' '}
          <Link to="/login" className="auth-link">Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
