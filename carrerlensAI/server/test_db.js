const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/careerlens';

console.log('Attemping connection...');

mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        console.log('✅ Connection Sucessful!');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Connection Failed:', err.message);
        process.exit(1);
    });
