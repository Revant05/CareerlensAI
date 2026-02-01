const mongoose = require('mongoose');
const Roadmap = require('./models/Roadmap');

const MONGO_URI = 'mongodb://127.0.0.1:27017/careerlens';

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected.');
        const count = await Roadmap.countDocuments();
        console.log(`Roadmap Count: ${count}`);
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
