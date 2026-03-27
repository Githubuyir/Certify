import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`glass ${scrolled ? 'shadow-md' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.3s ease',
        borderBottom: scrolled ? '1px solid var(--border-color)' : '1px solid transparent',
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'var(--glass-bg)'
      }}
    >
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <ShieldCheck size={32} color="var(--primary)" strokeWidth={2.5} />
            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.75rem', color: 'var(--text-main)', letterSpacing: '-0.03em' }}>
              Certify
            </span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              className="btn btn-outline" 
              onClick={() => navigate('/login')}
              style={{ padding: '0.6rem 1.25rem', fontSize: '0.95rem' }}
            >
              Log in
            </button>
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/register')}
              style={{ padding: '0.6rem 1.25rem', fontSize: '0.95rem' }}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
