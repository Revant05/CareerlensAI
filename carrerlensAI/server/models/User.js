const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    headline: { type: String, default: 'Aspiring Developer' },
    aspiration: { type: String, default: '' },
    resume: { type: String, default: '' }, // URL or Text
    swot: {
        strengths: [String],
        weaknesses: [String],
        opportunities: [String],
        threats: [String]
    },
    skills: [String],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
