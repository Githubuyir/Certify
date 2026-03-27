import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileCheck, 
  Search, 
  User, 
  LogOut,
  Upload,
  Settings,
  Menu,
  X,
  ShieldCheck,
  FilePlus,
  BarChart,
  Bell
} from 'lucide-react';
import './DashboardLayout.css';

const DashboardLayout = ({ role = 'student' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const loadUser = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.name) {
        setUserName(user.name);
      } else {
        setUserName(role === 'admin' ? 'Admin Name' : 'Student Account');
      }
      
      if (user?.institutionName) {
        setInstitutionName(user.institutionName);
      } else {
        setInstitutionName(role === 'admin' ? 'Tech Academy Institute' : '');
      }
    } catch(e) {}
  };

  React.useEffect(() => {
    loadUser();
    window.addEventListener('profileUpdated', loadUser);
    return () => window.removeEventListener('profileUpdated', loadUser);
  }, [role]);

  const studentLinks = [
    { name: 'Overview', path: '/student/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'My Certificates', path: '/student/certificates', icon: <FileCheck size={20} /> },
    { name: 'Verify Certificate', path: '/student/verify', icon: <Search size={20} /> },
    { name: 'Profile Settings', path: '/student/profile', icon: <User size={20} /> },
  ];

  const adminLinks = [
    { name: 'Overview', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Upload Data', path: '/admin/upload', icon: <Upload size={20} /> },
    { name: 'Manage Certificates', path: '/admin/manage', icon: <Settings size={20} /> },
    { name: 'Generate Certificate', path: '/admin/generate', icon: <FilePlus size={20} /> },
    { name: 'Profile Settings', path: '/admin/profile', icon: <User size={20} /> },
  ];

  const links = role === 'admin' ? adminLinks : studentLinks;

  const NavItem = ({ name, path, icon }) => {
    const isActive = location.pathname.includes(path);
    return (
      <Link 
        to={path} 
        onClick={() => setSidebarOpen(false)}
        className={`nav-item ${isActive ? 'active' : ''}`}
      >
        <div className="nav-item-icon">
          {icon}
        </div>
        <span>{name}</span>
      </Link>
    );
  };

  return (
    <div className="dashboard-layout">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`dashboard-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}
      >
        {/* Brand Header */}
        <div className="sidebar-brand-header">
          <Link to="/" className="sidebar-brand-link">
            <div className="sidebar-brand-icon-wrapper">
              <ShieldCheck className="text-primary" size={26} strokeWidth={2.5} />
            </div>
            <span className="sidebar-brand-text">
              Certify
            </span>
          </Link>
          <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* User Info Card (Sidebar) */}
        <div className="sidebar-user-card">
          <div className="user-avatar">
            {role === 'admin' ? 'AD' : 'ST'}
          </div>
          <div className="user-info-text">
            <p className="user-name">{userName}</p>
            <p className="user-role" style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>
               {role === 'admin' ? institutionName : `${role.charAt(0).toUpperCase() + role.slice(1)} Portal`}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="sidebar-nav">
          {links.map((link) => (
            <NavItem key={link.name} {...link} />
          ))}
        </div>

        {/* Logout Section */}
        <div className="sidebar-logout">
          <button 
            onClick={() => navigate('/login')}
            className="logout-btn"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="dashboard-main">
        
        {/* Top Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="mobile-menu-btn"
            >
              <Menu size={20} />
            </button>
            
            <div className="page-title">
              {location.pathname.split('/').pop().replace('-', ' ')}
            </div>
          </div>

          <div className="header-right" style={{ position: 'relative' }}>
            <button 
              className="notification-btn"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <Bell size={20} />
              <span className="notification-dot"></span>
            </button>

            {notificationsOpen && (
              <>
                {/* Invisible overlay to close dropdown when clicking outside */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setNotificationsOpen(false)}
                  style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 40 }}
                />
                <div style={{
                  position: 'absolute',
                top: '100%',
                right: '0',
                marginTop: '0.5rem',
                backgroundColor: 'white',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                padding: '1rem',
                zIndex: 50,
                width: '16rem'
              }}>
                <div style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
                   <p style={{ fontWeight: 600, color: 'var(--text-main)' }}>Hello {userName.split(' ')[0]}!</p>
                </div>
                <Link 
                  to={`/${role}/verify`} 
                  style={{ display: 'block', color: 'var(--primary)', fontWeight: 500, fontSize: '0.9rem' }}
                  onClick={() => setNotificationsOpen(false)}
                >
                  Verify Certificates &rarr;
                </Link>
              </div>
              </>
            )}
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="dashboard-content-area">
          <div className="dashboard-content-wrapper animate-fade-in-up">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout;
