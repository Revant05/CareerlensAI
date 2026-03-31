const mongoose = require('mongoose');
const Roadmap = require('./models/Roadmap');
const dotenv = require('dotenv');

dotenv.config();

const roadmaps = [
    // ROLE BASED
    {
        roadmapId: 'frontend', title: 'Frontend Engineer', desc: 'User Interface & UX', type: 'role', isFresh: false, steps: [
            { title: 'HTML & CSS Foundations', sub: ['HTML5 Semantic Tags', 'Flexbox & Grid', 'Responsive Design'] },
            { title: 'JavaScript Mastery', sub: ['ES6+ Features', 'Async/Await', 'DOM Manipulation'] },
            { title: 'React Ecosystem', sub: ['Hooks & State', 'React Router', 'Context API'] },
            { title: 'Modern Tools', sub: ['Vite & Webpack', 'ESLint & Prettier', 'PostCSS'] }
        ]
    },
    {
        roadmapId: 'backend', title: 'Backend Engineer', desc: 'Server Logic & DBs', type: 'role', isFresh: false, steps: [
            { title: 'Node.js Core', sub: ['Event Loop', 'Process Management', 'File System'] },
            { title: 'API Design', sub: ['REST Principles', 'Express.js', 'Authentication (JWT)'] },
            { title: 'Databases', sub: ['MongoDB/Mongoose', 'SQL Basics', 'Query Optimization'] },
            { title: 'Deployment', sub: ['Docker Basics', 'CI/CD Pipelines', 'Cloud Hosting'] }
        ]
    },
    {
        roadmapId: 'fullstack', title: 'Full Stack Developer', desc: 'Frontend & Backend', type: 'role', isFresh: false, steps: [
            { title: 'Frontend Foundations', sub: ['React.js', 'State Management', 'Tailwind CSS'] },
            { title: 'Backend Engineering', sub: ['Node.js', 'API Architectures', 'Auth Systems'] },
            { title: 'Data Management', sub: ['PostgreSQL', 'Redis Caching', 'Prisma ORM'] },
            { title: 'Operations', sub: ['Docker', 'AWS/Vercel Deployment', 'Monitoring'] }
        ]
    },
    {
        roadmapId: 'ai-engineer', title: 'AI Engineer', desc: 'AI & Models', type: 'role', isFresh: false, steps: [
            { title: 'Python Fundamentals', sub: ['Data Structures', 'Modules', 'NumPy/Pandas'] },
            { title: 'Machine Learning', sub: ['Scikit-learn', 'Regression', 'Classification'] },
            { title: 'Deep Learning', sub: ['PyTorch', 'Neural Networks', 'CNNs/RNNs'] },
            { title: 'GenAI & LLMs', sub: ['Prompt Engineering', 'Vector DBs', 'RAG Pipelines'] }
        ]
    },
    { roadmapId: 'devops', title: 'DevOps Engineer', desc: 'Operations & CI/CD', type: 'role', isFresh: false },
    { roadmapId: 'devsecops', title: 'DevSecOps', desc: 'Securing DevOps', type: 'role', isFresh: true },
    { roadmapId: 'data-analyst', title: 'Data Analyst', desc: 'Insights from Data', type: 'role', isFresh: true },
    { roadmapId: 'android', title: 'Android Developer', desc: 'Mobile Apps (Kotlin)', type: 'role', isFresh: false },
    { roadmapId: 'ios', title: 'iOS Developer', desc: 'Mobile Apps (Swift)', type: 'role', isFresh: false },
    { roadmapId: 'cyber-security', title: 'Cyber Security', desc: 'Network Security', type: 'role', isFresh: false },
    { roadmapId: 'blockchain', title: 'Blockchain Developer', desc: 'Web3 & Crypto', type: 'role', isFresh: false },
    { roadmapId: 'ux-design', title: 'UX Designer', desc: 'User Experience', type: 'role', isFresh: false },

    // SKILL BASED
    {
        roadmapId: 'react', title: 'React Master', type: 'skill', isFresh: false, steps: [
            { title: 'Core Concepts', sub: ['JSX', 'Props & State', 'Event Handling'] },
            { title: 'Hooks Depth', sub: ['useState', 'useEffect', 'useMemo/useCallback'] },
            { title: 'Advanced React', sub: ['Context API', 'Custom Hooks', 'Error Boundaries'] }
        ]
    },
    {
        roadmapId: 'python', title: 'Python Expert', type: 'skill', isFresh: false, steps: [
            { title: 'Syntax & Basics', sub: ['Lists & Dicts', 'Functions', 'File I/O'] },
            { title: 'Intermediate', sub: ['OOP Classes', 'Decorators', 'Generators'] },
            { title: 'Web/Data Stack', sub: ['Flask/Django', 'Pandas Basics', 'Requests'] }
        ]
    },
    { roadmapId: 'javascript', title: 'JavaScript Mastery', type: 'skill', isFresh: false },
    { roadmapId: 'nodejs', title: 'Node.js Expert', type: 'skill', isFresh: false },
    { roadmapId: 'mongodb', title: 'MongoDB Master', type: 'skill', isFresh: false },
    { roadmapId: 'docker', title: 'Docker Master', type: 'skill', isFresh: false },
    { roadmapId: 'kubernetes', title: 'Kubernetes Guru', type: 'skill', isFresh: false },
    { roadmapId: 'aws', title: 'AWS Architect', type: 'skill', isFresh: false },
    { roadmapId: 'git-github', title: 'Git & GitHub', type: 'skill', isFresh: false },
    { roadmapId: 'system-design', title: 'System Design', type: 'skill', isFresh: false },
    { roadmapId: 'datastructures', title: 'DSA Mastery', type: 'skill', isFresh: false },
    { roadmapId: 'prompt-engineering', title: 'Prompt Eng.', type: 'skill', isFresh: false },

    // BEST PRACTICES
    { roadmapId: 'api-security', title: 'API Security', desc: 'Safe API Design', type: 'best' },
    { roadmapId: 'frontend-perf', title: 'Frontend Performance', desc: 'Speed & Vitals', type: 'best' },
    { roadmapId: 'code-review', title: 'Code Review', desc: 'Review Guidelines', type: 'best' }
];

const seedDB = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/careerlens';
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing roadmaps
        await Roadmap.deleteMany({});
        console.log('Cleared existing roadmaps.');

        // Insert new ones
        await Roadmap.insertMany(roadmaps);
        console.log('Successfully seeded roadmaps!');

        mongoose.connection.close();
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();
