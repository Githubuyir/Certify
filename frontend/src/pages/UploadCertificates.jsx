import React, { useState } from 'react';
import { UploadCloud, FileSpreadsheet, AlertCircle, CheckCircle2, ChevronRight, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import './UploadCertificates.css';

const UploadCertificates = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [parsedRecords, setParsedRecords] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setUploadComplete(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadComplete(false);
    }
  };

  const parseCSV = (text) => {
    // Strip trailing commas from empty excel exports (',,,,') rejecting dead strings
    const lines = text.split(/\r?\n/).filter(line => line.replace(/,/g, '').trim() !== '');
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',').map(item => item.trim());
        data.push({
           id: i,
           name: row[0] || '',
           email: row[1] || '',
           course: row[2] || '',
           start: row[3] || '',
           end: row[4] || '',
           status: (row[0] && row[1]) ? 'Valid' : 'Missing Info'
        });
    }
    return data;
  };

  const handleUpload = () => {
    if (!file) return;
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
       const text = e.target.result;
       const parsed = parseCSV(text);
       setParsedRecords(parsed);
       
       setTimeout(() => {
          setIsUploading(false);
          setUploadComplete(true);
       }, 800);
    };
    reader.readAsText(file);
  };

  const handleConfirmGenerate = async () => {
    setIsGenerating(true);
    let successCount = 0;
    
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const org = user.institutionName || 'Tech Academy Institute';

    for(const record of parsedRecords) {
       if (record.status !== 'Valid') continue;
       
       const parts = record.end.split('-');
       let endDateObj = new Date();
       if (parts.length === 3) endDateObj = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);

       try {
         const response = await fetch('http://localhost:5000/api/certificates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              certId: `CERT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000).toString()}`,
              studentName: record.name,
              studentEmail: record.email,
              organization: org,
              courseDomain: record.course,
              issueDate: new Date(),
              endDate: endDateObj
            })
         });
         if (response.ok) successCount++;
       } catch (err) {}
    }
    
    setIsGenerating(false);
    toast.success(`Successfully batch minted ${successCount} secure certificates!`);
    setUploadComplete(false);
    setFile(null);
    setParsedRecords([]);
  };

  const handleDownloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,StudentName,StudentEmail,CourseDomain,StartDate,EndDate\nJane Doe,jane@example.com,Data Science,01-01-2025,01-06-2025\nJohn Smith,john@university.edu,Machine Learning,01-02-2025,01-07-2025";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Certify_Standard_Upload_Template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="upload-certificates-page">

      {/* Header */}
      <div className="upload-header">
        <p className="upload-subtitle">Batch Operations</p>
        <h1 className="upload-title">Upload Certificates Data</h1>
        <p className="upload-desc">Bulk issue certificates by uploading a structured Excel (.xlsx) or CSV file containing student and course details.</p>
      </div>

      <div className="upload-main-grid">

        {/* Main Upload Zone */}
        <div>
          <div
            className={`upload-dropzone ${file ? 'has-file' : ''}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {/* Background embellishment */}
            <div className="dropzone-bg-accent"></div>

            <div className="dropzone-content">
              <div className="dropzone-icon-wrapper">
                <UploadCloud size={36} strokeWidth={2} />
              </div>

              <h3 className="dropzone-title">
                {file ? 'File Selected' : 'Drag & Drop your file here'}
              </h3>

              <p className="dropzone-desc">
                {file
                  ? 'Ready to process your data. Click the button below to start the upload sequence.'
                  : 'We support .xlsx, .xls, and .csv formats. Maximum file size is 50MB per upload batch.'}
              </p>

              <input
                type="file"
                id="file-upload"
                style={{ display: 'none' }}
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileChange}
              />

              {!file && (
                <label htmlFor="file-upload" className="file-browse-btn">
                  <FileSpreadsheet size={20} className="file-browse-icon" />
                  Browse Local Files
                </label>
              )}

              {/* Selected File Card */}
              {file && (
                <div className="selected-file-card">
                  <div className="file-info-group">
                    <div className="file-type-icon">
                      <FileSpreadsheet size={24} />
                    </div>
                    <div className="file-details">
                      <p className="file-name">{file.name}</p>
                      <p className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    className="remove-file-btn"
                    onClick={() => { setFile(null); setUploadComplete(false); }}
                    title="Remove file"
                  >
                    <AlertCircle size={20} />
                  </button>
                </div>
              )}

              {/* Upload Button */}
              {file && !uploadComplete && (
                <button
                  className="btn btn-primary upload-submit-btn"
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <span className="upload-processing">
                      <UploadCloud size={22} className="icon-bounce" /> Processing Details...
                    </span>
                  ) : (
                    <>
                      <UploadCloud size={22} />
                      <span>Upload & Process Data</span>
                    </>
                  )}
                  {/* Progress bar simulation overlay */}
                  {isUploading && <div className="progress-bar-overlay"></div>}
                </button>
              )}

              {/* Success Message */}
              {uploadComplete && (
                <div className="upload-success-msg">
                  <CheckCircle2 size={24} className="success-icon" />
                  <div>
                    <h4 className="success-title">Upload Successful</h4>
                    <p className="success-desc">Successfully processed {parsedRecords.length} records. Please review the data preview below before finalizing.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Guidelines Sidebar */}
        <div>
          <div className="upload-guidelines">
            {/* Top accent */}
            <div className="guidelines-top-accent"></div>

            <h3 className="guidelines-title">Formatting Guidelines</h3>

            <div className="guidelines-list">
              <div className="guideline-item">
                <div className="guideline-number">1</div>
                <div>
                  <h4 className="guideline-content-title">Required Headers</h4>
                  <p className="guideline-content-desc">Top row must exactly match: <code className="code-badge">StudentName</code>, <code className="code-badge">CourseDomain</code>, <code className="code-badge">StartDate</code>, <code className="code-badge">EndDate</code>.</p>
                </div>
              </div>

              <div className="guideline-item">
                <div className="guideline-number">2</div>
                <div>
                  <h4 className="guideline-content-title">Date Formatting</h4>
                  <p className="guideline-content-desc">All dates must be formatted strictly as <code className="code-badge secondary">DD-MM-YYYY</code>.</p>
                </div>
              </div>

              <div className="guideline-item">
                <div className="guideline-number">3</div>
                <div>
                  <h4 className="guideline-content-title">File Limitations</h4>
                  <p className="guideline-content-desc">Maximum of 5,000 rows per batch upload. Larger batches should be split.</p>
                </div>
              </div>
            </div>

            <div className="template-download-section">
              <button className="template-download-btn" onClick={handleDownloadTemplate}>
                <Download size={18} className="template-download-icon" />
                Download Spreadsheet Template
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      {uploadComplete && (
        <div className="data-preview-section">
          <div className="preview-header">
            <div>
              <h3 className="preview-title">Data Preview</h3>
              <p className="preview-subtitle">Showing first 4 validating records from the uploaded batch</p>
            </div>
            <button 
              className="btn btn-primary preview-confirm-btn flex items-center gap-2"
              onClick={handleConfirmGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? 'Minting Credentials...' : 'Confirm & Generate'} <ChevronRight size={18} />
            </button>
          </div>

          <div className="preview-table-container">
            <div className="preview-table-scroll">
              <table className="preview-table">
                <thead>
                  <tr>
                    <th className="preview-th">Student Name</th>
                    <th className="preview-th">Course / Domain</th>
                    <th className="preview-th">Start Date</th>
                    <th className="preview-th">End Date</th>
                    <th className="preview-th">Status Check</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedRecords.slice(0, 4).map((row) => (
                    <tr key={row.id} className="preview-tr">
                      <td className="preview-td main">{row.name}</td>
                      <td className="preview-td muted">{row.course}</td>
                      <td className="preview-td muted">{row.start}</td>
                      <td className="preview-td muted">{row.end}</td>
                      <td className="preview-td">
                        <span className={`status-badge 
                          ${row.status === 'Valid' ? 'status-valid' : 'status-invalid'}`}>
                          {row.status === 'Valid' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadCertificates;
