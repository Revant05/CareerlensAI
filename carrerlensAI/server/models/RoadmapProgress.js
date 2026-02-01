const mongoose = require('mongoose');

const RoadmapProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    roadmapId: { type: String, required: true }, // e.g., 'frontend', 'backend'
    completedNodes: [String], // Array of step titles or IDs
    isFinished: { type: Boolean, default: false },
    tokenEarned: { type: Boolean, default: false },
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RoadmapProgress', RoadmapProgressSchema);
