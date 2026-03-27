import React from 'react';
import { Award, X } from 'lucide-react';

const CertificatePreview = ({
  studentName = 'Steven Abraham',
  courseName = 'Full Stack Web Development Program',
  domain = 'Software Engineering',
  endDate = 'October 15, 2025',
  issueDate = 'October 15, 2025',
  certId = 'CERT-2025-WDEV-7842',
  organization = 'Tech Academy Institute',
  onClose = null
}) => {
  const adminData = (() => { try { return JSON.parse(localStorage.getItem('adminProfile')) || {}; } catch(e) { return {}; } })();
  const studentData = (() => { try { return JSON.parse(localStorage.getItem('user')) || {}; } catch(e) { return {}; } })();
  const displayOrg = adminData.institutionName || studentData.institution || organization || 'Cloud Services Inc.';
  const adminName = adminData.name || 'Admin User';

  return (
    <div
      className="relative shadow-2xl flex flex-col items-center mx-auto"
      style={{
        width: '100%',
        maxWidth: 'min(1050px, calc(85vh * 1.414))',
        aspectRatio: '1.414 / 1',
        border: 'min(3vw, 18px) solid #1e3a8a',
        padding: 'min(4vw, 40px)',
        backgroundColor: '#ffffff' // Hardcoded to prevent CSS overrides making it black
      }}
    >
      {/* Absolute Close Button inside the certificate at Top Left aligned with padding */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute z-[200] flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 shadow-sm border border-red-200 rounded-full text-[10px] sm:text-xs font-bold transition-transform hover:scale-105"
          style={{ top: 'min(3vw, 24px)', left: 'min(3vw, 24px)' }}
        >
          <X size={16} /> Close
        </button>
      )}

      {/* Inner Gold Borders */}
      <div className="absolute inset-2 sm:inset-3 border-2 border-[#fbbf24]"></div>
      <div className="absolute inset-3 sm:inset-4 border border-[#fbbf24] opacity-50"></div>

      {/* Top Organization Header perfectly centered and right-aligned parts */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 10, minHeight: '60px', marginBottom: 'min(4vw, 32px)' }}>

        <div style={{ flex: 1 }}></div>

        <div style={{ flex: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
          <Award className="text-[#1e3a8a]" style={{ width: 'min(5vw, 48px)', height: 'min(5vw, 48px)', marginBottom: 'min(1vw, 8px)' }} />
          <h1 className="font-black tracking-widest uppercase text-[#1e3a8a] leading-tight px-4" style={{ fontSize: 'min(2.5vw, 24px)' }}>{displayOrg}</h1>
        </div>

        <div style={{ flex: 1, textAlign: 'right' }}>
          <span className="font-mono font-bold text-[#1e3a8a] bg-slate-50 border border-slate-200 rounded" style={{ padding: '2px 8px', fontSize: 'min(1.2vw, 14px)' }}>{certId}</span>
        </div>
      </div>

      {/* Main Title */}
      <div className="text-center w-full my-auto flex flex-col items-center justify-center relative z-10">
        <h2 className="font-serif italic text-slate-800 text-xl sm:text-2xl md:text-3xl lg:text-5xl mb-2 sm:mb-4 lg:mb-6">
          Certificate of Excellence
        </h2>
        <p className="font-semibold tracking-[0.1em] sm:tracking-[0.2em] text-slate-500 uppercase text-[8px] sm:text-[10px] md:text-xs lg:text-sm mb-2 sm:mb-4">
          This is proudly presented to
        </p>
        <h3 className="font-bold text-[#1e3a8a] border-b-2 border-[#fbbf24] inline-block font-serif tracking-wide text-2xl sm:text-3xl md:text-4xl lg:text-5xl pb-1 lg:pb-3 mb-2 lg:mb-4 px-4 sm:px-8 lg:px-12">
          {studentName}
        </h3>
        <p className="text-slate-600 font-serif leading-relaxed mx-auto w-full max-w-[90%] lg:max-w-[85%] text-[9px] sm:text-xs md:text-sm lg:text-lg mt-1 lg:mt-3">
          This is awarded for the successful completion of certificate requirements and demonstrated profound proficiency in the domain of <br />
          <strong className="text-[#1e3a8a] font-sans block text-xs sm:text-sm md:text-lg lg:text-2xl mt-1 lg:mt-3">{courseName}</strong>
          <span className="uppercase tracking-widest text-[#fbbf24] font-bold block text-[8px] sm:text-[10px] md:text-xs lg:text-sm mt-0.5 lg:mt-1">({domain})</span>
        </p>
      </div>

      {/* Signatures Area */}
      <div className="w-full flex justify-between items-end mt-auto relative z-10 px-2 sm:px-4 lg:px-6">
        <div className="text-center w-16 sm:w-24 md:w-32 lg:w-40">
          <div className="border-b border-slate-400 font-serif italic text-slate-800 text-[10px] sm:text-xs md:text-base lg:text-xl pb-0.5 lg:pb-1 mb-0.5 lg:mb-1">
            {adminName}
          </div>
          <p className="uppercase tracking-widest font-bold text-slate-500 text-[6px] sm:text-[8px] lg:text-[10px]">Executive Director</p>
        </div>

        <div className="flex justify-center flex-1">
          <div className="rounded-full border-double border-[#fbbf24] bg-white flex flex-col items-center justify-center shadow-lg relative transform -translate-y-1 md:-translate-y-2 lg:-translate-y-4 w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 border-2 lg:border-4">
            <span className="uppercase font-black tracking-widest text-[#fbbf24] text-[4px] sm:text-[6px] lg:text-[8px]">Official</span>
            <Award className="text-[#fbbf24] my-0.5 lg:my-1 w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-12 lg:h-12" />
            <span className="uppercase font-black tracking-widest text-[#fbbf24] text-[4px] sm:text-[6px] lg:text-[8px]">Seal</span>
          </div>
        </div>

        <div className="text-center w-16 sm:w-24 md:w-32 lg:w-40">
          <div className="border-b border-slate-400 font-serif text-slate-800 flex items-end justify-center text-[10px] sm:text-xs md:text-base lg:text-xl min-h-[16px] sm:min-h-[22px] md:min-h-[30px] lg:min-h-[40px] pb-0.5 lg:pb-1 mb-0.5 lg:mb-1">
            {issueDate}
          </div>
          <p className="uppercase tracking-widest font-bold text-slate-500 text-[6px] sm:text-[8px] lg:text-[10px]">Issued Date</p>
        </div>
      </div>
    </div>
  );
};

export default CertificatePreview;
