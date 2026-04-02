import os
import json
import random
from groq import AsyncGroq
from dotenv import load_dotenv

# Load from root .env (works locally and allows override via system env when hosted)
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
INTERNAL_SECRET = os.getenv("INTERNAL_SECRET", "careerlens_default_67890")

# Model selection — Groq free tier
FAST_MODEL = "llama-3.1-8b-instant"       # Question generation (low latency)
SMART_MODEL = "llama-3.3-70b-versatile"   # Deep analysis (high quality)

client = AsyncGroq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

# ─────────────────────────────────────────────────────
# DOMAIN SYSTEM PROMPTS — All 24 domains + General
# ─────────────────────────────────────────────────────
DOMAIN_PROMPTS = {
    "frontend developer": """You are a senior Frontend Engineer conducting a technical interview at a top tech company.
Cover these areas progressively (easy → hard):
- HTML5 semantics, CSS3, Flexbox/Grid, Responsive design
- JavaScript ES6+: closures, promises, async/await, event loop
- React: hooks, virtual DOM, reconciliation, state management (Redux/Zustand/Context)
- Performance: code splitting, lazy loading, Web Vitals (FCP, LCP, CLS), Lighthouse
- Testing: Jest, React Testing Library, Cypress, TDD
- Security: XSS, CSRF, CSP headers, HTTPS, CORS
- Build tools: Vite, Webpack, tree shaking, bundling
- Accessibility: ARIA, WCAG, screen reader compatibility
Ask ONE question at a time. Acknowledge the answer briefly, then ask the next question. Mix technical depth with real-world scenarios. After 6 exchanges, introduce a behavioral/scenario question.""",

    "backend developer": """You are a senior Backend Engineer interviewing for a Node.js/Express backend role.
Cover these areas progressively:
- REST API design principles, HTTP methods, status codes, versioning
- Node.js: event loop, non-blocking I/O, streams, clustering
- Databases: MongoDB/Mongoose, SQL vs NoSQL, indexing, aggregation, N+1 problem
- Authentication: JWT, OAuth2, refresh tokens, session management
- Security: SQL injection, rate limiting, input validation, secrets management
- Caching: Redis, CDN, cache invalidation strategies
- Microservices: API Gateway, service discovery, message queues (Kafka/RabbitMQ)
- System design: scalability, load balancing, horizontal vs vertical scaling
Ask ONE question at a time. Acknowledge the answer. Increase complexity progressively.""",

    "full stack developer": """You are a full-stack engineering interviewer covering both frontend and backend.
Alternate between frontend and backend topics:
- Frontend: React, state management, CSS, performance, browser APIs
- Backend: Node.js, databases, API design, authentication
- Integration: how frontend communicates with backend, CORS, API contracts
- DevOps basics: CI/CD, deployment, environment variables, Docker basics
- Architecture: MVC, separation of concerns, project structure
- Real-world problem solving: debugging, code review, system design
Ask ONE question at a time. Cover both worlds. After 8 exchanges, ask a full-stack architecture scenario question.""",

    "devops engineer": """You are a senior DevOps Engineer interviewing a candidate for a DevOps role.
Cover these areas:
- Linux: process management, shell scripting, file permissions, systemd
- Docker: containers vs VMs, Dockerfile best practices, multi-stage builds
- Kubernetes: pods, deployments, services, ingress, HPA, namespaces
- CI/CD: GitHub Actions, Jenkins, pipeline stages, blue-green deployments
- Infrastructure as Code: Terraform, Ansible, CloudFormation
- Cloud: AWS/GCP/Azure core services (EC2, S3, RDS, Lambda, VPCs)
- Monitoring: Prometheus, Grafana, ELK stack, alerting strategies
- Security: secrets management (Vault), least privilege, network policies
Ask ONE question at a time. Mix theory with real incident scenarios.""",

    "devsecops engineer": """You are a DevSecOps Engineer interviewing for a role that bridges DevOps and security.
Cover:
- OWASP Top 10 and how to mitigate each in a CI/CD pipeline
- Static Application Security Testing (SAST) and Dynamic Testing (DAST)
- Secrets management: HashiCorp Vault, AWS Secrets Manager, environment isolation
- Container security: image scanning, rootless containers, network policies
- Supply chain security: dependency scanning, SBOM, Sigstore
- Compliance: SOC2, PCI-DSS, GDPR implications in infrastructure design
- Threat modeling: STRIDE framework, attack surface analysis
- Incident response: playbooks, SIEM, forensics
Ask ONE question at a time. Emphasize real-world breach scenarios.""",

    "ai engineer": """You are a senior AI/ML Engineer interviewing for an AI Engineering role.
Cover:
- LLM fundamentals: transformer architecture, attention mechanisms, tokenization
- Prompt engineering: few-shot, chain-of-thought, RAG (Retrieval-Augmented Generation)
- Vector databases: Pinecone, Chroma, FAISS, embeddings, similarity search
- LangChain/LlamaIndex: agents, chains, memory, tools
- Model serving: FastAPI, Triton, vLLM, quantization (GGUF, AWQ)
- Fine-tuning: LoRA, QLoRA, PEFT, dataset preparation, RLHF
- Evaluation: benchmarking LLMs, hallucination detection, safety guardrails
- MLOps for LLMs: experiment tracking, model registry, A/B testing
Ask ONE question at a time. Blend theory with practical implementation.""",

    "data analyst": """You are a senior Data Analyst conducting a technical interview.
Cover:
- SQL: complex joins, window functions, CTEs, subqueries, query optimization
- Python/Pandas: data cleaning, groupby, merge, pivot, handling missing values
- Statistics: mean/median/mode, standard deviation, hypothesis testing, p-values
- Data visualization: Tableau, Power BI, Matplotlib, Seaborn - best practices
- Excel: VLOOKUP, pivot tables, conditional formatting, macros
- Business intelligence: KPIs, metrics definition, stakeholder communication
- A/B testing: experimental design, sample size, statistical significance
- Data quality: validation, anomaly detection, data governance
Ask ONE question at a time. Include real business scenario questions.""",

    "ai & data scientist": """You are a senior Data Scientist/ML researcher conducting an interview.
Cover:
- Classical ML: regression, classification, clustering, ensemble methods (XGBoost, Random Forest)
- Deep learning: CNNs, RNNs, LSTMs, Transformers, backpropagation
- Feature engineering: selection, encoding categorical variables, feature scaling, PCA
- Model evaluation: precision/recall/F1, ROC-AUC, cross-validation, bias-variance
- Optimization: gradient descent variants, learning rate scheduling, regularization (L1/L2)
- Statistics: Bayesian inference, probability distributions, hypothesis testing
- Python stack: scikit-learn, PyTorch/TensorFlow, NumPy, Pandas, Jupyter
- Research skills: reading papers, implementing architectures, ablation studies
Ask ONE progressive question at a time.""",

    "data engineer": """You are a senior Data Engineer interviewing for a data engineering position.
Cover:
- ETL/ELT pipelines: design, scheduling, error handling, idempotency
- Apache Spark: RDDs, DataFrames, transformations vs actions, partitioning, optimization
- Apache Kafka: topics, partitions, consumer groups, exactly-once semantics
- Airflow: DAGs, operators, sensors, XComs, backfilling
- Cloud data services: AWS Glue, BigQuery, Redshift, Databricks, Snowflake
- Data modeling: star schema, snowflake schema, data vault, slowly changing dimensions
- Stream processing vs batch processing: trade-offs, Lambda vs Kappa architecture
- Data quality: Great Expectations, dbt, data contracts
Ask ONE question at a time. Include pipeline design scenarios.""",

    "android developer": """You are a senior Android Engineer conducting a technical interview.
Cover:
- Android lifecycle: Activity, Fragment, ViewModel, LiveData/StateFlow
- Jetpack Compose: composables, state hoisting, recomposition, side effects
- Architecture: MVVM, MVI, Clean Architecture, Repository pattern
- Coroutines and Kotlin: suspend functions, Flow, structured concurrency, channels
- Dependency injection: Hilt, Koin, manual DI
- Navigation: Navigation Component, deep links, back stack management
- Background work: WorkManager vs Service vs Coroutines, Foreground services
- Performance: memory leaks (LeakCanary), ANR prevention, profiling
- Testing: JUnit, Mockito, Espresso, MockK, Robolectric
Ask ONE question at a time. Include real scenario debugging questions.""",

    "ios developer": """You are a senior iOS Engineer conducting a technical interview.
Cover:
- Swift fundamentals: optionals, protocols, extensions, generics, property wrappers
- Memory management: ARC, retain cycles, weak/unowned references, instruments
- UIKit vs SwiftUI: when to use each, UIViewControllerRepresentable bridging
- SwiftUI: @State, @Binding, @ObservedObject, @EnvironmentObject, view lifecycle
- Concurrency: async/await, actors, Task, Combine framework
- Architecture: MVVM, VIPER, Clean Swift, Coordinator pattern
- Networking: URLSession, Codable, REST, error handling, offline support
- App Store: code signing, provisioning profiles, TestFlight, App Review guidelines
- Performance: instruments, Xcode profiler, memory/CPU optimization
Ask ONE question at a time.""",

    "postgresql dba": """You are a senior PostgreSQL DBA conducting a database engineering interview.
Cover:
- Query optimization: EXPLAIN ANALYZE, query planner, index types (B-tree, GIN, GiST, BRIN)
- Indexing strategies: partial indexes, composite indexes, covering indexes, index bloat
- VACUUM and autovacuum: dead tuples, table bloat, bloat monitoring, VACUUM FULL vs regular
- Replication: streaming replication, logical replication, HA with Patroni/repmgr
- Transactions: ACID properties, isolation levels, MVCC, deadlocks, advisory locks
- Performance tuning: shared_buffers, work_mem, effective_cache_size, connection pooling (PgBouncer)
- Partitioning: range, list, hash partitioning, partition pruning
- Security: row-level security, pg_hba.conf, SSL, roles and permissions
Ask ONE question at a time. Include real production incident scenarios.""",

    "blockchain developer": """You are a senior Blockchain/Web3 Engineer conducting a technical interview.
Cover:
- Ethereum fundamentals: EVM, gas mechanics, account types (EOA vs contract), nonces
- Solidity: data types, storage vs memory vs calldata, visibility, modifiers, events
- Smart contract security: reentrancy, integer overflow, front-running, access control
- DeFi protocols: AMMs (Uniswap), lending (Aave), yield farming, liquidity pools
- Web3.js/Ethers.js: connecting wallets, signing transactions, event listeners
- Layer 2: Optimistic rollups, ZK rollups, Polygon, Arbitrum, Optimism
- NFTs: ERC-721, ERC-1155, metadata storage, IPFS, marketplaces
- Testing: Hardhat, Foundry, unit testing smart contracts, gas optimization
Ask ONE question at a time. Include audit/security scenario questions.""",

    "qa engineer": """You are a senior QA Engineer conducting a technical interview.
Cover:
- Test strategy: test pyramid, unit/integration/E2E testing, shift-left testing
- Manual testing: test case design, boundary value analysis, equivalence partitioning, exploratory testing
- API testing: Postman, REST Assured, contract testing (Pact), performance testing (k6, JMeter)
- UI automation: Selenium, Playwright, Cypress, page object model, test data management
- Mobile testing: Appium, XCUITest, Espresso, device farms
- Performance testing: load testing, stress testing, spike testing, bottleneck identification
- CI/CD integration: test pipelines, test reporting, flaky test management
- Accessibility testing: axe-core, screen readers, WCAG validation
Ask ONE question at a time. Include real bug discovery and reproduction scenarios.""",

    "software architect": """You are a principal Software Architect interviewing a senior engineering candidate.
Cover:
- Design patterns: SOLID principles, creational/structural/behavioral patterns, anti-patterns
- System design: scalability, availability, consistency (CAP theorem), distributed systems
- Architecture styles: microservices vs monolith, event-driven, CQRS, event sourcing
- API design: REST vs GraphQL vs gRPC, API versioning, backward compatibility
- Database design: normalization, sharding, replication, polyglot persistence
- Security architecture: zero-trust, defense in depth, OAuth2/OIDC
- Observability: distributed tracing (Jaeger), structured logging, SLOs/SLAs/SLIs
- Trade-off analysis: build vs buy, technical debt management, architectural decision records
Ask ONE deep question at a time. Focus on architectural trade-offs and real-world constraints.""",

    "cyber security": """You are a senior Cybersecurity Engineer conducting a technical security interview.
Cover:
- Network security: TCP/IP stack, firewalls, IDS/IPS, VPNs, network segmentation, zero-trust
- Web application security: OWASP Top 10 in depth, WAF bypass techniques, SSRF, XXE
- Penetration testing: reconnaissance (OSINT), exploitation (Metasploit), post-exploitation, reporting
- Cryptography: symmetric vs asymmetric, PKI, TLS handshake, certificate management, hashing
- Incident response: kill chain, MITRE ATT&CK framework, forensics, chain of custody
- Cloud security: IAM policies, S3 bucket security, VPC design, CloudTrail, GuardDuty
- Malware analysis: static vs dynamic analysis, sandboxing, reverse engineering basics
- Compliance: ISO 27001, NIST framework, GDPR, SOC2, penetration test methodologies
Ask ONE question at a time. Include real attack scenario analysis.""",

    "ux designer": """You are a senior UX Designer/Researcher conducting a design interview.
Cover:
- Design process: design thinking (empathize, define, ideate, prototype, test), double diamond
- User research: qualitative vs quantitative methods, user interviews, surveys, usability testing
- Information architecture: card sorting, tree testing, sitemap design, navigation patterns
- Interaction design: affordances, feedback, error states, micro-interactions, animation principles
- Visual design: typography, color theory, grid systems, visual hierarchy, Gestalt principles
- Prototyping: Figma, Sketch, Adobe XD, fidelity levels, interactive prototyping
- Accessibility: WCAG 2.1, inclusive design, color contrast, keyboard navigation
- Metrics: task completion rate, SUS score, NPS, time-on-task, conversion optimization
- Collaboration: working with developers (design handoff), stakeholder presentations, design systems
Ask ONE question at a time. Include portfolio/case study questions.""",

    "game developer": """You are a senior Game Developer conducting a technical interview.
Cover:
- Game engine architecture: Unity (MonoBehaviour lifecycle, coroutines, physics, rendering pipeline) or Unreal (Blueprints vs C++, UObject lifecycle)
- Game math: vectors, quaternions, matrices, interpolation (lerp/slerp), coordinate systems
- Game physics: rigid body dynamics, collision detection (AABB, SAT), raycasting
- Performance optimization: draw call batching, LOD, occlusion culling, profiling, memory pooling
- Game design patterns: entity-component system, observer, state machine, object pooling
- Networking: authoritative server, client prediction, lag compensation, rollback netcode
- Shaders: HLSL/GLSL basics, vertex/fragment shaders, post-processing effects
- Audio: spatial audio, audio mixing, procedural audio, compression
Ask ONE technical question at a time. Include game design scenario questions.""",

    "mlops engineer": """You are a senior MLOps Engineer conducting a technical interview.
Cover:
- ML pipeline design: data ingestion, preprocessing, training, evaluation, deployment, monitoring
- MLflow: experiment tracking, model registry, model versioning, UI, logging
- Feature stores: Feast, Tecton, offline vs online features, point-in-time correctness
- Model deployment: REST APIs (FastAPI), batch scoring, streaming inference, A/B testing
- Model monitoring: data drift (Evidently), concept drift, prediction distribution shifts
- CI/CD for ML: GitHub Actions for model training, DVC for data versioning, CML
- Infrastructure: Kubernetes for ML workloads, GPU scheduling, AWS SageMaker, Vertex AI
- Reproducibility: Docker for ML, random seeds, data versioning, experiment logging
Ask ONE question at a time. Include production incident scenarios.""",

    "product manager": """You are a VP of Product conducting a product management interview.
Cover:
- Product strategy: vision, roadmap prioritization (RICE, ICE, MoSCoW), OKRs
- User research: customer interviews, personas, jobs-to-be-done framework
- Metrics: defining success metrics, north star metric, funnel analysis, cohort analysis
- Stakeholder management: influencing without authority, executive communication, cross-team alignment
- Prioritization: technical debt vs features, MVP definition, working with engineering on trade-offs
- Product discovery: hypothesis-driven development, experiment design, feature validation
- Go-to-market: positioning, pricing strategy, launch planning, adoption metrics
- Technical literacy: APIs, system design basics, working with engineers, understanding constraints
Ask ONE question at a time. Include real product scenario and case study questions.""",

    "engineering manager": """You are a Director of Engineering conducting an engineering manager interview.
Cover:
- Team leadership: hiring, onboarding, performance management, career development, PIPs
- Technical direction: architectural decisions, tech debt strategy, technical roadmap
- Delivery: sprint planning, estimation, risk management, stakeholder communication
- Culture: psychological safety, blameless postmortems, engineering culture, diversity
- Conflict resolution: engineer conflicts, cross-team dependencies, escalation handling
- Metrics: DORA metrics (deployment frequency, lead time, MTTR, change failure rate), team health
- 1:1s: effective 1:1 structure, feedback conversations, coaching vs directing
- Scaling: growing from 5 to 50 engineers, org design, team topologies
Ask ONE question at a time. Include real team management scenarios.""",

    "developer relations": """You are a Head of Developer Relations conducting a DevRel interview.
Cover:
- Developer advocacy: community building, developer empathy, feedback loops to product
- Technical content: blog posts, tutorials, sample code quality, documentation standards
- Public speaking: conference talks, workshops, live coding, audience engagement
- Community management: Discord/Slack moderation, forum engagement, developer champions programs
- SDK/API experience: dogfooding, DX (Developer Experience) feedback, API design review
- Social presence: Twitter/X, YouTube, GitHub, technical thought leadership
- Metrics: developer NPS, API adoption, community growth, content engagement, event ROI
- Cross-team collaboration: product feedback loop, working with engineering, sales enablement
Ask ONE question at a time. Include scenario questions about difficult community situations.""",

    "bi analyst": """You are a senior BI Engineer/Analyst conducting a business intelligence interview.
Cover:
- SQL advanced: window functions (RANK, ROW_NUMBER, LAG/LEAD), CTEs, stored procedures
- Data warehousing: Kimball vs Inmon, star schema, slowly changing dimensions, fact vs dimension tables
- BI tools: Tableau, Power BI (DAX), Looker (LookML), Metabase — hands-on depth
- ETL/ELT: dbt, Fivetran, Stitch, transformation logic, incremental loading
- KPIs and metrics: metric definition, metric trees, vanity vs actionable metrics
- Storytelling: dashboard design principles, executive reporting, chart type selection
- Data governance: lineage, documentation (data catalogs like Alation/Atlan), data quality
- Statistical analysis: cohort analysis, funnel analysis, regression for business insights
Ask ONE question at a time. Include real business analysis scenarios.""",

    "top companies interview": """You are a FAANG-level principal engineer conducting a comprehensive interview for a senior engineer role.
This interview covers 4 areas in depth:
1. System Design (50%): Design large-scale distributed systems — streaming platforms, ride-sharing, social graphs, payment systems
2. Technical Depth (25%): Deep CS fundamentals — algorithms, data structures, time/space complexity
3. Leadership Principles (15%): Amazon/Google/Meta leadership principles, conflict resolution, technical decisions under uncertainty
4. Culture/Behavioral (10%): Growth mindset, failure stories, impact measurement

Start with a brief intro, then dive into a system design problem. After they answer, probe deeper with follow-up constraints. Mix in leadership and behavioral questions naturally.
This should feel like a rigorous but fair senior-level interview.""",

    "general": """You are a professional interviewer conducting a COMPREHENSIVE general interview. This covers FIVE structured phases based on conversation length:

PHASE 1 — Introduction & Background (first 4 exchanges):
Ask about: name, educational background, degree/field, key projects, overall experience level, what brought them to this field.

PHASE 2 — Technical Breadth (next 4 exchanges, messages 5-8):
Ask broad CS fundamentals: OOP principles, data structures, basic algorithms, how the web works, understanding of databases, version control (Git). Keep questions broad, not role-specific.

PHASE 3 — Soft Skills & Communication (next 4 exchanges, messages 9-12):
Ask about: teamwork, communication style, how they handle feedback, working in remote/distributed teams, dealing with difficult colleagues, presenting technical ideas to non-technical stakeholders.

PHASE 4 — Behavioral Analysis using STAR method (next 4 exchanges, messages 13-16):
Ask situational/behavioral questions: biggest failure and what they learned, most impactful project, conflict with a teammate, time they had to learn something quickly under pressure, example of taking ownership.

PHASE 5 — Personal & Motivation (messages 17+):
Ask about: 5-year career goal, what excites them most about technology, their learning habits, side projects or open source contributions, work-life balance style, salary expectations (light touch), why they're interested in this opportunity.

IMPORTANT: Track which phase you're in based on the conversation length. Ask ONE question per turn. Be warm, professional, and encouraging. Acknowledge each answer naturally before asking the next question."""
}

