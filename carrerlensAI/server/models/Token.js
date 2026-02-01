const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    roadmapId: { type: String, required: true },
    title: { type: String, required: true }, // e.g., "Frontend Master"
    issuedAt: { type: Date, default: Date.now },
    imageUrl: { type: String, default: '' } // Generative AI image URL in future
});

module.exports = mongoose.model('Token', TokenSchema);
