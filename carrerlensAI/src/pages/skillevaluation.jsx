import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Code, Server, Database, Cpu, CheckCircle, Clock, Award, TrendingUp, Target, BookOpen, Layout, Shield, Zap, BarChart, Smartphone, Globe, Lock, Palette, Gamepad2, Users, Briefcase, Radio, Monitor, Coffee, Box, Settings, Share2, Layers, FileCode, Hexagon, GitBranch, CloudLightning, Terminal, Anchor, Network, MessageSquare } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import './skillevaluation.css';

const roles = [
    { id: 'frontend', name: 'Frontend Developer', icon: Code, color: '#61dafb', category: 'Development' },
    { id: 'backend', name: 'Backend Developer', icon: Server, color: '#68a063', category: 'Development' },
    { id: 'fullstack', name: 'Full Stack Developer', icon: Layout, color: '#8b5cf6', category: 'Development' },
    { id: 'devops', name: 'DevOps Engineer', icon: Cpu, color: '#00d4aa', category: 'Operations' },
    { id: 'devsecops', name: 'DevSecOps Engineer', icon: Shield, color: '#ff6b6b', category: 'Security' },
    { id: 'ai-engineer', name: 'AI Engineer', icon: Zap, color: '#ffd93d', category: 'AI/ML' },
    { id: 'data-analyst', name: 'Data Analyst', icon: BarChart, color: '#6bcf7f', category: 'Data' },
    { id: 'ai-data-scientist', name: 'AI & Data Scientist', icon: TrendingUp, color: '#a29bfe', category: 'AI/ML' },
    { id: 'data-engineer', name: 'Data Engineer', icon: Database, color: '#fd79a8', category: 'Data' },
    { id: 'android', name: 'Android Developer', icon: Smartphone, color: '#3ddc84', category: 'Mobile' },
    { id: 'ios', name: 'iOS Developer', icon: Smartphone, color: '#007aff', category: 'Mobile' },
    { id: 'postgresql', name: 'PostgreSQL DBA', icon: Database, color: '#336791', category: 'Database' },
    { id: 'blockchain', name: 'Blockchain Developer', icon: Globe, color: '#f7931a', category: 'Web3' },
    { id: 'qa', name: 'QA Engineer', icon: CheckCircle, color: '#00b894', category: 'Quality' },
    { id: 'software-architect', name: 'Software Architect', icon: Layout, color: '#0984e3', category: 'Architecture' },
    { id: 'cyber-security', name: 'Cyber Security', icon: Lock, color: '#d63031', category: 'Security' },
    { id: 'ux-design', name: 'UX Designer', icon: Palette, color: '#e17055', category: 'Design' },
    { id: 'game-developer', name: 'Game Developer', icon: Gamepad2, color: '#6c5ce7', category: 'Gaming' },
    { id: 'mlops', name: 'MLOps Engineer', icon: Cpu, color: '#fdcb6e', category: 'AI/ML' },
    { id: 'product-manager', name: 'Product Manager', icon: Briefcase, color: '#74b9ff', category: 'Management' },
    { id: 'engineering-manager', name: 'Engineering Manager', icon: Users, color: '#a29bfe', category: 'Management' },
    { id: 'devrel', name: 'Developer Relations', icon: Radio, color: '#fd79a8', category: 'Community' },
    { id: 'bi-analyst', name: 'BI Analyst', icon: BarChart, color: '#55efc4', category: 'Analytics' },
];

const skills = [
    { id: 'computer-science', name: 'Computer Science', icon: Monitor, color: '#a29bfe', category: 'CS Core' },
    { id: 'sql', name: 'SQL', icon: Database, color: '#f29111', category: 'Database' },
    { id: 'react', name: 'React', icon: Code, color: '#61dafb', category: 'Frontend' },
    { id: 'vue', name: 'Vue', icon: Code, color: '#42b883', category: 'Frontend' },
    { id: 'angular', name: 'Angular', icon: Code, color: '#dd1b16', category: 'Frontend' },
    { id: 'javascript', name: 'JavaScript', icon: Code, color: '#f7df1e', category: 'Language' },
    { id: 'typescript', name: 'TypeScript', icon: Code, color: '#3178c6', category: 'Language' },
    { id: 'nodejs', name: 'Node.js', icon: Server, color: '#68a063', category: 'Backend' },
    { id: 'python', name: 'Python', icon: Code, color: '#3776ab', category: 'Language' },
    { id: 'java', name: 'Java', icon: Coffee, color: '#e76f00', category: 'Language' },
    { id: 'spring-boot', name: 'Spring Boot', icon: Layers, color: '#6db33f', category: 'Backend' },
    { id: 'go', name: 'Go', icon: Box, color: '#00add8', category: 'Language' },
    { id: 'rust', name: 'Rust', icon: Settings, color: '#dea584', category: 'Language' },
    { id: 'cpp', name: 'C++', icon: Code, color: '#00599c', category: 'Language' },
    { id: 'flutter', name: 'Flutter', icon: Smartphone, color: '#02569b', category: 'Mobile' },
    { id: 'graphql', name: 'GraphQL', icon: Share2, color: '#e10098', category: 'API' },
    { id: 'design-system', name: 'Design System', icon: Palette, color: '#ff4785', category: 'Design' },
    { id: 'system-design', name: 'System Design', icon: Layout, color: '#555555', category: 'Architecture' },
    { id: 'docker', name: 'Docker', icon: Box, color: '#2496ed', category: 'DevOps' },
    { id: 'kubernetes', name: 'Kubernetes', icon: Anchor, color: '#326ce5', category: 'DevOps' },
    { id: 'aws', name: 'AWS', icon: CloudLightning, color: '#ff9900', category: 'Cloud' },
    { id: 'mongodb', name: 'MongoDB', icon: Database, color: '#47a248', category: 'Database' },
    { id: 'linux', name: 'Linux', icon: Terminal, color: '#fcc624', category: 'OS' },
    { id: 'git-github', name: 'Git & GitHub', icon: GitBranch, color: '#f05133', category: 'Tools' },
    { id: 'terraform', name: 'Terraform', icon: Globe, color: '#7b42bc', category: 'DevOps' },
    { id: 'redis', name: 'Redis', icon: Database, color: '#d82c20', category: 'Database' },
    { id: 'datastructures', name: 'DSA', icon: Network, color: '#00d8ff', category: 'CS Core' },
    { id: 'prompt-engineering', name: 'Prompt Eng.', icon: MessageSquare, color: '#10a37f', category: 'AI' },
    { id: 'nextjs', name: 'Next.js', icon: Layers, color: '#000000', category: 'Frontend' },
    { id: 'html', name: 'HTML', icon: FileCode, color: '#e34f26', category: 'Frontend' },
    { id: 'css', name: 'CSS', icon: Palette, color: '#1572b6', category: 'Frontend' },
    { id: 'kotlin', name: 'Kotlin', icon: Smartphone, color: '#7f52ff', category: 'Mobile' },
    { id: 'swift', name: 'Swift', icon: Smartphone, color: '#f05138', category: 'Mobile' },
    { id: 'laravel', name: 'Laravel', icon: Hexagon, color: '#ff2d20', category: 'Backend' },
    { id: 'wordpress', name: 'WordPress', icon: Globe, color: '#21759b', category: 'CMS' },
];

