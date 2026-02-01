const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Roadmap = require('./models/Roadmap');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/careerlens';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected for Seeding'))
    .catch(err => console.error(err));

// DATA TO SEED
const roleRoadmaps = [
    { id: 'frontend', title: 'Frontend', desc: 'User Interface & UX', isFresh: false, type: 'role' },
    { id: 'backend', title: 'Backend', desc: 'Server Logic & DBs', isFresh: false, type: 'role' },
    { id: 'fullstack', title: 'Full Stack', desc: 'Frontend & Backend', isFresh: false, type: 'role' },
    { id: 'devops', title: 'DevOps', desc: 'Operations & CI/CD', isFresh: false, type: 'role' },
    { id: 'devsecops', title: 'DevSecOps', desc: 'Securing DevOps', isFresh: true, type: 'role' },
    { id: 'ai-engineer', title: 'AI Engineer', desc: 'AI & Models', isFresh: false, type: 'role' },
    { id: 'data-analyst', title: 'Data Analyst', desc: 'Insights from Data', isFresh: true, type: 'role' },
    { id: 'ai-data-scientist', title: 'AI & Data Scientist', desc: 'Science of Data', isFresh: false, type: 'role' },
    { id: 'data-engineer', title: 'Data Engineer', desc: 'Big Data Pipelines', isFresh: false, type: 'role' },
    { id: 'android', title: 'Android', desc: 'Mobile Apps (Kotlin)', isFresh: false, type: 'role' },
    { id: 'ios', title: 'iOS', desc: 'Mobile Apps (Swift)', isFresh: false, type: 'role' },
    { id: 'postgresql', title: 'PostgreSQL', desc: 'DB Administration', isFresh: false, type: 'role' },
    { id: 'blockchain', title: 'Blockchain', desc: 'Web3 & Crypto', isFresh: false, type: 'role' },
    { id: 'qa', title: 'QA', desc: 'Quality Assurance', isFresh: false, type: 'role' },
    { id: 'software-architect', title: 'Software Architect', desc: 'System Design', isFresh: false, type: 'role' },
    { id: 'cyber-security', title: 'Cyber Security', desc: 'Security', isFresh: false, type: 'role' },
    { id: 'ux-design', title: 'UX Design', desc: 'User Experience', isFresh: false, type: 'role' },
    { id: 'game-developer', title: 'Game Developer', desc: 'Game Creation', isFresh: false, type: 'role' },
    { id: 'mlops', title: 'MLOps', desc: 'ML Operations', isFresh: false, type: 'role' },
    { id: 'product-manager', title: 'Product Manager', desc: 'Product Lifecycle', isFresh: false, type: 'role' },
    { id: 'engineering-manager', title: 'Eng. Manager', desc: 'Leading Teams', isFresh: false, type: 'role' },
    { id: 'devrel', title: 'Developer Relations', desc: 'Community', isFresh: false, type: 'role' },
    { id: 'bi-analyst', title: 'BI Analyst', desc: 'Business Intelligence', isFresh: true, type: 'role' },
];

const skillRoadmaps = [
    { id: 'computer-science', title: 'Computer Science', isFresh: false, type: 'skill' },
    { id: 'sql', title: 'SQL', isFresh: true, type: 'skill' },
    { id: 'react', title: 'React', isFresh: false, type: 'skill' },
    { id: 'vue', title: 'Vue', isFresh: false, type: 'skill' },
    { id: 'angular', title: 'Angular', isFresh: false, type: 'skill' },
    { id: 'javascript', title: 'JavaScript', isFresh: false, type: 'skill' },
    { id: 'typescript', title: 'TypeScript', isFresh: false, type: 'skill' },
    { id: 'nodejs', title: 'Node.js', isFresh: false, type: 'skill' },
    { id: 'python', title: 'Python', isFresh: false, type: 'skill' },
    { id: 'java', title: 'Java', isFresh: false, type: 'skill' },
    { id: 'spring-boot', title: 'Spring Boot', isFresh: false, type: 'skill' },
    { id: 'go', title: 'Go', isFresh: false, type: 'skill' },
    { id: 'rust', title: 'Rust', isFresh: false, type: 'skill' },
    { id: 'cpp', title: 'C++', isFresh: false, type: 'skill' },
    { id: 'flutter', title: 'Flutter', isFresh: false, type: 'skill' },
    { id: 'graphql', title: 'GraphQL', isFresh: false, type: 'skill' },
    { id: 'design-system', title: 'Design System', isFresh: false, type: 'skill' },
    { id: 'system-design', title: 'System Design', isFresh: false, type: 'skill' },
    { id: 'docker', title: 'Docker', isFresh: false, type: 'skill' },
    { id: 'kubernetes', title: 'Kubernetes', isFresh: false, type: 'skill' },
    { id: 'aws', title: 'AWS', isFresh: false, type: 'skill' },
    { id: 'mongodb', title: 'MongoDB', isFresh: false, type: 'skill' },
    { id: 'linux', title: 'Linux', isFresh: false, type: 'skill' },
    { id: 'git-github', title: 'Git & GitHub', isFresh: false, type: 'skill' },
    { id: 'terraform', title: 'Terraform', isFresh: false, type: 'skill' },
    { id: 'redis', title: 'Redis', isFresh: false, type: 'skill' },
    { id: 'datastructures', title: 'DSA', isFresh: false, type: 'skill' },
    { id: 'prompt-engineering', title: 'Prompt Eng.', isFresh: false, type: 'skill' },
    { id: 'nextjs', title: 'Next.js', isFresh: false, type: 'skill' },
    { id: 'html', title: 'HTML', isFresh: false, type: 'skill' },
    { id: 'css', title: 'CSS', isFresh: false, type: 'skill' },
    { id: 'kotlin', title: 'Kotlin', isFresh: false, type: 'skill' },
    { id: 'swift', title: 'Swift', isFresh: false, type: 'skill' },
    { id: 'laravel', title: 'Laravel', isFresh: false, type: 'skill' },
    { id: 'wordpress', title: 'WordPress', isFresh: true, type: 'skill' },
];

