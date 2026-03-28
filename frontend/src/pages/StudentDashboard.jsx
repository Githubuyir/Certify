import React from 'react';
import { Award, CheckCircle, DownloadCloud, Sparkles, ShieldCheck, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';
import API_URL from "../api";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);
  const [certs, setCerts] = React.useState([]);

  React.useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    setUser(currentUser);

    if (currentUser && currentUser.email) {
      fetch(`${API_URL}/api/certificates?email=${currentUser.email}`)
        .then(res => res.json())
        .then(data => setCerts(data))
        .catch(console.error);
    }
  }, []);

  return (
    <div className="student-dashboard">

      {/* Personalized Welcome Header */}
      <div className="student-welcome-banner">
        {/* Decorative background shapes */}
        <div className="welcome-bg-shape-1"></div>
        <div className="welcome-bg-shape-2"></div>

        <div className="welcome-content">
          <div>
            <div className="welcome-badge">
              <Sparkles size={14} className="text-accent" /> Student Portal
            </div>
            <h1 className="welcome-title">Welcome back, {user?.name?.split(' ')[0] || 'Student'}!</h1>
            <p className="welcome-subtitle">View your verified credentials and share your achievements with the world.</p>
          </div>
          <div className="welcome-icon-wrapper">
            <ShieldCheck size={48} className="text-main" />
          </div>
        </div>
      </div>

      <div className="student-metrics-grid">
        <MetricCard
          icon={<Award size={24} />}
          title="Total Certificates"
          value={certs.length}
          bgClass="metric-bg-primary"
        />
        <MetricCard
          icon={<CheckCircle size={24} />}
          title="Verified Status"
          value={user?.verificationsCount || 0}
          bgClass="metric-bg-success"
        />
        <MetricCard
          icon={<DownloadCloud size={24} />}
          title="Total Downloads"
          value={user?.downloadsCount || 0}
          bgClass="metric-bg-secondary"
        />
      </div>

      <div className="student-content-grid">
        <div className="student-certs-section">
          <div className="student-section-header">
            <h3 className="student-section-title">Recent Certificates</h3>
            <button className="student-section-link" onClick={() => navigate('/student/certificates')}>View All</button>
          </div>

          <div className="student-certs-card">

            {certs.length === 0 ? (
              <p className="text-gray-500 text-center py-6 w-full">No active certificates.</p>
            ) : (
              certs.slice(0, 3).map((cert, index) => (
                <div className="student-cert-item" key={cert._id}>
                  <div className="student-cert-info">
                    <div className={`student-cert-icon ${index % 2 === 0 ? 'bg-orange-light' : 'bg-blue-light'}`}>
                      <Award size={24} />
                    </div>
                    <div>
                      <h4 className="student-cert-name">{cert.courseDomain}</h4>
                      <p className="student-cert-issuer">{cert.organization || 'Tech Academy Institute'}</p>
                    </div>
                  </div>
                  <div className="student-cert-status">
                    <span className="cert-verified-badge" style={cert.status === 'revoked' ? { backgroundColor: '#fee2e2', color: '#dc2626', borderColor: '#f87171' } : {}}>
                      {cert.status === 'revoked' ? <XCircle size={14} /> : <CheckCircle size={14} />} 
                      {cert.status === 'revoked' ? 'Revoked' : 'Verified'}
                    </span>
                    <p className="cert-issue-date">Issued: {new Date(cert.issueDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}

          </div>
        </div>



      </div>
    </div>
  );
};

const MetricCard = ({ icon, title, value, bgClass }) => (
  <div className="student-metric-card">
    <div className={`student-metric-icon-wrapper ${bgClass}`}>
      {icon}
    </div>
    <div>
      <p className="student-metric-title">{title}</p>
      <h3 className="student-metric-value">{value}</h3>
    </div>
  </div>
);

export default StudentDashboard;
