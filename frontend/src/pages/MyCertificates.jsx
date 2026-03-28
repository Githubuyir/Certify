import React, { useState } from 'react';
import { Eye, DownloadCloud, Search, CheckCircle2, Award, Calendar, ExternalLink, Linkedin, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import CertificatePreview from '../components/CertificatePreview';
import './MyCertificates.css';
import API_URL from "../api";

const MyCertificates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCert, setSelectedCert] = useState(null);
  const [downloadingCert, setDownloadingCert] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [certs, setCerts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(user);
    if (user?.email) {
      fetch(`${API_URL}/api/certificates?email=${user.email}`)
        .then(res => res.json())
        .then(data => setCerts(data))
        .catch(console.error);
    }
  }, []);

  const handleDownload = async (cert) => {
    setDownloadingCert(cert); 
    setTimeout(async () => {
      if (currentUser) {
        try {
          const metricRes = await fetch(`${API_URL}/api/auth/metrics`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: currentUser.email, role: currentUser.role, metric: 'downloads' })
          });
          if (metricRes.ok) {
            const updatedUser = await metricRes.json();
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setCurrentUser(updatedUser);
            window.dispatchEvent(new Event('profileUpdated'));
          }
        } catch (e) { }
      }
    }, 600);
  };

  React.useEffect(() => {
    if(downloadingCert) {
      setTimeout(() => {
        const element = document.querySelector('.student-hidden-print-target');
        if (element) {
           const opt = {
             margin: 0,
             filename: `${downloadingCert.courseDomain.replace(/\s+/g, '_')}_Certificate.pdf`,
             image: { type: 'jpeg', quality: 1.0 },
             html2canvas: { scale: 2, useCORS: true },
             jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
           };
           html2pdf().set(opt).from(element).save().then(() => setDownloadingCert(null));
           setToastMsg("Certificate securely downloaded to device.");
           setTimeout(() => setToastMsg(''), 4000);
        }
      }, 500);
    }
  }, [downloadingCert]);

  const handleShare = (cert) => {
    try {
      const user = JSON.parse(localStorage.getItem('user')) || {};
      if (!user.linkedinId) {
        setToastMsg("Please connect your LinkedIn profile in Settings to share your certificate.");
        setTimeout(() => setToastMsg(''), 4000);
      } else {
        setToastMsg(`Preparing to share ${cert.courseDomain} to LinkedIn profile: ${user.linkedinId}`);
        setTimeout(() => setToastMsg(''), 4000);
      }
    } catch (e) { console.error(e) }
  };

  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-rose-500', 'bg-emerald-500'];

  const filteredData = certs.filter(d =>
    (d.courseDomain || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.certId || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="my-certs-page">

      {/* Header */}
      <div className="my-certs-header">
        <div>
          <p className="my-certs-subtitle">Achievements</p>
          <h1 className="my-certs-title">My Certificates</h1>
          <p className="my-certs-desc">View, download, and share your verified digital credentials.</p>
        </div>

        <div className="my-certs-search-container">
          <div className="my-certs-search-wrapper">
            <Search className="my-certs-search-icon" size={18} />
            <input
              type="text"
              placeholder="Search certificates..."
              className="my-certs-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid View Of Certificates */}
      <div className="my-certs-grid">
        {filteredData.map((cert, index) => {
          const colorCode = colors[index % colors.length];
          return (
            <div key={cert._id || cert.certId} className="my-cert-card">

              {/* Top color bar / accent */}
              <div className={`my-cert-accent-bar ${colorCode}`}></div>

              <div className="my-cert-content">
                <div className="my-cert-top-row">
                  <div className={`my-cert-icon-wrapper ${colorCode.replace('bg-', 'text-')}`} style={{ backgroundColor: 'rgba(var(--primary-rgb, 37, 99, 235), 0.1)' }}>
                    <Award size={24} />
                  </div>
                  <span className="status-badge" style={cert.status === 'revoked' ? {backgroundColor: '#fee2e2', color: '#dc2626', borderColor: '#f87171'} : {}}>
                    {cert.status === 'revoked' ? <X size={14} /> : <CheckCircle2 size={14} />} 
                    {cert.status === 'revoked' ? 'Revoked' : 'Verified'}
                  </span>
                </div>

                <h3 className="my-cert-course">{cert.courseDomain}</h3>
                <p className="my-cert-instructor">{cert.organization || 'Tech Academy Institute'}</p>

                <div className="my-cert-footer">
                  <div className="my-cert-date-row">
                    <Calendar size={16} />
                    <span>Issued: <strong className="my-cert-date-val">{new Date(cert.issueDate).toLocaleDateString()}</strong></span>
                  </div>
                  <div className="my-cert-actions">
                    {cert.status === 'revoked' ? (
                      <span className="text-xs font-bold text-red-500 uppercase tracking-wider w-full text-center py-2 bg-red-50 rounded-md">Credential Invalidated</span>
                    ) : (
                      <>
                        <button className="my-cert-btn download" onClick={() => handleDownload(cert)}>
                          <DownloadCloud size={16} /> Download
                        </button>
                        <button className="my-cert-btn view" title="View Certificate" onClick={() => setSelectedCert(cert)}>
                          <Eye size={16} />
                        </button>
                        <button className="my-cert-btn share" title="Share to LinkedIn" onClick={() => handleShare(cert)}>
                          <Linkedin size={16} /> Share
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {filteredData.length === 0 && (
          <div className="my-certs-empty">
            <Award size={48} className="my-certs-empty-icon" />
            <p className="my-certs-empty-text">No certificates found {searchTerm}</p>
          </div>
        )}
      </div>

      {/* Certificate Modal Overlay */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8 md:p-12 overflow-y-auto"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(2px)' }}
          onClick={() => setSelectedCert(null)}
        >
          <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="w-full print-certificate-target bg-white rounded-xl overflow-hidden shadow-2xl">
              <CertificatePreview
                studentName={selectedCert.studentName}
                courseName={selectedCert.courseDomain}
                domain="Credential"
                endDate={selectedCert.endDate ? new Date(selectedCert.endDate).toLocaleDateString() : new Date(selectedCert.issueDate).toLocaleDateString()}
                issueDate={new Date(selectedCert.issueDate).toLocaleDateString()}
                certId={selectedCert.certId}
                organization={selectedCert.organization || 'Tech Academy Institute'}
                onClose={() => setSelectedCert(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Hidden Print Target for Dynamic Generation */}
      {downloadingCert && (
        <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }} className="student-hidden-print-target">
            <CertificatePreview
              studentName={downloadingCert.studentName}
              courseName={downloadingCert.courseDomain}
              domain="Credential"
              endDate={downloadingCert.endDate ? new Date(downloadingCert.endDate).toLocaleDateString() : new Date(downloadingCert.issueDate).toLocaleDateString()}
              issueDate={new Date(downloadingCert.issueDate).toLocaleDateString()}
              certId={downloadingCert.certId}
              organization={downloadingCert.organization || 'Tech Academy Institute'}
            />
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-xl animate-fade-in-up z-50">
          {toastMsg}
        </div>
      )}

    </div>
  );
};

export default MyCertificates;
