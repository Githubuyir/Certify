import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Github, Twitter, Linkedin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand-col">
            <Link to="/" className="footer-brand">
              <ShieldCheck size={32} color="var(--primary)" />
              <span className="footer-brand-text">Certify</span>
            </Link>
            <p className="footer-desc">
              The modern standard for digital certificate verification. Secure, reliable, and instantly verifiable.
            </p>
            <div className="footer-socials">
              <a href="#" className="footer-social-link"><Twitter size={20} /></a>
              <a href="#" className="footer-social-link"><Github size={20} /></a>
              <a href="#" className="footer-social-link"><Linkedin size={20} /></a>
            </div>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-heading">Product</h4>
            <div className="footer-link-group">
              <Link to="/verify" className="footer-link">Verify Certificate</Link>
              <Link to="/features" className="footer-link">Features</Link>
              <Link to="/pricing" className="footer-link">Pricing</Link>
            </div>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-heading">Resources</h4>
            <div className="footer-link-group">
              <Link to="/docs" className="footer-link">Documentation</Link>
              <Link to="/help" className="footer-link">Help Center</Link>
              <Link to="/api" className="footer-link">API Reference</Link>
            </div>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-heading">Company</h4>
            <div className="footer-link-group">
              <Link to="/about" className="footer-link">About Us</Link>
              <Link to="/privacy" className="footer-link">Privacy Policy</Link>
              <Link to="/terms" className="footer-link">Terms of Service</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Certify Inc. All rights reserved.
          </p>
          <div className="footer-made-with">
            <span>Made with precision.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
