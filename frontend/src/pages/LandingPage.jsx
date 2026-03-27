import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Search,
  CheckCircle,
  FileText,
  Lock,
  Zap,
  Layers,
  Globe,
  ArrowRight
} from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [certId, setCertId] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifyError, setVerifyError] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!certId.trim()) return;

    setIsVerifying(true);
    setVerifyResult(null);
    setVerifyError(null);

    try {
      const res = await fetch(`http://localhost:5000/api/certificates/verify/${certId}`);
      const data = await res.json();
      
      if (res.ok && data.valid) {
        setVerifyResult({
          id: data.data.certId,
          status: data.data.status || 'Valid',
          recipient: data.data.studentName,
          issueDate: new Date(data.data.issueDate).toLocaleDateString()
        });
      } else {
        setVerifyError("Verification Failed: No cryptographically valid credential matched the database hashes.");
      }
    } catch(err) {
      setVerifyError("System Error: Live database connection sequence failed.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        {/* Background Decorative Elements */}
        <div className="hero-bg-elements">
          <div className="hero-bg-blur-1"></div>
          <div className="hero-bg-blur-2"></div>
          <div className="hero-grid-pattern"></div>
        </div>

        <div className="hero-content animate-fade-in-up">
          <div className="hero-badge">
            <span className="dot" />
            <span>The new standard in certificate verification</span>
          </div>

          <h1 className="hero-title">
            Trust but <span className="text-gradient">verify.</span> Instantly.
          </h1>

          <p className="hero-subtitle">
            Secure, tamper-proof digital certificates for institutions and professionals. Verify credentials with a single click.
          </p>

          {/* Search Box */}
          <div className="search-container relative z-20">
            <form onSubmit={handleVerify} className="search-box">
              <div className="search-icon-wrapper">
                <Search size={24} />
              </div>
              <input
                type="text"
                placeholder="Enter Certificate ID (e.g. CERT-1234-4321)"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                className="search-input"
              />
              <button
                type="submit"
                disabled={isVerifying}
                className="btn btn-primary search-btn"
              >
                {isVerifying ? 'Verifying...' : 'Verify Now'}
              </button>
            </form>
          </div>

          {/* Verification Result Card */}
          {verifyResult && (
            <div className="verify-result-card animate-fade-in-up">
              <div className="verify-header">
                <div className="verify-icon">
                  <CheckCircle size={28} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>Certificate is Valid</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>ID: {verifyResult.id}</p>
                </div>
              </div>

              <div className="verify-details">
                <div className="verify-row">
                  <span className="verify-label">Issued To:</span>
                  <span className="verify-value">{verifyResult.recipient}</span>
                </div>
                <div className="verify-row">
                  <span className="verify-label">Issue Date:</span>
                  <span className="verify-value">{verifyResult.issueDate}</span>
                </div>
                <div style={{ textAlign: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontStyle: 'italic' }}>
                    <Lock size={12} /> Partial details mapped for privacy
                  </span>
                </div>
              </div>

              <div className="verify-actions">
                <button
                  onClick={() => navigate('/login')}
                  className="btn btn-primary verify-login-btn"
                >
                  <span>Login to View Full Certificate</span>
                  <ArrowRight size={18} />
                </button>
                <p style={{ fontSize: '0.85rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Don't have an account? <span onClick={() => navigate('/register')} style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>Register here</span>
                </p>
              </div>
            </div>
          )}

          {/* Verification Error Card */}
          {verifyError && (
            <div className="verify-result-card animate-fade-in-up" style={{ borderColor: 'var(--error)', marginTop: '1.5rem' }}>
              <div className="verify-header">
                <div className="verify-icon" style={{ backgroundColor: 'var(--error-bg)', color: 'var(--error)' }}>
                  <Zap size={28} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--error)' }}>Verification Failed</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{verifyError}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* How it Works / Features Grid */}
      <section className="features-section">
        <div className="features-header animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2>Enterprise-grade credentialing</h2>
          <p>
            Everything you need to issue, manage, and verify digital credentials at scale, built on a secure infrastructure.
          </p>
        </div>

        <div className="features-grid">
          <FeatureCard
            icon={<ShieldCheck className="text-primary" size={32} />}
            title="Tamper-proof Verification"
            desc="Cryptographically secure certificates that cannot be altered or forged. Instant validation."
          />
          <FeatureCard
            icon={<Zap className="text-secondary" size={32} />}
            title="Lightning Fast"
            desc="Verify credentials in milliseconds. Zero wait times for employers and universities."
          />
          <FeatureCard
            icon={<Layers className="text-accent" size={32} />}
            title="Bulk Issuance"
            desc="Generate thousands of certificates simultaneously with our intuitive spreadsheet uploader."
          />
          <FeatureCard
            icon={<FileText className="text-success" size={32} />}
            title="Custom Templates"
            desc="Design beautiful, professional certificates that match your institution's brand identity."
          />
          <FeatureCard
            icon={<Lock className="text-warning" size={32} />}
            title="Privacy First"
            desc="Granular access controls ensure sensitive data is only visible to authorized parties."
          />
          <FeatureCard
            icon={<Globe className="text-primary" size={32} />}
            title="Global Standard"
            desc="Recognized formats and universally accessible links for borderless verification."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2 className="cta-title">Ready to secure your credentials?</h2>
        <p className="cta-desc">
          Join hundreds of institutions already using Certify to manage their digital certificates.
        </p>
        <div className="cta-actions">
          <button
            onClick={() => navigate('/register')}
            className="btn btn-primary"
            style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}
          >
            Get Started for Free
          </button>
          <button
            onClick={() => navigate('/login')}
            className="btn btn-outline"
            style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}
          >
            Sign In to Dashboard
          </button>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="feature-card">
    <div className="feature-icon">
      {icon}
    </div>
    <h3 className="feature-title">{title}</h3>
    <p className="feature-desc">{desc}</p>
  </div>
);

export default LandingPage;