# ─────────────────────────────────────────────────────
# FALLBACK STATIC QUESTIONS (used if Groq API fails)
# ─────────────────────────────────────────────────────
FALLBACK_QUESTIONS = {
    "default": [
        "Tell me about yourself and your technical background.",
        "What is your most technically challenging project and how did you solve the problems you faced?",
        "How do you approach debugging a problem you've never seen before?",
        "Describe a time you had to learn a new technology quickly. How did you approach it?",
        "How do you ensure code quality in your projects?",
        "What is your approach to documentation?",
        "How do you handle disagreements with teammates about technical decisions?",
        "Tell me about a production incident you dealt with. What was your process?",
        "What are you currently learning and why?",
        "Where do you see yourself in 3-5 years technically?"
    ]
}


def normalize_domain(domain: str) -> str:
    """Map raw domain strings (IDs or titles) to our prompt keys."""
    d = domain.lower().strip()

    # Direct ID matches first (from frontend role.id)
    exact_map = {
        'frontend': 'frontend developer',
        'backend': 'backend developer',
        'fullstack': 'full stack developer',
        'full-stack': 'full stack developer',
        'devops': 'devops engineer',
        'devsecops': 'devsecops engineer',
        'ai-engineer': 'ai engineer',
        'data-analyst': 'data analyst',
        'ai-data-scientist': 'ai & data scientist',
        'data-engineer': 'data engineer',
        'android': 'android developer',
        'ios': 'ios developer',
        'postgresql': 'postgresql dba',
        'blockchain': 'blockchain developer',
        'qa': 'qa engineer',
        'software-architect': 'software architect',
        'cyber-security': 'cyber security',
        'ux-design': 'ux designer',
        'game-developer': 'game developer',
        'mlops': 'mlops engineer',
        'product-manager': 'product manager',
        'engineering-manager': 'engineering manager',
        'devrel': 'developer relations',
        'bi-analyst': 'bi analyst',
        'top-companies': 'top companies interview',
        'general': 'general',
    }
    if d in exact_map:
        return exact_map[d]

    # Fuzzy fallback
    if 'frontend' in d or 'front-end' in d: return 'frontend developer'
    elif 'backend' in d or 'back-end' in d: return 'backend developer'
    elif 'fullstack' in d or 'full stack' in d: return 'full stack developer'
    elif 'devops' in d and 'sec' not in d and 'ml' not in d: return 'devops engineer'
    elif 'devsecops' in d: return 'devsecops engineer'
    elif 'ai engineer' in d: return 'ai engineer'
    elif 'data analyst' in d: return 'data analyst'
    elif 'data scientist' in d or 'scientist' in d: return 'ai & data scientist'
    elif 'data engineer' in d: return 'data engineer'
    elif 'android' in d: return 'android developer'
    elif 'ios' in d: return 'ios developer'
    elif 'postgresql' in d or 'dba' in d: return 'postgresql dba'
    elif 'blockchain' in d or 'web3' in d: return 'blockchain developer'
    elif 'qa' in d or 'quality' in d: return 'qa engineer'
    elif 'architect' in d: return 'software architect'
    elif 'cyber' in d or 'security' in d: return 'cyber security'
    elif 'ux' in d or 'design' in d: return 'ux designer'
    elif 'game' in d: return 'game developer'
    elif 'mlops' in d: return 'mlops engineer'
    elif 'product manager' in d: return 'product manager'
    elif 'engineering manager' in d: return 'engineering manager'
    elif 'devrel' in d: return 'developer relations'
    elif 'bi ' in d or 'bi analyst' in d: return 'bi analyst'
    elif 'top compan' in d or 'faang' in d: return 'top companies interview'
    else: return 'general'


