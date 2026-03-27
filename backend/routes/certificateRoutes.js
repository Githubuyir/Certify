const express = require('express');
const router = express.Router();
const { getCertificates, createCertificate, verifyCertificate, updateCertificateStatus, deleteCertificate } = require('../controllers/certificateController');

router.get('/verify/:id', verifyCertificate);
router.get('/', getCertificates);
router.post('/', createCertificate);
router.put('/:id/status', updateCertificateStatus);
router.delete('/:id', deleteCertificate);

module.exports = router;
