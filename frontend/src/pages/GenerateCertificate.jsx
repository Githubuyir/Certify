import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { FilePlus, QrCode, RefreshCcw, Sparkles, DownloadCloud } from 'lucide-react';
import toast from 'react-hot-toast';
import html2pdf from 'html2pdf.js';
import CertificatePreview from '../components/CertificatePreview';
import './GenerateCertificate.css';

const GenerateCertificate = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    courseDomain: '',
    startDate: '',
    endDate: '',
    certId: `CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000).toString()}`
  });
  const [isGenerated, setIsGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSaveCertificate = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user')) || {};
      const response = await fetch('http://localhost:5000/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          certId: formData.certId,
          studentName: formData.studentName,
          studentEmail: formData.studentEmail,
          organization: user.institutionName || 'Tech Academy Institute',
          courseDomain: formData.courseDomain,
          issueDate: new Date(),
          endDate: formData.endDate ? new Date(formData.endDate) : new Date()
        })
      });
      
      if(response.ok) {
        toast.success('Certificate saved');
        setIsGenerated(false);
        setFormData({
          studentName: '', studentEmail: '', courseDomain: '', startDate: '', endDate: '',
          certId: `CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000).toString()}`
        });
      } else {
        const errorData = await response.json();
        toast.error('Database Error: ' + (errorData.message || 'Unknown error'));
      }
    } catch(err) {
      toast.error('Network Error: Could not connect to API. Please check your MongoDB validation.');
    }
  };

  const handleDownloadCertificate = () => {
    const element = document.querySelector('.print-certificate-target');
    if (element) {
       const opt = {
         margin: 0,
         filename: `${formData.studentName.replace(/\s+/g, '_')}_Certificate.pdf`,
         image: { type: 'jpeg', quality: 1.0 },
         html2canvas: { scale: 3, useCORS: true },
         jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
       };
       html2pdf().set(opt).from(element).save();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
    }, 1500);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="generate-cert-page">
      
      {/* Page Header */}
      <div className="generate-header">
        <p className="generate-subtitle">Creation</p>
        <h1 className="generate-title">Generate Certificate</h1>
        <p className="generate-desc">Manually issue a unique digital certificate for an individual student.</p>
      </div>

      <div className="generate-main-grid">
        
        {/* Form Section */}
        <div className="generate-form-container">
          <form onSubmit={handleSubmit} className="generate-form-card">
            <div className="generate-form-content">
              <div className="form-section-header">
                 <div className="form-section-icon">
                    <FilePlus size={24} />
                 </div>
                 <h2 className="form-section-title">Certificate Details</h2>
              </div>

              <div className="form-group">
                <label htmlFor="studentName" className="form-label">Student Full Name</label>
                <input
                  id="studentName"
                  placeholder="e.g. Jane Doe"
                  required
                  className="form-input"
                  value={formData.studentName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="studentEmail" className="form-label">Student Target Email</label>
                <input
                  id="studentEmail"
                  type="email"
                  placeholder="e.g. student@university.edu"
                  required
                  className="form-input"
                  value={formData.studentEmail}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="courseDomain" className="form-label">Course / Domain</label>
                <input
                  id="courseDomain"
                  placeholder="e.g. Data Science Bootcamp"
                  required
                  className="form-input"
                  value={formData.courseDomain}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="startDate" className="form-label">Start Date</label>
                  <input
                    id="startDate"
                    type="date"
                    required
                    className="form-input"
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="endDate" className="form-label">End Date</label>
                  <input
                    id="endDate"
                    type="date"
                    required
                    className="form-input"
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="cert-id-section">
                <label htmlFor="certId" className="form-label pl-1">Unique Certificate ID</label>
                <div className="cert-id-wrapper">
                  <div className="cert-id-prefix">
                    ID
                  </div>
                  <input
                    type="text"
                    id="certId"
                    className="cert-id-input"
                    value={formData.certId}
                    readOnly
                  />
                  <button 
                    type="button" 
                    className="cert-id-regen-btn" 
                    title="Regenerate ID"
                    onClick={() => setFormData(prev => ({...prev, certId: `CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000).toString()}`}))}
                  >
                    <RefreshCcw size={18} className="cert-id-regen-icon" /> 
                    <span className="cert-id-regen-text">Regenerate</span>
                  </button>
                </div>
                <p className="cert-id-help">Auto-generated universally unique identifier (UUID format).</p>
              </div>
            </div>

            <div className="generate-form-actions">
              <button 
                type="submit" 
                className="btn btn-primary generate-submit-btn"
                disabled={isGenerating}
              >
                {isGenerating ? (
                   <span className="generate-processing">
                     <Sparkles size={20} className="animate-spin" /> Issuing Digital Credential...
                   </span>
                ) : (
                  <>
                    <Sparkles size={20} className="generate-sparkle-icon" /> Generate Certificate
                  </>
                )}
                {isGenerating && <div className="progress-bar-overlay"></div>}
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Pane */}
        <div className="preview-pane-container">
          <div className="preview-pane-card">
            {/* Background elements */}
            <div className="preview-bg-glow"></div>
            <div className="preview-bg-line"></div>

            <h3 className="preview-header-title">
              <QrCode size={20} className="preview-qr-icon" />
              Real-time Preview
            </h3>
            
            <div className="preview-content">
              <div className="preview-field">
                <span className="preview-field-label">Student Name</span>
                <p className="preview-field-value">{formData.studentName || '—'}</p>
              </div>
              
              <div className="preview-field">
                <span className="preview-field-label">Course / Domain</span>
                <p className="preview-field-value normal">{formData.courseDomain || '—'}</p>
              </div>
              
              <div className="preview-grid-row">
                <div className="preview-field">
                  <span className="preview-field-label">Duration</span>
                  <div className="preview-date-group">
                    <p>{formData.startDate ? new Date(formData.startDate).toLocaleDateString() : 'Start Date'}</p>
                    <p className="preview-date-divider">to</p>
                    <p>{formData.endDate ? new Date(formData.endDate).toLocaleDateString() : 'End Date'}</p>
                  </div>
                </div>
                
                 <div className="preview-qr-box">
                    <QrCode size={48} className="preview-qr-large" strokeWidth={1.5} />
                    <span className="preview-qr-label">Valid Code</span>
                 </div>
              </div>
            </div>
            
            <div className="preview-footer">
              The finalized high-resolution PDF template will be available for download once generated.
            </div>
          </div>
        </div>
        
      </div>

      {/* Final Certificate Modal Overlay */}
      {isGenerated && (
        <div 
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 overflow-y-auto" 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setIsGenerated(false)}
        >
          <div className="relative w-full max-w-5xl flex flex-col items-center animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="w-full print-certificate-target bg-white rounded-xl overflow-hidden shadow-2xl">
              <CertificatePreview 
                studentName={formData.studentName}
                courseName={formData.courseDomain}
                domain="Credential"
                endDate={formData.endDate ? new Date(formData.endDate).toLocaleDateString() : new Date().toLocaleDateString()}
                issueDate={new Date().toLocaleDateString()}
                certId={formData.certId}
                organization={JSON.parse(localStorage.getItem('user'))?.institutionName || 'Tech Academy Institute'}
                onClose={() => setIsGenerated(false)}
              />
            </div>
            
            {/* Modal Action Buttons */}
            <div className="flex gap-4 mt-6 hide-on-print">
              <button 
                onClick={handleSaveCertificate} 
                className="px-6 py-3 bg-[#1e3a8a] text-white font-bold rounded-lg shadow-lg hover:bg-blue-800 transition hover:scale-105 flex items-center gap-2"
              >
                <FilePlus size={18} /> Save
              </button>
              <button 
                onClick={handleDownloadCertificate} 
                className="px-6 py-3 bg-white text-[#1e3a8a] font-bold rounded-lg shadow-lg border border-[#1e3a8a] hover:bg-blue-50 transition hover:scale-105 flex items-center gap-2"
              >
                <DownloadCloud size={18} /> Download
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default GenerateCertificate;
