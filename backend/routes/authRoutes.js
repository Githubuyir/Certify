const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPassword, googleAuth, updateMetrics, updateProfile } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:token', resetPassword);
router.post('/google', googleAuth);
router.put('/metrics', updateMetrics);
router.put('/profile', updateProfile);

module.exports = router;
