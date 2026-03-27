import React from 'react';
import { FileBadge, Users, Activity, UploadCloud, TrendingUp, Filter, Search, CheckCircle, XCircle, MoreVertical } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [certs, setCerts] = React.useState([]);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    setUser(currentUser);
    if (currentUser) {
      const org = currentUser.institutionName || 'Tech Academy Institute';
      fetch(`http://localhost:5000/api/certificates?organization=${encodeURIComponent(org)}`)
        .then(res => res.json())
        .then(data => setCerts(data))
        .catch(console.error);
    }
  }, []);

  return (
    <div className="admin-dashboard">

      {/* Page Header */}
      <div className="admin-header">
        <div>
          <p className="admin-header-subtitle">Overview</p>
          <h1 className="admin-header-title">System Analytics</h1>
        </div>
        <div className="admin-header-actions">
          <div className="admin-search-wrapper">
            <Search size={18} className="admin-search-icon" />
            <input type="text" placeholder="Search records..." className="admin-search-input" />
          </div>
          <button className="admin-filter-btn">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="admin-metrics-grid">
        <MetricCard
          icon={<FileBadge size={24} />}
          title="Total Issued"
          value={certs.length}
          trend="Live"
          bgClass="admin-metric-primary-bg"
          textClass="admin-metric-primary-text"
        />
        <MetricCard
          icon={<UploadCloud size={24} />}
          title="Uploads Processed"
          value={user?.downloadsCount || 0}
          trend="Native DB"
          bgClass="admin-metric-secondary-bg"
          textClass="admin-metric-secondary-text"
        />
        <MetricCard
          icon={<Activity size={24} />}
          title="Verification Checks"
          value={user?.verificationsCount || 0}
          trend="Native DB"
          bgClass="admin-metric-success-bg"
          textClass="admin-metric-success-text"
        />
      </div>

      {/* Main Content Areas */}
      <div className="admin-content-grid">

        {/* Recent Activity Feed */}
        <div className="admin-section">
          <div className="admin-section-header">
            <h2 className="admin-section-title">Recent Activity</h2>
            <button className="admin-section-link">View All</button>
          </div>

          <div className="admin-activity-card">
            {certs.length === 0 ? (
              <p className="text-gray-500 text-center py-6 w-full">No active credentials.</p>
            ) : (
              certs.slice(0, 5).map((cert, idx) => (
                <div key={cert._id} className="admin-activity-item">
                  <div className="admin-activity-info">
                    <div className={`admin-activity-icon ${idx % 2 === 0 ? 'admin-metric-primary-bg admin-metric-primary-text' : 'admin-metric-secondary-bg admin-metric-secondary-text'}`}>
                      {idx % 2 === 0 ? <FileBadge size={18} /> : <UploadCloud size={18} />}
                    </div>
                    <div className="admin-activity-text">
                      <p className="admin-activity-title">
                        {cert.courseDomain} naturally processed and issued efficiently to {cert.studentName}
                      </p>
                      <p className="admin-activity-meta">
                        <span style={{ fontWeight: 500 }}>System Node</span>
                        <span className="admin-activity-meta-dot"></span>
                        <span>{new Date(cert.issueDate).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>
                  <div className="admin-activity-status-wrapper">
                    <span 
                      className={`admin-activity-status ${cert.status === 'valid' ? 'status-completed' : 'status-uploaded'}`}
                      style={cert.status === 'revoked' ? { backgroundColor: '#fee2e2', color: '#dc2626' } : {}}
                    >
                      {cert.status.toUpperCase()}
                    </span>
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

const MetricCard = ({ icon, title, value, trend, bgClass, textClass }) => (
  <div className="admin-metric-card">
    <div className={`admin-metric-bg-blur ${bgClass}`}></div>

    <div className="admin-metric-header">
      <div className={`admin-metric-icon-wrapper ${bgClass} ${textClass}`}>
        {icon}
      </div>
    </div>
    <div className="admin-metric-content">
      <h3 className="admin-metric-title">{title}</h3>
      <h2 className="admin-metric-value">{value}</h2>
    </div>
  </div>
);

export default AdminDashboard;
