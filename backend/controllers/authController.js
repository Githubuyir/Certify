const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Register new user
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if account exactly matching both email AND role exists
    const userRole = role || 'student';
    const userExists = await User.findOne({ email, role: userRole });
    if (userExists) return res.status(400).json({ message: `User already uniquely exists as a ${userRole} with this email.` });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
      institutionName: role === 'admin' ? 'Tech Academy Institute' : undefined
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        institutionName: user.institutionName,
        companyWebsite: user.companyWebsite,
        linkedinId: user.linkedinId,
        verificationsCount: user.verificationsCount,
        downloadsCount: user.downloadsCount,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    const userRole = role || 'student';
    const user = await User.findOne({ email, role: userRole });
    
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        institutionName: user.institutionName,
        companyWebsite: user.companyWebsite,
        linkedinId: user.linkedinId,
        verificationsCount: user.verificationsCount,
        downloadsCount: user.downloadsCount,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgotpassword
const forgotPassword = async (req, res) => {
  try {
    const { email, role } = req.body;
    const userRole = role || 'student';

    const user = await User.findOne({ email, role: userRole });
    if (!user) return res.status(404).json({ message: `No ${userRole} found uniquely with this email` });

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    // Mock Email Output natively
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    console.log(`\n📧 MOCK EMAIL SENT TO ${user.email}\nPassword Reset Link: ${resetUrl}\n`);
    
    res.status(200).json({ success: true, message: 'Email sent', mockLink: resetUrl });
  } catch(err) {
    res.status(500).json({ message: 'Error processing request', error: err.message });
  }
};

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:token
const resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset completely successful' });
  } catch(err) {
    res.status(500).json({ message: 'Error processing request', error: err.message });
  }
};

// Generate JWT Helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

// @desc    Google Auth Native Login/Register
// @route   POST /api/auth/google
const googleAuth = async (req, res) => {
  try {
    const { token, role, action } = req.body;
    const userRole = role || 'student';
    
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const { name, email } = ticket.getPayload();
    let user = await User.findOne({ email, role: userRole });

    if (action === 'login') {
      if (!user) {
        return res.status(404).json({ message: `No ${userRole} account found for this Google email. Please register first.` });
      }
    } else if (action === 'register') {
      if (user) {
        return res.status(400).json({ message: `A ${userRole} account already securely exists for this email. Please sign in instead.` });
      }
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), salt);
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: userRole,
        institutionName: userRole === 'admin' ? 'Tech Academy Institute' : undefined
      });
    }

    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      institutionName: user.institutionName,
      companyWebsite: user.companyWebsite,
      linkedinId: user.linkedinId,
      verificationsCount: user.verificationsCount,
      downloadsCount: user.downloadsCount,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: 'Google Authentication Failed', error: err.message });
  }
};

// @desc    Update user specific dashboard metrics natively
// @route   PUT /api/auth/metrics
const updateMetrics = async (req, res) => {
  try {
    const { email, role, metric } = req.body;
    const userRole = role || 'student';
    
    let user = await User.findOne({ email, role: userRole });
    if (!user) return res.status(404).json({ message: 'User strictly not found' });

    if (metric === 'verifications') {
      user.verificationsCount = (user.verificationsCount || 0) + 1;
    } else if (metric === 'downloads') {
      user.downloadsCount = (user.downloadsCount || 0) + 1;
    }

    await user.save();
    
    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      verificationsCount: user.verificationsCount,
      downloadsCount: user.downloadsCount
    });
  } catch (err) {
    res.status(500).json({ message: 'Metric Update Failed', error: err.message });
  }
};

// @desc    Update user profile data securely
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { _id, email, role, name, institutionName, companyWebsite, linkedinId } = req.body;
    const userRole = role || 'student';
    
    let user;
    if (_id) user = await User.findById(_id);
    else user = await User.findOne({ email, role: userRole });

    if (!user) return res.status(404).json({ message: 'User strictly not found' });

    if (name) user.name = name;
    if (email) user.email = email;
    if (institutionName !== undefined) user.institutionName = institutionName;
    if (companyWebsite !== undefined) user.companyWebsite = companyWebsite;
    if (linkedinId !== undefined) user.linkedinId = linkedinId;

    await user.save();
    
    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      institutionName: user.institutionName,
      companyWebsite: user.companyWebsite,
      linkedinId: user.linkedinId,
      verificationsCount: user.verificationsCount,
      downloadsCount: user.downloadsCount,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: 'Profile Update Failed', error: err.message });
  }
};

module.exports = { register, login, forgotPassword, resetPassword, googleAuth, updateMetrics, updateProfile };