const bestPractices = [
    { id: 'aws-best', title: 'AWS Best Practices', desc: 'Security & Cost', isFresh: false, type: 'best' },
    { id: 'api-security', title: 'API Security', desc: 'Safe API Design', isFresh: false, type: 'best' },
    { id: 'frontend-perf', title: 'Frontend Performance', desc: 'Speed & Vitals', isFresh: false, type: 'best' },
    { id: 'backend-perf', title: 'Backend Performance', desc: 'Scaling & Caching', isFresh: false, type: 'best' },
    { id: 'code-review', title: 'Code Review', desc: 'Review Guidelines', isFresh: false, type: 'best' },
];

const specificRoadmapDetails = {
    frontend: {
        steps: [
            { title: "Internet", sub: ["How does the internet work?", "What is HTTP/HTTPS?", "Browsers & Rendering Engine", "DNS & Domain Names", "What is Hosting?"] },
            { title: "HTML", sub: ["Basics (Tags, Attributes)", "Semantic HTML", "Forms & Validations", "Accessibility (ARIA)", "SEO Basics"] },
            { title: "CSS", sub: ["Selectors & Specificity", "Box Model", "Flexbox & Grid", "Responsive Design (Media Queries)", "Animations & Transitions"] },
            { title: "JavaScript", sub: ["Syntax & Basic Constructs", "DOM Manipulation", "Fetch API / AJAX", "ES6+ Features (Arrow fns, Destructuring)", "Async/Await & Promises", "Event Loop"] },
        ]
    },
    backend: {
        steps: [
            { title: "Internet & OS", sub: ["How the Internet works", "Terminal/CLI Usage", "Process Management", "Threads & Concurrency", "Memory Management"] },
            { title: "Learn a Language", sub: ["JavaScript (Node.js)", "Python (Django/Flask)", "Java (Spring Boot)", "Go (Golang)", "Rust", "C# (.NET)"] },
            { title: "Relational Databases", sub: ["PostgreSQL (Recommended)", "MySQL", "Normalization", "ACID Transactions", "Indexes & Optimization"] },
        ]
    }
};

const getRoadmapData = (id, title) => {
    if (specificRoadmapDetails[id]) {
        return specificRoadmapDetails[id].steps;
    }
    return [
        { title: "1. Fundamentals", sub: [`What is ${title}?`, `Setting up the Environment`, "Basic Concepts & Syntax", "Core Principles"] },
        { title: "2. Key Tools & Libraries", sub: ["Popular Frameworks", "Standard Library", "Package Management"] },
        { title: "3. Intermediate Topics", sub: ["Advanced Patterns", "Best Practices", "Testing & Quality"] },
        { title: "4. Real World Projects", sub: [`Build a CRUD Application`, `Deploying ${title} Apps`] }
    ];
};


const seedData = async () => {
    try {
        await Roadmap.deleteMany({}); // Clear existing

        const allItems = [...roleRoadmaps, ...skillRoadmaps, ...bestPractices];

        const docs = allItems.map(item => {
            return {
                roadmapId: item.id,
                title: item.title,
                desc: item.desc || `Reference for ${item.title}`,
                type: item.type,
                isFresh: item.isFresh || false,
                steps: getRoadmapData(item.id, item.title)
            };
        });

        await Roadmap.insertMany(docs);
        console.log('✅ Seeded Roadmaps!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
