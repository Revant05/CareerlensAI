const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const RoadmapProgress = require('../models/RoadmapProgress');
const Roadmap = require('../models/Roadmap'); // Import Roadmap Model
const Token = require('../models/Token');

// @route   GET api/roadmap
// @desc    Get All Roadmaps (for list view)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const roadmaps = await Roadmap.find().select('-steps'); // Exclude steps for list
        res.json(roadmaps);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/roadmap/:roadmapId
// @desc    Get progress AND content for a specific roadmap
// @access  Private
router.get('/:roadmapId', auth, async (req, res) => {
    try {
        const roadmapId = req.params.roadmapId;

        // Fetch Content
        const content = await Roadmap.findOne({ roadmapId });
        if (!content) return res.status(404).json({ msg: 'Roadmap not found' });

        // Fetch Progress
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
// @desc    Toggle a roadmap node as completed/incomplete
// @access  Private
router.put('/node', auth, async (req, res) => {
    const { roadmapId, nodeTitle } = req.body;

    try {
        let progress = await RoadmapProgress.findOne({ userId: req.user.id, roadmapId });

        if (!progress) {
            progress = new RoadmapProgress({ userId: req.user.id, roadmapId, completedNodes: [] });
        }

        // Toggle logic
        const index = progress.completedNodes.indexOf(nodeTitle);
        if (index === -1) {
            progress.completedNodes.push(nodeTitle);
        } else {
            progress.completedNodes.splice(index, 1);
        }

        progress.lastUpdated = Date.now();
        await progress.save();

        res.json(progress);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/roadmap/complete
// @desc    Mark roadmap as finished and award token
// @access  Private
router.post('/complete', auth, async (req, res) => {
    const { roadmapId, roadmapTitle } = req.body;

    try {
        let progress = await RoadmapProgress.findOne({ userId: req.user.id, roadmapId });

        if (!progress) return res.status(404).json({ msg: 'Progress not found' });

        progress.isFinished = true;

        let token = null;
        if (!progress.tokenEarned) {
            // Award Token
            token = new Token({
                userId: req.user.id,
                roadmapId,
                title: `${roadmapTitle} Completer`,
                imageUrl: 'https://via.placeholder.com/150/00f3ff/000000?text=Token' // Placeholder for now
            });
            await token.save();
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
