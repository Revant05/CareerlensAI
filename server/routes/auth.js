const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const Student = require('../models/Student');
const Recruiter = require('../models/Recruiter');
const Admin = require('../models/Admin');
const Token = require('../models/Token');
const RoadmapProgress = require('../models/RoadmapProgress');
const axios = require('axios');

// AI Engine configuration
const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://127.0.0.1:8001';
const INTERNAL_SECRET = process.env.INTERNAL_SECRET || 'careerlens_default_67890';

// Helper to validate text with AI
const validateProfileText = async (text, fieldName) => {
    if (!text) return { isValid: true };
    try {
        const response = await axios.post(`${AI_ENGINE_URL}/validate-profile`, {
            text,
            field_name: fieldName
        }, {
            headers: {
                'x-internal-secret': INTERNAL_SECRET
            }
        });
        return { isValid: response.data.is_valid, reason: response.data.reason };
    } catch (err) {
        console.error(`AI Validation error for ${fieldName}:`, err.message);
        return { isValid: true }; // Bypass if AI is down
    }
};

// Helper to find user in all collections
const findUserByEmail = async (email) => {
    let user = await Student.findOne({ email });
    if (!user) user = await Recruiter.findOne({ email });
    if (!user) user = await Admin.findOne({ email });
    return user;
};

// Helper to find user by ID in all collections
const findUserById = async (id) => {
    let user = await Student.findById(id);
    if (!user) user = await Recruiter.findById(id);
    if (!user) user = await Admin.findById(id);
    return user;
};

// @route   POST api/auth/signup
// @desc    Register user
// @access  Public
router.post('/signup', async (req, res) => {
    const { name, email, password, role, companyName, companyWebsite } = req.body;

    try {
        let user = await findUserByEmail(email);

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const actualRole = role || 'student';

        if (actualRole === 'recruiter') {
            user = new Recruiter({ name, email, password, role: 'recruiter', companyName, companyWebsite });
        } else if (actualRole === 'admin') {
            user = new Admin({ name, email, password, role: 'admin' });
        } else {
            user = new Student({ name, email, password, role: 'student' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = { user: { id: user.id, role: user.role } };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5d' },
            (err, token) => {
                if (err) throw err;
                const userResponse = user.toObject();
                delete userResponse.password;

                res.json({ token, user: userResponse });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await findUserByEmail(email);

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = { user: { id: user.id, role: user.role } };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5d' },
            async (err, token) => {
                if (err) throw err;
                const userResponse = user.toObject();
                delete userResponse.password;

                if (user.role === 'student') {
                    const allProgress = await RoadmapProgress.find({ userId: user.id });
                    const tokens = await Token.find({ userId: user.id }).sort({ issuedAt: -1 });
                    userResponse.roadmapProgress = allProgress;
                    userResponse.completedRoadmaps = allProgress.filter(p => p.isFinished);
                    userResponse.tokens = tokens;
                    userResponse.assessments = user.assessments || [];
                }

                res.json({ token, user: userResponse });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const user = req.user; // Set by auth middleware
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const userObj = user.toObject();
        if (user.role === 'student') {
            const allProgress = await RoadmapProgress.find({ userId: req.user.id });
            const tokens = await Token.find({ userId: req.user.id }).sort({ issuedAt: -1 });
            userObj.roadmapProgress = allProgress;
            userObj.completedRoadmaps = allProgress.filter(p => p.isFinished);
            userObj.tokens = tokens;
            userObj.assessments = user.assessments || [];
        }

        res.json(userObj);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
    try {
        let user = await findUserById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        if (user.role === 'student') {
            const { headline, aspiration, aspirations, phone, resume, swot, skills, education, certifications } = req.body;
            
            // Validate Headling and Aspirations
            if (headline) {
                const validation = await validateProfileText(headline, 'headline');
                if (!validation.isValid) return res.status(400).json({ msg: `AI Validation: Headline is invalid. ${validation.reason}` });
            }
            
            let finalAspirations = [];
            if (Array.isArray(aspirations) && aspirations.length > 0) {
                finalAspirations = aspirations;
            } else if (aspiration) {
                finalAspirations = [aspiration];
            }
            
            if (finalAspirations.length > 0) {
                const validation = await validateProfileText(finalAspirations.join(', '), 'aspirations');
                if (!validation.isValid) return res.status(400).json({ msg: `AI Validation: Aspirations are invalid. ${validation.reason}` });
            }

            if (headline !== undefined) user.headline = headline;
            if (aspiration !== undefined) user.aspiration = aspiration;
            // Multi-aspiration tags
            if (finalAspirations.length > 0) user.aspirations = finalAspirations;
            if (phone !== undefined) user.phone = phone;
            if (resume !== undefined) user.resume = resume;
            if (swot) user.swot = swot;
            if (skills) user.skills = skills;
            if (education) user.education = education;
            if (certifications) user.certifications = certifications;

            const isEduComplete = user.education && user.education.length > 0;
            const isSwotComplete = user.swot && user.swot.strengths.length > 0 && user.swot.weaknesses.length > 0;
            const hasAspiration = (user.aspirations && user.aspirations.length > 0) || !!user.aspiration;
            user.isProfileComplete = !!(user.headline && hasAspiration && isEduComplete && isSwotComplete);
        } else if (user.role === 'recruiter') {
            const { companyName, companyWebsite, phone } = req.body;
            if (companyName) user.companyName = companyName;
            if (companyWebsite) user.companyWebsite = companyWebsite;
            if (phone) user.phone = phone;
        }

        await user.save();

        const userObj = user.toObject();
        if (user.role === 'student') {
            const allProgress = await RoadmapProgress.find({ userId: req.user.id });
            const tokens = await Token.find({ userId: req.user.id }).sort({ issuedAt: -1 });
            userObj.roadmapProgress = allProgress;
            userObj.completedRoadmaps = allProgress.filter(p => p.isFinished);
            userObj.tokens = tokens;
            userObj.assessments = user.assessments || [];
        }

        res.json(userObj);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth/request-otp
router.post('/request-otp', auth, async (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ msg: 'Phone number is required' });

    try {
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = Date.now() + 10 * 60 * 1000;

        let user = await findUserById(req.user.id);
        user.otp = { code: otpCode, expiry, target: phone };
        await user.save();

        console.log(`[OTP] Generated OTP for ${phone}: ${otpCode}`);
        res.json({ msg: 'OTP sent to your phone (MOCKED in console)', phone });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth/verify-otp
router.post('/verify-otp', auth, async (req, res) => {
    const { code } = req.body;
    try {
        let user = await findUserById(req.user.id);
        if (!user.otp || user.otp.code !== code || user.otp.expiry < Date.now()) {
            return res.status(400).json({ msg: 'Invalid or expired OTP' });
        }
        user.phone = user.otp.target;
        user.isVerifiedPhone = true;
        user.otp = undefined;
        await user.save();
        res.json({ msg: 'Phone verified successfully', user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/auth/tokens
// @desc    Get user tokens/badges
router.get('/tokens', auth, async (req, res) => {
    try {
        const Token = require('../models/Token');
        const tokens = await Token.find({ userId: req.user.id }).sort({ issuedAt: -1 });
        res.json(tokens);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
