const Certificate = require('../models/Certificate');
const User = require('../models/User');

// @desc    Get all certificates natively filtered by target email or organization array optionally
// @route   GET /api/certificates
const getCertificates = async (req, res) => {
  try {
    const { email, organization } = req.query;
    const filter = {};
    if (email) filter.studentEmail = email;
    if (organization) filter.organization = organization;
    
    const certs = await Certificate.find(filter).sort({ createdAt: -1 });
    res.json(certs);
  } catch(error) {
    res.status(500).json({ message: 'Server Error fetching certificates', error: error.message });
  }
};

// @desc    Verify single raw certificate
// @route   GET /api/certificates/verify/:id
const verifyCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findOne({ certId: req.params.id });
    if (!cert) return res.status(404).json({ valid: false, message: 'Invalid Certificate' });
    
    if (cert.status === 'valid') {
       await User.findOneAndUpdate(
         { institutionName: cert.organization, role: 'admin' },
         { $inc: { verificationsCount: 1 } }
       );
    }

    res.json({ valid: true, data: cert });
  } catch(error) {
    res.status(500).json({ valid: false, message: 'Server Verification Error', error: error.message });
  }
};

// @desc    Create a new certificate exclusively binding the Student Email
// @route   POST /api/certificates
const createCertificate = async (req, res) => {
  try {
    const { certId, studentName, studentEmail, organization, courseDomain, issueDate, endDate, status } = req.body;
    
    // Check if exists
    const existing = await Certificate.findOne({ certId });
    if(existing) return res.status(400).json({ message: 'Certificate ID already exists in DB' });

    const newCert = new Certificate({
      certId, 
      studentName, 
      studentEmail,
      organization,
      courseDomain, 
      issueDate: issueDate || new Date(),
      endDate,
      status: status || 'valid'
    });

    const savedCert = await newCert.save();
    res.status(201).json(savedCert);
  } catch(error) {
    res.status(500).json({ message: 'Server Error creating certificate', error: error.message });
  }
};

// @desc    Update certificate status dynamically
// @route   PUT /api/certificates/:id/status
const updateCertificateStatus = async (req, res) => {
  try {
    const cert = await Certificate.findOne({ certId: req.params.id });
    if (!cert) return res.status(404).json({ message: 'Certificate not physically found' });
    
    cert.status = req.body.status || 'valid';
    await cert.save();
    
    res.json(cert);
  } catch(error) {
    res.status(500).json({ message: 'Server Error mutating status', error: error.message });
  }
};

// @desc    Destroy certificate record securely
// @route   DELETE /api/certificates/:id
const deleteCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findOneAndDelete({ certId: req.params.id });
    if (!cert) return res.status(404).json({ message: 'Certificate not physically found' });
    
    res.json({ message: 'Certificate purged securely' });
  } catch(error) {
    res.status(500).json({ message: 'Server Error deleting record', error: error.message });
  }
};

module.exports = { getCertificates, createCertificate, verifyCertificate, updateCertificateStatus, deleteCertificate };