const sampleQuestions = {
    // === ROLES ===
    frontend: [
        { question: "Which of the following best describes the primary purpose of the Virtual DOM in React?", options: ["To directly execute database queries from the frontend", "To improve rendering performance by minimizing direct DOM manipulation", "To establish a secure connection with the backend server", "To manage global state across the entire application"], correct: 1 },
        { question: "In CSS, which unit is relative to the font-size of the root element (html)?", options: ["em", "px", "%", "rem"], correct: 3 },
        { question: "What acts as a closure in JavaScript?", options: ["A variable that cannot be changed", "A function that retains access to variables from its outer scope even after the outer function has returned", "A method to close a browser window", "A special type of database connection"], correct: 1 }
    ],
    backend: [
        { question: "What does the acronym ACID stand for in the context of database transactions?", options: ["Atomicity, Consistency, Isolation, Durability", "Advanced Coding In Design Principles", "Automatic Cloud Integration Data", "Access Control Identification"], correct: 0 },
        { question: "Which statement best describes the difference between SQL and NoSQL databases?", options: ["SQL is always faster than NoSQL", "SQL databases are relational and table-based, while NoSQL databases are non-relational and document/key-value based", "NoSQL databases are only used for big data applications", "There is no functional difference between them"], correct: 1 },
        { question: "What is the core principle of a RESTful API architecture?", options: ["It uses the SOAP protocol exclusively", "It treats data as resources which can be created, read, updated, and deleted using standard HTTP methods", "It requires a direct database connection from the client", "It is a frontend library for building user interfaces"], correct: 1 }
    ],
    fullstack: [
        { question: "What does CORS stand for and what is its primary function?", options: ["Computer Operated Remote System - managing server load", "Cross-Origin Resource Sharing - allowing restricted resources on a web page to be requested from another domain", "Central Online Registration System - handling user signups", "Code Optimization Resource - improving script performance"], correct: 1 },
        { question: "Which technology stack typically includes MongoDB as its database component?", options: ["LAMP stack", "MERN stack", "Django stack", "Ruby on Rails stack"], correct: 1 },
        { question: "What is the primary purpose of using JSON Web Tokens (JWT)?", options: ["To add styling to React components", "To securely transmit information between parties as a JSON object, often for authentication", "To index database records for faster search", "To write unit tests for JavaScript code"], correct: 1 }
    ],
    devops: [
        { question: "What is the primary goal of implementing a CI/CD pipeline?", options: ["To write code faster without testing", "To automate the software delivery process, ensuring Frequent and reliable code changes", "To manage employee payroll systems", "To design user interfaces for applications"], correct: 1 },
        { question: "In the context of virtualization, what is a container?", options: ["A full Virtual Machine with its own OS", "A lightweight, standalone, executable package of software that includes everything needed to run an application", "A physical hardware server rack", "A table within a database"], correct: 1 },
        { question: "Which of the following tools is commonly used for Infrastructure as Code (IaC)?", options: ["Adobe Photoshop", "Terraform", "Microsoft Word", "Microsoft Excel"], correct: 1 }
    ],
    devsecops: [
        { question: "What is meant by the term 'Shift Left' in security?", options: ["Ignoring security until the very end", " integrating security practices early in the software development lifecycle", "Delegating security tasks to a separate team", "Hiring more security guards for the building"], correct: 1 },
        { question: "What does SAST stand for in application security?", options: ["Static Application Security Testing", "Simple App System Test", "Server Auto Start Tool", "Secure Access System"], correct: 0 },
        { question: "Why is it important to scan container images before deployment?", options: ["To reduce the file size of the image", "To identify and remediate known security vulnerabilities and exposures", "To change the color scheme of the application", "To make the application run faster"], correct: 1 }
    ],
    'ai-engineer': [
        { question: "What is a Neural Network in the context of Artificial Intelligence?", options: ["A medical scan of the brain", "A series of algorithms that endeavors to recognize underlying relationships in a set of data through a process that mimics the way the human brain operates", "A physical computer network connecting servers", "A type of internet connection"], correct: 1 },
        { question: "What does the term 'overfitting' mean in machine learning?", options: ["When the model is too simple to capture the underlying pattern", "When a model learns the detail and noise in the training data to the extent that it negatively impacts the performance of the model on new data", "When the training data is missing important features", "When the hardware is too slow to train the model"], correct: 1 },
        { question: "Which library is commonly used for building Deep Learning models?", options: ["React", "TensorFlow", "jQuery", "Laravel"], correct: 1 }
    ],
    'data-analyst': [
        { question: "What is the process of 'Data Cleaning'?", options: ["Physically wiping hard drives", "The process of fixing or removing incorrect, corrupted, incorrectly formatted, duplicate, or incomplete data within a dataset", "Permanently deleting all data", "Creating a backup of the data"], correct: 1 },
        { question: "Which of the following tools is primarily used for Data Visualization?", options: ["Tableau", "Notepad", "Calculator", "Microsoft Outlook"], correct: 0 },
        { question: "In statistics, what does the 'mean' represent?", options: ["The most frequent value in a dataset", "The average value of a dataset", "The middle value of a dataset", "The range of values in a dataset"], correct: 1 }
    ],
    'ai-data-scientist': [
        { question: "What is the fundamental difference between Supervised and Unsupervised learning?", options: ["Supervised learning uses a teacher, unsupervised does not", "Supervised learning uses labeled data, while Unsupervised learning uses unlabeled data", "Supervised learning is faster than unsupervised learning", "Supervised learning is for big data, unsupervised is for small data"], correct: 1 },
        { question: "What is Feature Engineering in data science?", options: ["Designing the user interface features", "Using domain knowledge to extract features from raw data", "Building the hardware features of a server", "Managing the project roadmap"], correct: 1 },
        { question: "What does a p-value indicate in hypothesis testing?", options: ["The probability of obtaining test results at least as extreme as the results actually observed, assuming that the null hypothesis is true", "A variable in Python programming", "A programming constant", "A polynomial value"], correct: 0 }
    ],
    'data-engineer': [
        { question: "What does the acronym ETL stand for?", options: ["Eat The Lunch", "Extract, Transform, Load", "Early Testing Logic", "External Tool Link"], correct: 1 },
        { question: "What is a Data Warehouse?", options: ["A physical storage building", "A large, centralized repository of integrated data from one or more disparate sources", "A backup hard drive", "A cloud server provider"], correct: 1 },
        { question: "What describes the difference between batch processing and stream processing?", options: ["There is no difference", "Batch processing processes data in chunks at intervals, while stream processing processes data in real-time as it arrives", "Batch processing is slower", "Stream processing is manual"], correct: 1 }
    ],
    android: [
        { question: "In Android development, what is an Activity?", options: ["A physical movement", "A single, focused thing that the user can do, typically corresponding to a single screen", "A background service", "A database table"], correct: 1 },
        { question: "Which language is currently the preferred language for Android development?", options: ["Swift", "Kotlin", "Ruby", "PHP"], correct: 1 },
        { question: "What is the purpose of Gradle in Android projects?", options: ["To track grades", "It is an advanced build automation tool to manage dependencies and build the app", "A graphics rendering library", "An Integrated Development Environment"], correct: 1 }
    ],
    ios: [
        { question: "What is the primary programming language used for modern iOS development?", options: ["Kotlin", "Swift", "C#", "Python"], correct: 1 },
        { question: "What is Xcode?", options: ["A mobile game", "Apple's Integrated Development Environment (IDE) for macOS", "A specific iPhone model", "A deprecated coding language"], correct: 1 },
        { question: "Which keyword connects a UI element from the Storyboard to the code?", options: ["IBOutlet", "Connect.js", "Linker", "Bridge"], correct: 0 }
    ],
    postgresql: [
        { question: "What does ACID compliance ensure in a database?", options: ["Safe handling of chemicals", "That database transactions are processed reliably", "Proper coding style", "Server hardware maintenance"], correct: 1 },
        { question: "Which SQL command is used to retrieve data from a database?", options: ["GET", "SELECT", "FETCH", "PULL"], correct: 1 },
        { question: "What is the difference between the WHERE and HAVING clauses?", options: ["They are interchangeable", "WHERE filters rows before grouping, whereas HAVING filters groups after grouping", "It is just a spelling difference", "HAVING is faster than WHERE"], correct: 1 }
    ],
    blockchain: [
        { question: "What is a Smart Contract?", options: ["A legal document signed digitally", "A self-executing contract with the terms of the agreement between buyer and seller being directly written into lines of code", "A smartphone app", "A digital signature"], correct: 1 },
        { question: "What is meant by 'consensus' in blockchain?", options: ["A generic voting system", "A mechanism to achieve agreement on the state of the network among distributed nodes", "A business meeting", "A forum discussion"], correct: 1 },
        { question: "What does 'Gas' refer to in the Ethereum network?", options: ["Fuel for servers", "A unit that measures the amount of computational effort required to execute specific operations", "Air cooling", "Network speed"], correct: 1 }
    ],
    qa: [
        { question: "What is the main difference between Black Box and White Box testing?", options: ["The color of the interface", "Black Box testing ignores internal structure (functional), while White Box testing inspects internal logic (structural)", "Day vs Night testing", "Manual vs Automated testing"], correct: 1 },
        { question: "What is the purpose of a regression test?", options: ["Testing older versions of software", "Re-running functional and non-functional tests to ensure that previously developed and tested software still performs after a change", "A mathematical test", "Testing performance speed"], correct: 1 },
        { question: "What is Selenium primarily used for?", options: ["A chemical element", "Automating web browsers for testing purposes", "A planetary system", "A bug tracking tool"], correct: 1 }
    ],
    'software-architect': [
        { question: "What is Microservices Architecture?", options: ["Using very small computers", "An architectural style where an application is structured as a collection of loosely coupled services", "Writing code in small files", "Using microscopes for debugging"], correct: 1 },
        { question: "What does Scalability refer to in system design?", options: ["The weight of the hardware", "The capability of a system to handle a growing amount of work by adding resources to the system", "Drawing diagrams to scale", "Climbing mountains"], correct: 1 },
        { question: "What does the CAP Theorem state?", options: ["A distributed data store can only provide two of the following three guarantees: Consistency, Availability, and Partition Tolerance", "Computer, App, Phone connectivity", "Code, API, Program structure", "Captain America Power levels"], correct: 0 }
    ],
    'cyber-security': [
        { question: "What is Phishing?", options: ["A recreational sport", "A cybercrime in which a target is contacted by email, telephone or text message by someone posing as a legitimate institution to lure individuals into providing sensitive data", "Scanning a network for open ports", "Cracking a password using brute force"], correct: 1 },
        { question: "What is the function of a Firewall?", options: ["To physically burn malicious hardware", "A network security device that monitors and filters incoming and outgoing network traffic based on an organization's previously established security policies", "Antivirus software installed on a PC", "A room heater"], correct: 1 },
        { question: "What is the purpose of encryption?", options: ["To make files larger", "To secure data by converting it into a code to prevent unauthorized access", "To permanently delete data", "To speed up computer processing"], correct: 1 }
    ],
    'ux-design': [
        { question: "What is the key difference between UI and UX design?", options: ["They are exactly the same thing", "UI focuses on the visual screens and elements, while UX focuses on the overall user journey and experience", "UI is about color, UX is about shape", "UI is coding, UX is drawing"], correct: 1 },
        { question: "What is a Wireframe in design?", options: ["A metal decoration", "A visual guide that represents the skeletal framework of a website", "A physical cable", "A finished, high-fidelity design"], correct: 1 },
        { question: "What is the goal of Usability Testing?", options: ["Testing hardware durability", "Evaluating a product or service by testing it with representative users", "Checking code syntax", "Testing battery life"], correct: 1 }
    ],
    'game-developer': [
        { question: "Which of the following is a popular Game Engine?", options: ["Microsoft Excel", "Unity", "Microsoft Word", "Google Chrome"], correct: 1 },
        { question: "What is a Sprite in game development?", options: ["A carbonated drink", "A two-dimensional bitmap that is integrated into a larger scene", "A ghost character", "A 3D model"], correct: 1 },
        { question: "What is the role of a Physics Engine?", options: ["A car engine", "Software that provides an approximate simulation of certain physical systems, such as rigid body dynamics", "A science lab", "Rocket fuel"], correct: 1 }
    ],
    mlops: [
        { question: "What is Model Drift?", options: ["Car drifting techniques", "The degradation of model performance over time due to changes in data distribution", "Moving model files between folders", "Slow internet connection"], correct: 1 },
        { question: "What is the primary goal of MLOps?", options: ["To replace DevOps entirely", "To unify ML system development (Dev) and ML system operations (Ops)", "To write more Python code", "To hire more data scientists"], correct: 1 },
        { question: "Which tool is commonly used for ML experiment tracking?", options: ["MLflow", "Notepad", "Git", "Discord"], correct: 0 }
    ],
    'product-manager': [
        { question: "What is an MVP (Minimum Viable Product)?", options: ["Most Valuable Player", "A version of a product with just enough features to be usable by early customers who can then provide feedback for future product development", "Maximum Visual Polish", "Minor Version Patch"], correct: 1 },
        { question: "What is the purpose of a Product Roadmap?", options: ["A map for driving directions", "A strategic plan that defines a goal or desired outcome and includes the major steps or milestones needed to reach it", "A list of software bugs", "A calendar of holidays"], correct: 1 },
        { question: "What is a User Story?", options: ["A fairy tale for children", "An informal, natural language description of one or more features of a software system", "A biography of a user", "A novel"], correct: 1 }
    ],
    'engineering-manager': [
        { question: "What is a key responsibility of an Engineering Manager?", options: ["Writing all the code for the project", "Supporting the engineering team, removing blockers, and ensuring delivery", "Fixing office printers", "Making coffee"], correct: 1 },
        { question: "What is the purpose of a 1:1 meeting?", options: ["A drawing competition", "A regular meeting between a manager and a direct report to discuss career development, feedback, and issues", "Binary code discussion", "A math problem"], correct: 1 },
        { question: "How should technical debt be handled?", options: ["Ignore it until it breaks", "Acknowledge it, and plan/prioritize refactoring alongside new feature work", "Delete the code", "Take a bank loan"], correct: 1 }
    ],
    devrel: [
        { question: "What is the main goal of Developer Relations (DevRel)?", options: ["Selling software licenses", "Building and nurturing a relationship with the developer community/ecosystem", "Coding in isolation", "Managing physical servers"], correct: 1 },
        { question: "What is a Hackathon?", options: ["Hacking a bank", "A sprint-like event where computer programmers and others involved in software development collaborate intensively on software projects", "Running a marathon", "A cyber attack event"], correct: 1 },
        { question: "Why is documentation critical in DevRel?", options: ["It is not important at all", "It is essential for developer adoption and ease of use of the platform/tool", "It is optional", "It is only for managers to read"], correct: 1 }
    ],
    'bi-analyst': [
        { question: "What is the function of a BI Dashboard?", options: ["Car part", "A graphical user interface which provides at-a-glance views of key performance indicators (KPIs) relevant to a particular objective", "A board game", "A wooden plank"], correct: 1 },
        { question: "What does KPI stand for?", options: ["Key Performance Indicator", "Keep People Interested", "Keyboard Input", "Kind Person Inside"], correct: 0 },
        { question: "Which tool is standard for Business Intelligence?", options: ["Power BI", "Microsoft Paint", "Spotify", "Steam"], correct: 0 }
    ],

    // === SKILLS ===
    'computer-science': [
        { question: "What does Big O notation describe?", options: ["A large letter O", "The performance or complexity of an algorithm", "A specific brand", "A planet"], correct: 1 },
        { question: "What is the binary representation of the decimal number 5?", options: ["101", "111", "100", "010"], correct: 0 },
        { question: "In operating systems, what is a process?", options: ["A thought", "An instance of a computer program that is being executed", "A rule", "A file"], correct: 1 }
    ],
    sql: [
        { question: "Which SQL keyword is used to remove duplicate records from a result set?", options: ["DELETE", "DISTINCT", "REMOVE", "UNIQUE"], correct: 1 },
        { question: "Which type of join returns all records from the left table, and the matched records from the right table?", options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN"], correct: 1 },
        { question: "What are the requirements for a Primary Key?", options: ["It can be null", "It must be unique and not null", "It must be a string", "It can contain duplicates"], correct: 1 }
    ],
    react: [
        { question: "Which React hook is used to handle side effects in functional components?", options: ["useEffect", "useState", "useContext", "useReducer"], correct: 1 },
        { question: "How do you pass data from a parent component to a child component?", options: ["Using State", "Using Props", "Using Render", "Using Callback"], correct: 1 },
        { question: "What is a Component in React?", options: ["A function or class that accepts inputs and returns a React element", "A variable", "A server", "A database"], correct: 0 }
    ],
    vue: [
        { question: "Which directive is used for rendering a list of items in Vue?", options: ["v-if", "v-for", "v-loop", "v-map"], correct: 1 },
        { question: "Which library is commonly used for state management in Vue applications?", options: ["Redux", "Pinia (or Vuex)", "MobX", "Recoil"], correct: 1 },
        { question: "What is the shorthand syntax for binding attributes (v-bind)?", options: [":", "@", "#", "$"], correct: 0 }
    ],
    angular: [
        { question: "Which programming language is primarily used for Angular development?", options: ["JavaScript", "TypeScript", "Python", "Java"], correct: 1 },
        { question: "What is a Directive in Angular?", options: ["A manager", "A class with a @Directive decorator that adds behavior to elements in the DOM", "A file type", "A server"], correct: 1 },
        { question: "What is the standard tool for Angular development via command line?", options: ["Angular CLI (ng)", "create-react-app", "vue-cli", "node"], correct: 0 }
    ],
    javascript: [
        { question: "Which symbol represents the logical OR operator?", options: ["&&", "||", "!!", "&|"], correct: 1 },
        { question: "Which keyword is used to declare a constant variable?", options: ["var", "const", "let", "static"], correct: 1 },
        { question: "What does NaN stand for?", options: ["Not a Null", "Not a Number", "New and New", "No a No"], correct: 1 }
    ],
    typescript: [
        { question: "What is the standard file extension for TypeScript files?", options: [".js", ".ts", ".jsx", ".tsx"], correct: 1 },
        { question: "What is an Interface in TypeScript?", options: ["A graphical UI", "A syntax for defining the shape of an object", "A cable", "A function"], correct: 1 },
        { question: "Does TypeScript run directly in the browser?", options: ["Yes, natively", "No, it must be compiled (transpiled) to JavaScript first", "Only in Chrome", "Sometimes"], correct: 1 }
    ],
    nodejs: [
        { question: "Is Node.js single-threaded?", options: ["Yes, it uses a single-threaded event loop", "No, it is multi-threaded", "Maybe", "Only on Windows"], correct: 0 },
        { question: "What is the default package manager for Node.js?", options: ["pip", "npm", "gem", "maven"], correct: 1 },
        { question: "Which module system does Node.js use by default?", options: ["CommonJS", "AMD", "UMD", "SystemJS"], correct: 0 }
    ],
    python: [
        { question: "Which function is used to output text to the console in Python 3?", options: ["echo", "print()", "console.log", "printf"], correct: 1 },
        { question: "How is a list defined in Python?", options: ["()", "[]", "{}", "<>"], correct: 1 },
        { question: "What is the significance of whitespace in Python?", options: ["None", "Indentation is used to define blocks of code", "Only for style", "Compiler ignores it"], correct: 1 }
    ],
    java: [
        { question: "What does JVM stand for?", options: ["Java Virtual Machine", "Java Runtime Environment", "Java Development Kit", "Java Application Manager"], correct: 0 },
        { question: "Which keyword is used for inheritance in Java?", options: ["implements", "extends", "inherits", "super"], correct: 1 },
        { question: "What is the correct signature for the main method?", options: ["void main()", "public static void main(String[] args)", "int main()", "static main"], correct: 1 }
    ],
    'spring-boot': [
        { question: "Which build tool is commonly used with Spring Boot?", options: ["Make", "Maven or Gradle", "npm", "pip"], correct: 1 },
        { question: "Which annotation is used to define a RESTful web service controller?", options: ["@Controller", "@RestController", "@Web", "@API"], correct: 1 },
        { question: "Which embedded server is included by default in Spring Boot?", options: ["IIS", "Tomcat", "Apache", "Nginx"], correct: 1 }
    ],
    go: [
        { question: "Which company developed the Go programming language?", options: ["Facebook", "Google", "Microsoft", "Apple"], correct: 1 },
        { question: "Which keyword is used to start a new goroutine?", options: ["thread", "go", "async", "run"], correct: 1 },
        { question: "How do you make a function public (exported) in Go?", options: ["lowercase first letter", "Uppercase first letter", "_underscore", "$dollar"], correct: 1 }
    ],
    rust: [
        { question: "What does Rust's ownership model primarily guarantee?", options: ["Memory safety without a garbage collector", "Faster compilation times", "Better UI components", "More libraries"], correct: 0 },
        { question: "Are variables in Rust mutable by default?", options: ["Yes", "No, they are immutable by default", "Only integers", "Only strings"], correct: 1 },
        { question: "What is the package manager for Rust called?", options: ["npm", "Cargo", "pip", "gem"], correct: 1 }
    ],
    cpp: [
        { question: "Which object is used for standard output in C++?", options: ["cin", "cout", "print", "write"], correct: 1 },
        { question: "Which operator is used to accesses the member of a structure or union through a pointer?", options: ["&", "*", "->", "@"], correct: 1 },
        { question: "Is C++ an object-oriented programming language?", options: ["No", "Yes", "Partially", "Only structs"], correct: 1 }
    ],
    flutter: [
        { question: "Which programming language is used to build Flutter apps?", options: ["Java", "Dart", "Swift", "JS"], correct: 1 },
        { question: "In Flutter, almost everything is a...", options: ["Object", "Widget", "Component", "View"], correct: 1 },
        { question: "Which company created Flutter?", options: ["Apple", "Google", "Facebook", "Amazon"], correct: 1 }
    ],
    graphql: [
        { question: "What is GraphQL?", options: ["A database engine", "A query language for APIs and a runtime for fulfilling those queries", "A server framework", "A frontend library"], correct: 1 },
        { question: "What common API problem does GraphQL solve?", options: ["Over-fetching and under-fetching of data", "Database indexing speed", "UI Design consistency", "Security authorization"], correct: 0 },
        { question: "Does GraphQL typically expose multiple endpoints?", options: ["Yes", "No, it typically exposes a single endpoint", "Maybe", "Depends on the weather"], correct: 1 }
    ],
    'design-system': [
        { question: "What is the primary purpose of a Design System?", options: ["To make things look pretty", "To ensure consistency and efficiency in product design and development", "To restrict creative freedom", "To save a list of colors"], correct: 1 },
        { question: "How many levels are there in Atomic Design methodology?", options: ["3", "5 (Atoms, Molecules, Organisms, Templates, Pages)", "7", "10"], correct: 1 },
        { question: "Which tool is commonly used to document and component libraries?", options: ["Storybook", "Excel", "Word", "Paint"], correct: 0 }
    ],
    'system-design': [
        { question: "What is the purpose of a Load Balancer?", options: ["To weigh the servers physically", "To distribute incoming network traffic across multiple servers", "To clean the database", "To monitor power usage"], correct: 1 },
        { question: "Which of the following is an example of a caching tool?", options: ["Redis", "MySQL", "Excel", "Word"], correct: 0 },
        { question: "What does CDN stand for?", options: ["Content Delivery Network", "Code Data Node", "Computer Disk Net", "Central Data Node"], correct: 0 }
    ],
    docker: [
        { question: "What is the name of the text file that contains the commands to build an image?", options: ["docker.json", "Dockerfile", "docker.xml", "docker.yaml"], correct: 1 },
        { question: "What do you call a running instance of a Docker image?", options: ["Machine", "Container", "Pod", "Service"], correct: 1 },
        { question: "What is Docker Hub?", options: ["A cloud-based registry service for storing and sharing Docker images", "GitHub for Docker", "A package manager", "A build tool"], correct: 0 }
    ],
    kubernetes: [
        { question: "What is the smallest deployable unit in Kubernetes?", options: ["Container", "Pod", "Node", "Cluster"], correct: 1 },
        { question: "What is the command-line tool for interacting with a Kubernetes cluster?", options: ["docker", "kubectl", "kube-cli", "k8s"], correct: 1 },
        { question: "Which component makes decisions about the cluster (scheduling, detecting events)?", options: ["Worker Node", "Control Plane", "User", "Internet"], correct: 1 }
    ],
    aws: [
        { question: "Which AWS service provides resizable compute capacity in the cloud (Virtual Servers)?", options: ["S3", "Amazon EC2", "RDS", "Lambda"], correct: 1 },
        { question: "Which AWS service is used for object storage?", options: ["EC2", "Amazon S3", "VPC", "IAM"], correct: 1 },
        { question: "Which service lets you run code without provisioning or managing servers?", options: ["AWS Lambda", "EC2", "EKS", "RDS"], correct: 0 }
    ],
    mongodb: [
        { question: "In what format does MongoDB store data?", options: ["Tables and Rows", "BSON (Binary JSON) documents", "CSV files", "XML files"], correct: 1 },
        { question: "Is MongoDB a SQL or NoSQL database?", options: ["SQL", "NoSQL", "NewSQL", "OldSQL"], correct: 1 },
        { question: "What is the default name of the field that acts as the primary key?", options: ["id", "_id", "key", "pk"], correct: 1 }
    ],
    linux: [
        { question: "Which command is used to list directory contents?", options: ["cd", "ls", "dir", "list"], correct: 1 },
        { question: "Which command allows a permitted user to execute a command as the superuser?", options: ["admin", "sudo", "root", "boss"], correct: 1 },
        { question: "Which command is used to change the current working directory?", options: ["ls", "cd", "mv", "cp"], correct: 1 }
    ],
    'git-github': [
        { question: "Which command saves your changes to the local repository?", options: ["git push", "git commit", "git add", "git save"], correct: 1 },
        { question: "Which command downloads a repository from a remote source?", options: ["git pull", "git clone", "git down", "git get"], correct: 1 },
        { question: "Which command creates a new branch?", options: ["git branch <name>", "git create", "git new", "git fork"], correct: 0 }
    ],
    terraform: [
        { question: "Which configuration language does Terraform use?", options: ["YAML", "HashiCorp Configuration Language (HCL)", "JSON", "XML"], correct: 1 },
        { question: "Which command initializes a working directory containing Terraform configuration files?", options: ["start", "init", "begin", "setup"], correct: 1 },
        { question: "Which command creates an execution plan, showing what actions Terraform will take?", options: ["check", "plan", "review", "test"], correct: 1 }
    ],
    redis: [
        { question: "What type of data store is Redis?", options: ["Disk-based relational database", "In-memory data structure store", "Tape storage", "Cloud only"], correct: 1 },
        { question: "Which of the following data structures does Redis support?", options: ["Strings, Hashes, Lists, Sets", "Tables only", "Documents only", "Graphs only"], correct: 0 },
        { question: "What is a common use case for Redis?", options: ["Long term cold storage", "Caching / Session Management", "Operating System", "Video editing"], correct: 1 }
    ],
    datastructures: [
        { question: "Which data structure follows the LIFO (Last In, First Out) principle?", options: ["Queue", "Stack", "List", "Tree"], correct: 1 },
        { question: "Which data structure follows the FIFO (First In, First Out) principle?", options: ["Stack", "Queue", "Set", "Map"], correct: 1 },
        { question: "What is the average time complexity for searching in a balanced Binary Search Tree?", options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"], correct: 1 }
    ],
    'prompt-engineering': [
        { question: "What is a 'prompt' in the context of Large Language Models?", options: ["The final answer", "The input text provided to the model to generate a response", "The training data", "The source code"], correct: 1 },
        { question: "What does 'Zero-shot prompting' mean?", options: ["Providing no examples to the model and expecting it to complete the task", "Bad aim", "No training data", "Zero errors"], correct: 0 },
        { question: "What is an 'AI Hallucination'?", options: ["The AI seeing ghosts", "When a model generates confident but factually incorrect or nonsensical information", "A training error", "A system crash"], correct: 1 }
    ],
    nextjs: [
        { question: "Next.js is a framework built on top of which library?", options: ["Vue", "React", "Angular", "Svelte"], correct: 1 },
        { question: "Which feature allows pages to be pre-rendered at build time?", options: ["SSG (Static Site Generation)", "More RAM", "Faster CPU", "Less code"], correct: 0 },
        { question: "How does routing work in the 'pages' directory of Next.js?", options: ["Via a configuration file", "It uses a file-system based router", "Via a database", "User input"], correct: 1 }
    ],
    html: [
        { question: "Which HTML tag is used for the largest heading?", options: ["<h6>", "<h1>", "<head>", "<title>"], correct: 1 },
        { question: "Which tag is used to define a hyperlink?", options: ["<link>", "<a>", "<href>", "<url>"], correct: 1 },
        { question: "Which tag defines an item in a list?", options: ["<ul>", "<li>", "<ol>", "<dl>"], correct: 1 }
    ],
    css: [
        { question: "Which property is used to change the text color of an element?", options: ["font-color", "color", "text-color", "bg-color"], correct: 1 },
        { question: "Which property creates space OUTSIDE the border of an element?", options: ["padding", "margin", "border", "spacing"], correct: 1 },
        { question: "What are Media Queries primarily used for?", options: ["Print properties", "Creating responsive designs for different viewport sizes", "Playing audio", "Playing video"], correct: 1 }
    ],
    kotlin: [
        { question: "Kotlin is fully interoperable with which other language?", options: ["C++", "Java", "Python", "Swift"], correct: 1 },
        { question: "How do you declare a read-only (immutable) variable in Kotlin?", options: ["var", "int", "val", "def"], correct: 2 },
        { question: "Does Kotlin have built-in null safety?", options: ["No", "Yes, it aims to eliminate the NullPointerException", "Optional", "Only via external library"], correct: 1 }
    ],
    swift: [
        { question: "Which keyword is used to declare a constant in Swift?", options: ["let", "var", "const", "static"], correct: 0 },
        { question: "Which syntax is safely used to unwrap an optional?", options: ["if let", "unpack", "open", "check"], correct: 0 },
        { question: "Which modern framework is used for building UI in Swift?", options: ["UIKit", "SwiftUI", "React Native", "Flutter"], correct: 1 }
    ],
    laravel: [
        { question: "Laravel is a web application framework for which language?", options: ["Ruby", "PHP", "Python", "Java"], correct: 1 },
        { question: "What is the name of Laravel's templating engine?", options: ["Twig", "Blade", "Ejs", "Pug"], correct: 1 },
        { question: "What is the name of Laravel's built-in ORM?", options: ["Eloquent", "Doctrine", "Hibernate", "Entity"], correct: 0 }
    ],
    wordpress: [
        { question: "WordPress is primarily built using which programming language?", options: ["Python", "PHP", "Java", "C#"], correct: 1 },
        { question: "What determines the visual design and layout of a WordPress site?", options: ["Plugin", "Theme", "Widget", "Menu"], correct: 1 },
        { question: "How is functionality typically added to a WordPress site?", options: ["Apps", "Plugins", "Mods", "DLC"], correct: 1 }
    ]
};

export default function SkillEvaluation() {
    const navigate = useNavigate();
    const [currentState, setCurrentState] = useState('selection'); // selection, assessment, results
    const [selectedStacks, setSelectedStacks] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(30);
    const [score, setScore] = useState(0);
    const [skillScores, setSkillScores] = useState({});

    const currentStack = selectedStacks[0];
    const questions = currentStack ? (sampleQuestions[currentStack] || sampleQuestions.generic) : [];
    const currentQuestion = questions[currentQuestionIndex];

    // Timer
    useEffect(() => {
        if (currentState === 'assessment' && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && currentState === 'assessment') {
            handleNextQuestion();
        }
    }, [timeLeft, currentState]);

    const toggleStack = (stackId) => {
        if (selectedStacks.includes(stackId)) {
            setSelectedStacks(selectedStacks.filter(s => s !== stackId));
        } else {
            setSelectedStacks([...selectedStacks, stackId]);
        }
    };

    const startAssessment = () => {
        if (selectedStacks.length > 0) {
            setCurrentState('assessment');
            setTimeLeft(30);
        }
    };

    const handleAnswer = (optionIndex) => {
        const isCorrect = optionIndex === currentQuestion.correct;
        setAnswers([...answers, { questionIndex: currentQuestionIndex, answer: optionIndex, correct: isCorrect }]);

        if (isCorrect) {
            setScore(score + 1);
        }

        setTimeout(() => handleNextQuestion(), 500);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setTimeLeft(30);
        } else {
            // Calculate final scores
            const finalScore = ((score + 1) / questions.length) * 100;
            setSkillScores({
                [currentStack]: finalScore,
                overall: finalScore
            });
            setCurrentState('results');
        }
    };

    const resetEvaluation = () => {
        setCurrentState('selection');
        setSelectedStacks([]);
        setCurrentQuestionIndex(0);
        setAnswers([]);
        setScore(0);
        setTimeLeft(30);
        setSkillScores({});
    };

    return (
        <AnimatedPage className="skill-evaluation-container">
            {/* Header */}
            <div className="evaluation-header">
                <button onClick={() => navigate('/dashboard')} className="back-btn">
                    <ArrowLeft size={20} />
                    <span>Back to Dashboard</span>
                </button>
                <h1 className="page-title">Skill Evaluation</h1>
            </div>

            <AnimatePresence mode="wait">
                {currentState === 'selection' && (
                    <Motion.div
                        key="selection"
                        className="selection-state"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="selection-header">
                            <h2>Select Your Path</h2>
                            <p>Choose a role or specific skill to evaluate</p>
                        </div>

                        {/* Roles Section */}
                        <div className="section-title-wrapper">
                            <h3>Career Roles</h3>
                            <div className="section-divider"></div>
                        </div>
                        <div className="tech-stack-grid">
                            {roles.map((role, idx) => {
                                const Icon = role.icon;
                                const isSelected = selectedStacks.includes(role.id);
                                return (
                                    <Motion.div
                                        key={role.id}
                                        className={`tech-card glass-panel ${isSelected ? 'selected' : ''}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        onClick={() => toggleStack(role.id)}
                                    >
                                        <div className="tech-icon" style={{ color: role.color }}>
                                            <Icon size={32} />
                                        </div>
                                        <h3>{role.name}</h3>
                                        <span className="tech-category">{role.category}</span>
                                        {isSelected && (
                                            <div className="selected-badge">
                                                <CheckCircle size={20} />
                                            </div>
                                        )}
                                    </Motion.div>
                                );
                            })}
                        </div>

                        {/* Skills Section */}
                        <div className="section-title-wrapper">
                            <h3>Technical Skills</h3>
                            <div className="section-divider"></div>
                        </div>
                        <div className="tech-stack-grid">
                            {skills.map((skill, idx) => {
                                const Icon = skill.icon;
                                const isSelected = selectedStacks.includes(skill.id);
                                return (
                                    <Motion.div
                                        key={skill.id}
                                        className={`tech-card glass-panel ${isSelected ? 'selected' : ''}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        onClick={() => toggleStack(skill.id)}
                                    >
                                        <div className="tech-icon" style={{ color: skill.color }}>
                                            <Icon size={32} />
                                        </div>
                                        <h3>{skill.name}</h3>
                                        <span className="tech-category">{skill.category}</span>
                                        {isSelected && (
                                            <div className="selected-badge">
                                                <CheckCircle size={20} />
                                            </div>
                                        )}
                                    </Motion.div>
                                );
                            })}
                        </div>

                        <Motion.button
                            className="start-btn neon-btn"
                            disabled={selectedStacks.length === 0}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={startAssessment}
                        >
                            Start Assessment ({selectedStacks.length} selected)
                        </Motion.button>
                    </Motion.div>
                )}

                {currentState === 'assessment' && currentQuestion && (
                    <Motion.div
                        key="assessment"
                        className="assessment-state"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="assessment-header">
                            <div className="progress-info">
                                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <div className="timer">
                                <Clock size={20} />
                                <span>{timeLeft}s</span>
                            </div>
                        </div>

                        <Motion.div className="question-card glass-panel">
                            <h2>{currentQuestion.question}</h2>
                            <div className="options-grid">
                                {currentQuestion.options.map((option, idx) => (
                                    <Motion.button
                                        key={idx}
                                        className="option-btn"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleAnswer(idx)}
                                    >
                                        <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                                        <span className="option-text">{option}</span>
                                    </Motion.button>
                                ))}
                            </div>
                        </Motion.div>
                    </Motion.div>
                )}

                {currentState === 'results' && (
                    <Motion.div
                        key="results"
                        className="results-state"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="results-header">
                            <Award size={48} color="var(--secondary)" />
                            <h2>Assessment Complete!</h2>
                            <p>Here's how you performed</p>
                        </div>

                        <div className="results-grid">
                            <Motion.div
                                className="score-card glass-panel"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h3>Overall Score</h3>
                                <div className="score-circle">
                                    <span className="score-value">{Math.round(skillScores.overall)}%</span>
                                </div>
                                <p>{score} out of {questions.length} correct</p>
                            </Motion.div>

                            <Motion.div
                                className="insights-card glass-panel"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <h3><Target size={20} /> Performance Insights</h3>
                                <div className="insight-item">
                                    <TrendingUp size={16} color="var(--matrix)" />
                                    <span>
                                        {skillScores.overall >= 70 ? 'Strong understanding!' : 'Room for improvement'}
                                    </span>
                                </div>
                                <div className="insight-item">
                                    <BookOpen size={16} color="var(--primary)" />
                                    <span>Recommended: Practice more {currentStack} concepts</span>
                                </div>
                            </Motion.div>

                            <Motion.div
                                className="recommendations-card glass-panel"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <h3>Career Match</h3>
                                <div className="career-matches">
                                    <div className="match-item">
                                        <span>Frontend Developer</span>
                                        <div className="match-bar">
                                            <div className="match-fill" style={{ width: `${skillScores.overall}%` }} />
                                        </div>
                                        <span className="match-percent">{Math.round(skillScores.overall)}%</span>
                                    </div>
                                </div>
                            </Motion.div>
                        </div>

                        <div className="results-actions">
                            <button className="outline-btn" onClick={resetEvaluation}>
                                Take Another Assessment
                            </button>
                            <button className="neon-btn" onClick={() => navigate('/roadmap')}>
                                View Learning Roadmap
                            </button>
                        </div>
                    </Motion.div>
                )}
            </AnimatePresence>
        </AnimatedPage>
    );
}
