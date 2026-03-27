import React, { useState, useEffect } from 'react';
import { Eye, Edit2, Trash2, Search, Filter, DownloadCloud, MoreHorizontal, CheckCircle2, XCircle, AlertCircle, Share2, FileDown } from 'lucide-react';
import toast from 'react-hot-toast';
import html2pdf from 'html2pdf.js';
import CertificatePreview from '../components/CertificatePreview';
import './ManageCertificates.css';

const ManageCertificates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCert, setSelectedCert] = useState(null);
  const [dbData, setDbData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [downloadingCert, setDownloadingCert] = useState(null);
  
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
      setExportMenuOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchCertificates = () => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const orgQuery = user.institutionName ? `?organization=${encodeURIComponent(user.institutionName)}` : '';

    fetch(`http://localhost:5000/api/certificates${orgQuery}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const formattedData = data.map(cert => ({
            id: cert.certId,
            name: cert.studentName,
            email: cert.studentEmail || 'N/A',
            domain: cert.courseDomain,
            issueDate: new Date(cert.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }),
            endDate: cert.endDate ? new Date(cert.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }) : null,
            rawDate: new Date(cert.issueDate),
            status: cert.status,
            isLive: true
          }));
          setDbData(formattedData);
        }
      })
      .catch(err => console.error("API Fetch Error:", err));
  };

  React.useEffect(() => {
    fetchCertificates();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/certificates/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchCertificates();
    } catch (e) { console.error(e) }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/certificates/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        toast.success("Certificate deleted successfully", { duration: 4000 });
        fetchCertificates();
      }
    } catch (e) { toast.error("Database Purge Command Failed") }
  };

  const handleExport = (type) => {
     const dataToExport = type === 'all' ? dbData : filteredData;
     let csv = "CertificateID,StudentName,Email,Course,IssueDate,Status\n";
     dataToExport.forEach(row => {
        csv += `"${row.id}","${row.name}","${row.email}","${row.domain}","${row.issueDate}","${row.status}"\n`;
     });
     const blob = new Blob([csv], { type: 'text/csv' });
     const url = window.URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = `Certificates_${type}.csv`;
     a.click();
  };

  useEffect(() => {
    if(downloadingCert) {
      setTimeout(() => {
        const element = document.querySelector('.hidden-print-target');
        if (element) {
           const opt = {
             margin: 0,
             filename: `${downloadingCert.name.replace(/\s+/g, '_')}_Certificate.pdf`,
             image: { type: 'jpeg', quality: 1.0 },
             html2canvas: { scale: 2, useCORS: true },
             jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
           };
           html2pdf().set(opt).from(element).save().then(() => setDownloadingCert(null));
           toast.success("Certificate securely downloaded to device.");
        }
      }, 500);
    }
  }, [downloadingCert]);

  const filteredData = dbData.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          d.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          d.domain.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter === 'recent') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      matchesDate = d.rawDate >= thirtyDaysAgo;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const itemsPerPage = 10;
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);
  const currentData = filteredData.slice(startIndex > 0 ? startIndex - 1 : 0, endIndex);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'valid':
        return <span className="status-badge status-verified"><CheckCircle2 size={14} /> Valid</span>;
      case 'revoked':
        return <span className="status-badge status-revoked"><XCircle size={14} /> Revoked</span>;
      case 'pending':
        return <span className="status-badge status-pending"><AlertCircle size={14} /> Pending</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="manage-certs-page">

      {/* Page Header */}
      <div className="manage-header">
        <p className="manage-subtitle">Management</p>
        <h1 className="manage-title">Manage Certificates</h1>
        <p className="manage-desc">View, edit, revoke, or delete certificates issued across your organization.</p>
      </div>

      {/* Main Table Card */}
      <div className="manage-table-card">

        {/* Toolbar */}
        <div className="manage-toolbar">

          <div className="manage-search-wrapper">
            <Search className="manage-search-icon" size={18} />
            <input
              type="text"
              placeholder="Search by student name, ID, or domain..."
              className="manage-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="manage-toolbar-actions flex items-center gap-3">
            <select 
              className="manage-select"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="valid">Valid</option>
              <option value="revoked">Revoked</option>
            </select>
            
            <select 
              className="manage-select"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="recent">Recently Created</option>
            </select>

            <div className="relative">
              <button 
                className="manage-toolbar-btn" 
                onClick={(e) => { e.stopPropagation(); setExportMenuOpen(!exportMenuOpen); }}
              >
                <FileDown size={16} className="manage-toolbar-btn-icon" />
                <span className="font-semibold" style={{ marginLeft: '4px' }}>Export</span>
              </button>
              
              {exportMenuOpen && (
                <div className="dropdown-menu" onClick={e => e.stopPropagation()}>
                   <button className="dropdown-item" onClick={() => handleExport('filtered')}>
                     <DownloadCloud size={16} className="dropdown-item-icon" /> Export Filtered
                   </button>
                   <button className="dropdown-item" onClick={() => handleExport('all')}>
                     <DownloadCloud size={16} className="dropdown-item-icon" /> Export All Data
                   </button>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Data Table */}
        <div className="manage-table-container">
          <table className="manage-table">
            <thead>
              <tr>
                <th className="manage-th">Certificate Info</th>
                <th className="manage-th">Student Name</th>
                <th className="manage-th">Issue Date</th>
                <th className="manage-th">Status</th>
                <th className="manage-th right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((row) => (
                  <tr key={row.id} className="manage-tr">
                    <td className="manage-td">
                      <div className="cert-id">{row.id}</div>
                      <div className="cert-domain">{row.domain}</div>
                    </td>
                    <td className="manage-td">
                      <div className="student-info-cell">
                        <div className="student-avatar">
                          {row.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="student-name">{row.name}</span>
                      </div>
                    </td>
                    <td className="manage-td issue-date">{row.issueDate}</td>
                    <td className="manage-td">{getStatusBadge(row.status)}</td>
                    <td className="manage-td right">
                      <div className="row-actions relative">
                        <button className="action-btn view" title="View details" onClick={() => setSelectedCert(row)}>
                          <Eye size={18} />
                        </button>
                        
                        {row.status !== 'valid' ? (
                           <button className="action-btn" title="Mark Valid" onClick={() => handleUpdateStatus(row.id, 'valid')} style={{ color: 'var(--success)' }}>
                              <CheckCircle2 size={18} />
                           </button>
                        ) : (
                           <button className="action-btn revoke" title="Revoke Status" onClick={() => handleUpdateStatus(row.id, 'revoked')}>
                              <XCircle size={18} />
                           </button>
                        )}
                        
                        <button className="action-btn" title="Delete Record" onClick={() => handleDelete(row.id)} style={{ color: 'var(--error)' }}>
                           <Trash2 size={18} />
                        </button>

                        <button 
                          className="action-btn more" 
                          title="More Actions"
                          onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === row.id ? null : row.id); }}
                        >
                          <MoreHorizontal size={20} />
                        </button>
                        
                        {openMenuId === row.id && (
                          <div className="dropdown-menu context-menu" onClick={e => e.stopPropagation()}>
                            <button className="dropdown-item" onClick={() => { setDownloadingCert(row); setOpenMenuId(null); }}>
                               <DownloadCloud size={16} className="dropdown-item-icon" /> Download
                            </button>
                            <button className="dropdown-item" onClick={() => { toast.success("Share link copied to clipboard."); setOpenMenuId(null); }}>
                               <Share2 size={16} className="dropdown-item-icon" /> Share
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-state">
                    No certificates found {searchTerm}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="manage-pagination">
          <span className="pagination-text">Showing {startIndex} to {endIndex} of {totalItems} entries</span>
          <div className="pagination-controls">
            <button className="pagination-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Previous</button>
            {Array.from({ length: totalPages }, (_, i) => (
               <button 
                 key={i + 1} 
                 className={`pagination-page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                 onClick={() => setCurrentPage(i + 1)}
               >
                 {i + 1}
               </button>
            ))}
            <button className="pagination-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>Next</button>
          </div>
        </div>

      </div>

      {/* Certificate Modal Overlay */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8 md:p-12 overflow-y-auto"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(2px)' }}
          onClick={() => setSelectedCert(null)}
        >
          <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <CertificatePreview
              studentName={selectedCert.name}
              courseName={selectedCert.domain}
              domain={selectedCert.domain}
              endDate={selectedCert.endDate || selectedCert.issueDate}
              issueDate={selectedCert.issueDate}
              certId={selectedCert.id}
              organization={JSON.parse(localStorage.getItem('user'))?.institutionName || "Tech Academy Institute"}
              onClose={() => setSelectedCert(null)}
            />
          </div>
        </div>
      )}

      {/* Hidden Print Target for Dynamic Generation */}
      {downloadingCert && (
        <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }} className="hidden-print-target">
            <CertificatePreview
              studentName={downloadingCert.name}
              courseName={downloadingCert.domain}
              domain={downloadingCert.domain}
              endDate={downloadingCert.endDate || downloadingCert.issueDate}
              issueDate={downloadingCert.issueDate}
              certId={downloadingCert.id}
              organization={JSON.parse(localStorage.getItem('user'))?.institutionName || "Tech Academy Institute"}
            />
        </div>
      )}

    </div>
  );
};

export default ManageCertificates;
