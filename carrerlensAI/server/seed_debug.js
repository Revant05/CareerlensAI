const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Roadmap = require('./models/Roadmap');

console.log('Starting seed script...');

// Manually load env for debug
// dotenv.config(); 
// Hardcode for test if dotenv fails
const MONGO_URI = 'mongodb://127.0.0.1:27017/careerlens';

console.log('Connecting to:', MONGO_URI);

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => {
        console.error('❌ Connection Error:', err);
        process.exit(1);
    });

const data = [
    { id: 'frontend', title: 'Frontend', desc: 'User Interface & UX', type: 'role', steps: [{ title: 'HTML', sub: ['Tags', 'Forms'] }] },
    { id: 'backend', title: 'Backend', desc: 'Server Logic', type: 'role', steps: [{ title: 'Node.js', sub: ['Express', 'API'] }] }
];

const seed = async () => {
    try {
        console.log('Clearing old roadmaps...');
        await Roadmap.deleteMany({});

        console.log('Inserting new roadmaps...');
        await Roadmap.insertMany(data.map(d => ({
            roadmapId: d.id,
            title: d.title,
            desc: d.desc,
            type: d.type,
            steps: d.steps
        })));

        console.log('✅ Seeded Successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed Error:', err);
        process.exit(1);
    }
};

// Wait for connection
mongoose.connection.once('open', () => {
    seed();
});