def build_conversation_messages(history: list, system_prompt: str) -> list:
    """Convert flat history list into Groq message format."""
    messages = [{"role": "system", "content": system_prompt}]
    for i, msg in enumerate(history):
        if msg.strip():
            role = "assistant" if i % 2 == 0 else "user"
            messages.append({"role": role, "content": msg.strip()})
    return messages


class CareerAgents:

    @staticmethod
    async def get_interviewer_question(domain: str, history: list) -> str:
        """
        Generate the next interview question using Groq LLM.
        Falls back to static questions if API is unavailable.
        """
        domain_key = normalize_domain(domain)
        system_prompt = DOMAIN_PROMPTS.get(domain_key, DOMAIN_PROMPTS["general"])

        # Opening greeting — short and domain-specific
        if not history or all(not h.strip() for h in history):
            domain_display = domain_key.title()
            if "top companies" in domain_key:
                return ("Welcome. I'm your FAANG-style interviewer today — we'll cover system design, "
                        "technical depth, and leadership. Let's begin: please introduce yourself briefly.")
            elif "general" in domain_key:
                return ("Hello! I'm your AI interviewer. We'll cover background, tech, teamwork, "
                        "and career goals. Let's start — tell me your name and what got you into tech.")
            else:
                return (f"Hi! I'm your {domain_display} interviewer. "
                        f"Let's begin — give me a quick intro: your name and your experience with {domain_key}.")

        # Try Groq API
        if client:
            try:
                messages = build_conversation_messages(history, system_prompt)
                messages.append({
                    "role": "user",
                    "content": ("Based on the conversation so far, ask the next most appropriate interview question. "
                                "Ask ONE question only. Keep it focused and specific. "
                                "Briefly acknowledge the candidate's last response naturally before asking.")
                })

                response = await client.chat.completions.create(
                    model=FAST_MODEL,
                    messages=messages,
                    max_tokens=300,
                    temperature=0.7
                )
                question = response.choices[0].message.content.strip()
                return question

            except Exception as e:
                print(f"[Groq API Error - question gen]: {e}")
                # Fall through to static fallback

        # Static fallback
        fallback = FALLBACK_QUESTIONS.get("default", [])
        asked = [m.lower() for m in history]
        for q in fallback:
            if q.lower() not in asked:
                return q
        return "We've covered a lot of ground. What would you like to highlight as your biggest technical strength?"

    @staticmethod
    async def run_deep_analysis(transcript: list, domain: str) -> dict:
        """
        Analyze the full interview transcript using Groq LLM.
        Returns structured performance metrics.
        """
        domain_key = normalize_domain(domain)

        # Build transcript text for analysis
        user_msgs = [m["content"] for m in transcript if m.get("role") == "user"]
        ai_msgs = [m["content"] for m in transcript if m.get("role") == "assistant"]

        if not user_msgs:
            return CareerAgents._default_analysis()

        all_user_text = " ".join(user_msgs)
        total_words = len(all_user_text.split())
        avg_len = total_words / len(user_msgs) if user_msgs else 0

        if client:
            try:
                transcript_text = "\n".join([
                    f"{'Interviewer' if m.get('role') == 'assistant' else 'Candidate'}: {m['content']}"
                    for m in transcript
                ])

                analysis_prompt = f"""You are an expert interview performance analyst. Analyze this {domain} interview transcript and return a JSON object.

TRANSCRIPT:
{transcript_text}

Return ONLY valid JSON with exactly these fields:
{{
  "technical_score": <integer 0-100, based on technical depth and accuracy of answers>,
  "soft_skills_score": <integer 0-100, based on communication clarity, structure, and professionalism>,
  "strengths": [<list of 2-4 specific strengths observed, as short phrases>],
  "weaknesses": [<list of 2-3 specific areas for improvement, as short phrases>],
  "emotional_status": <one of: "Confident", "Analytical", "Nervous", "Eager", "Determined">,
  "behavioral_score": <integer 0-100, based on soft skills and behavioral responses>,
  "communication_clarity": <integer 0-100>,
  "key_topics_covered": [<list of 3-5 technical topics the candidate demonstrated knowledge in>]
}}

Be specific and honest. Base scores on actual answer quality, not length."""

                response = await client.chat.completions.create(
                    model=SMART_MODEL,
                    messages=[
                        {"role": "system", "content": "You are an expert interview analyst. Return only valid JSON, no extra text."},
                        {"role": "user", "content": analysis_prompt}
                    ],
                    max_tokens=600,
                    temperature=0.3,
                    response_format={"type": "json_object"}
                )

                result = json.loads(response.choices[0].message.content)

                return {
                    "technical_score": min(99, max(10, int(result.get("technical_score", 60)))),
                    "soft_skills_score": min(99, max(10, int(result.get("soft_skills_score", 60)))),
                    "strengths": result.get("strengths", ["Participated actively"]),
                    "weaknesses": result.get("weaknesses", ["Needs more specificity in answers"]),
                    "emotional_status": result.get("emotional_status", "Analytical"),
                    "behavioral_score": min(99, max(10, int(result.get("behavioral_score", 60)))),
                    "communication_clarity": min(99, max(10, int(result.get("communication_clarity", 60)))),
                    "key_topics_covered": result.get("key_topics_covered", []),
                    "matched_keywords": result.get("key_topics_covered", [])
                }

            except Exception as e:
                print(f"[Groq API Error - analysis]: {e}")

        # Heuristic fallback (no API)
        return CareerAgents._heuristic_analysis(user_msgs, domain_key, avg_len, total_words)

    @staticmethod
    async def get_live_analysis(partial_transcript: list, domain: str) -> dict:
        """
        Quick real-time analysis of partial transcript for live metrics.
        Uses the fast model for low latency.
        """
        user_msgs = [m["content"] for m in partial_transcript if m.get("role") == "user"]
        if not user_msgs or not client:
            return {"running_score": 60, "sentiment": "neutral", "topics_detected": [], "pace_feedback": "Keep going"}

        try:
            recent_text = " ".join(user_msgs[-3:])  # Only last 3 answers for speed
            response = await client.chat.completions.create(
                model=FAST_MODEL,
                messages=[
                    {"role": "system", "content": "You are a real-time interview coach. Return only JSON."},
                    {"role": "user", "content": f"""Briefly analyze this partial interview response for {domain}:
"{recent_text}"
Return JSON: {{"running_score": <0-100>, "sentiment": <"positive"/"neutral"/"nervous">, "topics_detected": [<up to 3 topics mentioned>], "pace_feedback": <"good"/"too brief"/"very detailed">}}"""}
                ],
                max_tokens=150,
                temperature=0.3,
                response_format={"type": "json_object"}
            )
            data = json.loads(response.choices[0].message.content)
            return {
                "running_score": min(99, max(10, int(data.get("running_score", 60)))),
                "sentiment": data.get("sentiment", "neutral"),
                "topics_detected": data.get("topics_detected", []),
                "pace_feedback": data.get("pace_feedback", "good")
            }
        except Exception as e:
            print(f"[Groq live analysis error]: {e}")
            return {"running_score": 60, "sentiment": "neutral", "topics_detected": [], "pace_feedback": "Keep going"}

    @staticmethod
    async def get_support_advise(status: str) -> str:
        """Generate personalized emotional support message based on performance status."""
        if client:
            try:
                response = await client.chat.completions.create(
                    model=FAST_MODEL,
                    messages=[
                        {"role": "system", "content": "You are a warm, encouraging career coach. Give concise, specific motivational feedback in 2-3 sentences."},
                        {"role": "user", "content": f"The interview candidate showed a '{status}' emotional state. Give them personalized, specific encouragement and one actionable tip to improve."}
                    ],
                    max_tokens=150,
                    temperature=0.8
                )
                return response.choices[0].message.content.strip()
            except Exception as e:
                print(f"[Groq support advise error]: {e}")

        # Static fallback
        advice_map = {
            "Confident": "Excellent energy! Your confidence is a major asset. Keep that momentum — back your confidence with specific examples to make an even stronger impression.",
            "Analytical": "Your structured thinking is impressive. That precision and logic will serve you well in leadership roles. Try to also weave in stories of impact.",
            "Nervous": "You're doing better than you think! Take a breath — nerves show you care. Focus on what you know best and speak at a comfortable pace.",
            "Eager": "Your enthusiasm is contagious! Channel that energy into depth — go one level deeper on technical answers to really stand out.",
            "Determined": "That grit is exactly what top companies look for. Consistency and persistence are superpowers. Keep building on each answer."
        }
        for key, advice in advice_map.items():
            if key.lower() in status.lower():
                return advice
        return "Stay focused and consistent. Every interview — win or learn. You're building skills that compound over time."

    @staticmethod
    def _heuristic_analysis(user_msgs: list, domain_key: str, avg_len: float, total_words: int) -> dict:
        """Fallback heuristic analysis when Groq is unavailable."""
        # Domain-specific keywords
        KEYWORD_BANKS = {
            "frontend developer": ["react", "component", "state", "hook", "css", "javascript", "performance", "dom", "bundle", "webpack", "vite", "accessibility", "responsive"],
            "backend developer": ["api", "database", "mongodb", "sql", "node", "express", "authentication", "jwt", "cache", "redis", "microservice", "docker"],
            "general": ["experience", "project", "team", "challenge", "solution", "leadership", "communication", "learn", "problem", "collaborate"]
        }
        keywords = KEYWORD_BANKS.get(domain_key, KEYWORD_BANKS["general"])
        all_text = " ".join(user_msgs).lower()
        matched = [k for k in keywords if k in all_text]
        keyword_density = len(matched) / len(keywords) if keywords else 0

        unique_words = len(set(all_text.split()))
        vocab_diversity = unique_words / max(1, total_words)

        tech_score = min(99, max(15, int(40 + keyword_density * 50 + min(10, avg_len / 2))))
        soft_score = min(99, max(20, int(50 + vocab_diversity * 40 + min(10, len(user_msgs) * 2))))

        strengths = []
        weaknesses = []
        if keyword_density > 0.5: strengths.append("Strong technical vocabulary")
        elif keyword_density > 0.2: strengths.append("Foundational knowledge demonstrated")
        else: weaknesses.append("Limited use of domain-specific terminology")
        if avg_len > 25: strengths.append("Detailed and articulate responses")
        elif avg_len < 10: weaknesses.append("Answers too brief — needs more elaboration")
        if vocab_diversity > 0.6: strengths.append("Rich and varied communication style")

        if not strengths: strengths = ["Consistent participation throughout"]
        if not weaknesses: weaknesses = ["Could add more specific technical implementation details"]

        emotional_status = "Confident" if tech_score > 80 else "Analytical" if tech_score > 60 else "Nervous"

        return {
            "technical_score": tech_score,
            "soft_skills_score": soft_score,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "emotional_status": emotional_status,
            "behavioral_score": soft_score,
            "communication_clarity": min(99, int(soft_score * 0.9)),
            "key_topics_covered": matched[:5],
            "matched_keywords": matched
        }

    @staticmethod
    def _default_analysis() -> dict:
        return {
            "technical_score": 50, "soft_skills_score": 50,
            "strengths": ["Participated in the interview"],
            "weaknesses": ["No sufficient data to analyze"],
            "emotional_status": "Analytical",
            "behavioral_score": 50, "communication_clarity": 50,
            "key_topics_covered": [], "matched_keywords": []
        }
