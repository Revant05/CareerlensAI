const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const RoadmapProgress = require('../models/RoadmapProgress');
const Student = require('../models/Student');
const Roadmap = require('../models/Roadmap');
const Token = require('../models/Token');
const Job = require('../models/Job');

// @route   GET api/roadmap
// @desc    Get All Roadmaps
router.get('/', auth, async (req, res) => {
    try {
        const roadmaps = await Roadmap.find().select('-steps');
        res.json(roadmaps);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

const axios = require('axios');

// AI Engine configuration
const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://127.0.0.1:8001';
const INTERNAL_SECRET = process.env.INTERNAL_SECRET || 'careerlens_default_67890';

// @route   GET api/roadmap/personalized
// @desc    Get dynamic personalized roadmap based on multiple aspirations
router.get('/personalized', auth, async (req, res) => {
    try {
        const user = await Student.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        
        let aspirationsToUse = user.aspirations;
        if (!aspirationsToUse || aspirationsToUse.length === 0) {
            if (user.aspiration) aspirationsToUse = [user.aspiration];
            else return res.json({ msg: 'No aspirations set. Please update your profile.', roadmap: null });
        }
        
        // Cache mechanism: If we already have a personalized roadmap and it's somewhat recent (optional enhancement), we could return it.
        // For dynamic freshness, we'll hit the AI engine if it's missing or if the user requests a refresh (frontend can maybe pass ?refresh=true).
        const forceRefresh = req.query.refresh === 'true';
        
        if (user.personalizedRoadmap && !forceRefresh) {
            // Very simple cache check: if aspirations match the last generated (we didn't store diffs, so just return cached for now if it exists)
            // But actually we want it dynamic. Let's return cached unless forced.
            return res.json({ roadmap: user.personalizedRoadmap });
        }
        
        // Fetch from AI Engine
        const response = await axios.post(`${AI_ENGINE_URL}/generate-roadmap`, {
            aspirations: aspirationsToUse
        }, {
            headers: {
                'x-internal-secret': INTERNAL_SECRET
            }
        });
        
        const aiRoadmap = response.data;
        
        // Save to user profile
        user.personalizedRoadmap = aiRoadmap;
        await user.save();
        
        res.json({ roadmap: aiRoadmap });
    } catch (err) {
        console.error('AI Roadmap Generation error:', err.message);
        res.status(500).json({ msg: 'Failed to generate dynamic roadmap from AI engine' });
    }
});

// @route   GET api/roadmap/jobs
// @desc    Get all active jobs for students
router.get('/jobs', auth, async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/roadmap/:roadmapId
router.get('/:roadmapId', auth, async (req, res) => {
    try {
        const roadmapId = req.params.roadmapId;
        const content = await Roadmap.findOne({ roadmapId });
        if (!content) return res.status(404).json({ msg: 'Roadmap not found' });

        let progress = await RoadmapProgress.findOne({
            userId: req.user.id,
            roadmapId: roadmapId
        });

        if (!progress) {
            progress = {
                roadmapId,
                completedNodes: [],
                isFinished: false,
                tokenEarned: false
            };
        }

        res.json({ content, progress });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/roadmap/node
router.put('/node', auth, async (req, res) => {
    const { roadmapId, nodeTitle } = req.body;
    try {
        let progress = await RoadmapProgress.findOne({ userId: req.user.id, roadmapId });
        if (!progress) {
            progress = new RoadmapProgress({ userId: req.user.id, roadmapId, completedNodes: [] });
        }
        const index = progress.completedNodes.indexOf(nodeTitle);
        if (index === -1) progress.completedNodes.push(nodeTitle);
        else progress.completedNodes.splice(index, 1);

        progress.lastUpdated = Date.now();
        await progress.save();
        res.json(progress);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/roadmap/complete
router.post('/complete', auth, async (req, res) => {
    const { roadmapId, roadmapTitle } = req.body;
    try {
        let progress = await RoadmapProgress.findOne({ userId: req.user.id, roadmapId });
        if (!progress) return res.status(404).json({ msg: 'Progress not found' });

        progress.isFinished = true;
        let token = null;

        if (!progress.tokenEarned) {
            const user = await Student.findById(req.user.id);
            if (!user) return res.status(404).json({ msg: 'Student record not found' });

            const highScoringInterview = user.assessments.some(a =>
                a.type === 'mock_interview' &&
                a.category === roadmapId &&
                a.score >= 85
            );

            const tokenTitle = highScoringInterview
                ? `${roadmapTitle} Completed`
                : `${roadmapTitle} Roadmap Master`;

            // Check if token already exists (resilience)
            const existingToken = await Token.findOne({ userId: req.user.id, title: tokenTitle });
            if (!existingToken) {
                token = new Token({
                    userId: req.user.id,
                    roadmapId,
                    title: tokenTitle,
                    imageUrl: 'https://via.placeholder.com/150/00f3ff/000000?text=Token'
                });
                await token.save();
            } else {
                token = existingToken;
            }
            progress.tokenEarned = true;
        }

        await progress.save();
        res.json({ progress, token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
