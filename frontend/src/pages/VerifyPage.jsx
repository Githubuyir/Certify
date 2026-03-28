import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CertificatePreview from '../components/CertificatePreview';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Search, CheckCircle, XCircle, Shield, DownloadCloud, UploadCloud } from 'lucide-react';
import API_URL from "../api";

const VerifyPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialId = searchParams.get('id') || '';
  
  const [certId, setCertId] = useState(initialId);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      setCurrentUser(user || null);
    } catch (e) {}

    if (initialId) {
      handleVerify(null, initialId);
    }
  }, [initialId]);

  const handleVerify = async (e, idToVerify = certId) => {
    if (e) e.preventDefault();
    if (!idToVerify.trim()) return;

    setIsVerifying(true);
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/api/certificates/verify/${idToVerify}`);
      const data = await res.json();
      
      if (res.ok && data.valid) {
        setResult({
          valid: true,
          studentName: data.data.studentName,
          course: data.data.courseDomain,
          domain: data.data.courseDomain || 'Credential',
          issuedBy: data.data.organization || 'Tech Academy Institute',
          issueDate: new Date(data.data.issueDate).toLocaleDateString(),
          certId: data.data.certId,
          id: data.data.certId,
          organization: data.data.organization || 'Tech Academy Institute',
          status: data.data.status || 'valid'
        });

        // Natively increment tracking arrays securely if logged in
        if (currentUser) {
           const metricRes = await fetch(`${API_URL}/api/auth/metrics`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: currentUser.email, role: currentUser.role, metric: 'verifications' })
           });
           if (metricRes.ok) {
             const updatedUser = await metricRes.json();
             localStorage.setItem('user', JSON.stringify(updatedUser));
             setCurrentUser(updatedUser);
           }
        }
      } else {
        setResult({ valid: false });
      }
    } catch (err) {
      setResult({ valid: false });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 animate-fade-in-up">
      <div className="mb-8 flex items-center gap-4 border-b pb-6" style={{ borderColor: 'var(--border-color)' }}>
        <div className="text-primary w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)' }}>
          <Shield size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-main" style={{ fontFamily: 'Outfit, sans-serif' }}>Verify Certificate</h1>
          <p className="text-muted mt-1">Check the authenticity of digital credentials instantly.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="p-6 sm:p-8" style={{ background: '#ffffff', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', borderRadius: 'var(--radius-3xl)' }}>
          <form onSubmit={handleVerify} className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input 
                placeholder="e.g. CERT-2025-ABCD" 
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                className="flex-1 text-lg py-3"
              />
              <Button 
                type="button"
                onClick={(e) => handleVerify(e)}
                variant="primary" 
                icon={isVerifying ? null : <Search size={18} />}
                disabled={isVerifying || !certId.trim()}
                className="py-3 px-8 text-lg"
              >
                {isVerifying ? '...' : 'Verify ID'}
              </Button>
            </div>
            
            <div className="flex items-center gap-4 py-2 opacity-60">
              <div className="h-px bg-gray-300 flex-1" style={{ backgroundColor: 'var(--border-color)' }}></div>
              <span className="text-xs text-muted font-bold tracking-widest uppercase">OR</span>
              <div className="h-px bg-gray-300 flex-1" style={{ backgroundColor: 'var(--border-color)' }}></div>
            </div>
            
            <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary transition-all cursor-pointer bg-gray-50 flex flex-col items-center justify-center group" style={{ borderColor: 'var(--border-color)' }}>
              <input 
                 type="file" 
                 id="cert-upload" 
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                 accept=".pdf,.png,.jpg,.jpeg" 
                 onChange={() => handleVerify(null, 'CERT-UPLOAD-VALID')} 
                 disabled={isVerifying}
              />
              <div className="bg-white p-4 rounded-full shadow-sm border border-gray-100 text-primary mb-3 group-hover:scale-110 transition-transform">
                <UploadCloud size={28} />
              </div>
              <span className="font-bold text-main text-lg mb-1">Upload Certificate File</span>
              <span className="text-sm text-muted">Supports PDF, PNG, JPG (Max 5MB)</span>
            </div>
          </form>
        </Card>

        {/* Verification Result */}
        {result && (
          <div className={`animate-fade-in ${result.valid ? '' : 'shake'}`}>
            {result.valid ? (
              result.status === 'revoked' ? (
                <Card className="border-t-4 border-t-red-500 overflow-hidden relative">
                  <div className="relative z-10 w-full mb-8 pt-4">
                    <div className="flex flex-col items-center justify-center gap-2 mb-6 text-center">
                      <XCircle size={56} color="#ef4444" className="mb-2" />
                      <h2 className="text-3xl font-black text-red-600 uppercase tracking-widest">Certificate Revoked</h2>
                      <p className="text-sm font-bold text-red-500 bg-red-50 px-4 py-2 rounded-full border border-red-100">This digital credential was securely invalidated by the issuing institution.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mb-2 p-6 bg-slate-50 rounded-xl border border-slate-200 opacity-70 grayscale">
                      <div>
                        <p className="text-sm text-muted mb-1">Student Name</p>
                        <p className="font-bold text-lg text-slate-500 line-through">{result.studentName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted mb-1">Course / Domain</p>
                        <p className="font-bold text-lg text-slate-500 line-through">{result.course}</p>
                      </div>
                      <div className="col-span-1 md:col-span-2 mt-2 pt-4 border-t border-slate-200">
                         <p className="text-sm text-muted mb-1 text-center">Invalidated Credential ID</p>
                         <p className="font-mono text-xl font-bold tracking-wider text-slate-400 text-center">{result.certId}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="border-t-4 border-t-green-500 overflow-hidden relative">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
                      <CheckCircle size={32} color="var(--success)" />
                      <div>
                        <h2 className="text-2xl font-bold text-success" style={{ color: 'var(--success)' }}>Certificate Verified</h2>
                        <p className="text-sm text-muted">This certificate is an authentic digital record.</p>
                      </div>
                    </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mb-8">
                    <div>
                      <p className="text-sm text-muted mb-1">Student Name</p>
                      <p className="font-bold text-lg">{result.studentName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted mb-1">Course / Domain</p>
                      <p className="font-bold text-lg">{result.course}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted mb-1">Issued By</p>
                      <p className="font-medium">{result.issuedBy}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted mb-1">Issue Date</p>
                      <p className="font-medium">{result.issueDate}</p>
                    </div>
                    <div className="col-span-1 md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-100 mt-2">
                       <p className="text-sm text-muted mb-1">Certificate ID</p>
                       <p className="font-mono text-lg font-bold tracking-wider text-primary">{result.certId}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    {currentUser ? (
                      <Button 
                        variant="primary" 
                        className="flex-1"
                        onClick={() => setShowPreview(true)}
                      >
                        View Full Certificate
                      </Button>
                    ) : (
                      <Button 
                        variant="primary" 
                        className="flex-1"
                        onClick={() => navigate('/login')}
                      >
                        Login to View Full Certificate
                      </Button>
                    )}
                    <Button 
                      variant="outline"
                      className="flex-1"
                      icon={<DownloadCloud size={18} />}
                      onClick={() => window.print()}
                    >
                      Download
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1"
                      onClick={() => alert(`Ready to map ${result.certId} to LinkedIn bindings!`)}
                    >
                      Share
                    </Button>
                  </div>
                </div>
              </Card>
              )
            ) : (
              <Card className="border-t-4 border-t-red-500 text-center py-8">
                <XCircle size={48} color="var(--error)" className="mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--error)' }}>Invalid Certificate</h2>
                <p className="text-muted mb-6">
                  We could not find a valid certificate matching ID: <span className="font-mono font-bold">{certId}</span>
                </p>
                <p className="text-sm text-muted bg-red-50 p-4 rounded-lg inline-block">
                  Please check the certificate ID for typos or contact the issuing institution.
                </p>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Certificate Modal Overlay for Validated Certificates */}
      {showPreview && result?.valid && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8 md:p-12 overflow-y-auto" 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(2px)' }}
          onClick={() => setShowPreview(false)}
        >
          <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <CertificatePreview 
              studentName={result.studentName}
              courseName={result.courseDomain}
              domain="Credential"
              endDate={result.endDate ? new Date(result.endDate).toLocaleDateString() : new Date(result.issueDate).toLocaleDateString()}
              issueDate={new Date(result.issueDate).toLocaleDateString()}
              certId={result.certId}
              organization={result.organization || 'Tech Academy Institute'}
              onClose={() => setShowPreview(false)}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default VerifyPage;
