// Original portfolio content. Presentation lives in the route components.

export const categories = [
    { name: 'All', color: '#00ff00', icon: '🌐' },
    { name: 'Offensive Security', color: '#ff0080', icon: '⚔️' },
    { name: 'Web Development', color: '#ff6b00', icon: '⚡' },
    { name: 'Full Stack Development', color: '#00ff80', icon: '🔄' },
    { name: 'Programming', color: '#00bfff', icon: '💻' },
    { name: 'Tools & Frameworks', color: '#ff8c00', icon: '🛠️' },
    { name: 'AI & ML', color: '#8a2be2', icon: '🤖' },
    { name: 'Cloud & Infrastructure', color: '#00ff80', icon: '☁️' }
];

export const skills = [
    // Offensive Security
    { name: 'Penetration Testing', level: 90, category: 'Offensive Security', icon: '🎯', description: 'Advanced penetration testing and exploit development' },
    { name: 'Web Exploitation', level: 92, category: 'Offensive Security', icon: '🌐', description: 'OWASP Top 10, SQLi, XSS, SSRF, LFI/RFI' },
    { name: 'Binary Exploitation', level: 85, category: 'Offensive Security', icon: '⚡', description: 'Buffer overflows, ROP chains, heap exploitation' },
    { name: 'Reverse Engineering', level: 88, category: 'Offensive Security', icon: '🔧', description: 'Static and dynamic analysis, binary reversing' },
    { name: 'Cryptography', level: 87, category: 'Offensive Security', icon: '🔐', description: 'Crypto attacks, hash cracking, cipher analysis' },
    { name: 'Forensics', level: 83, category: 'Offensive Security', icon: '🔍', description: 'Digital forensics and incident response' },
    { name: 'OSINT', level: 90, category: 'Offensive Security', icon: '🕵️', description: 'Open-source intelligence gathering and analysis' },
    { name: 'Network Security', level: 89, category: 'Offensive Security', icon: '🌐', description: 'Network analysis, monitoring, and defense' },
    { name: 'Privilege Escalation', level: 86, category: 'Offensive Security', icon: '⬆️', description: 'Linux/Windows privilege escalation techniques' },
    { name: 'Social Engineering', level: 80, category: 'Offensive Security', icon: '🎭', description: 'Phishing, pretexting, and human-based attacks' },

    // Web Development
    { name: 'Angular', level: 85, category: 'Web Development', icon: '🅰️', description: 'Component-based architecture, RxJS, NgRx' },
    { name: 'HTML5/CSS3', level: 95, category: 'Web Development', icon: '🎨', description: 'Semantic HTML, Flexbox, Grid, Animations' },
    { name: 'JavaScript', level: 92, category: 'Web Development', icon: '📜', description: 'ES6+, Asynchronous programming, DOM manipulation' },
    { name: 'Svelte', level: 90, category: 'Web Development', icon: '🔥', description: 'Reactive components, state management, transitions' },
    { name: 'TailwindCSS', level: 94, category: 'Web Development', icon: '🌊', description: 'Utility-first CSS, custom design systems' },
    { name: 'ASP.NET', level: 82, category: 'Web Development', icon: '🌐', description: 'Web application development' },

    // Full Stack Development
    { name: 'Next.js', level: 88, category: 'Full Stack Development', icon: '▲', description: 'SSR, ISR, API Routes, Middleware' },
    { name: 'Node.js', level: 90, category: 'Full Stack Development', icon: '🟢', description: 'Event-driven architecture, RESTful APIs' },
    { name: 'Express', level: 89, category: 'Full Stack Development', icon: '🚂', description: 'Middleware development, routing' },
    { name: 'MongoDB', level: 86, category: 'Full Stack Development', icon: '🍃', description: 'NoSQL schema design, aggregation pipelines' },
    { name: 'PostgreSQL', level: 85, category: 'Full Stack Development', icon: '🐘', description: 'Relational modelling, advanced queries' },
    { name: 'API Design', level: 88, category: 'Full Stack Development', icon: '🔌', description: 'REST, GraphQL, OpenAPI specification' },

    // Programming
    { name: 'Python', level: 95, category: 'Programming', icon: '🐍', description: 'Automation, scripting, exploit development' },
    { name: 'Bash/Shell', level: 92, category: 'Programming', icon: '💻', description: 'Shell scripting and automation' },
    { name: 'C/C++', level: 78, category: 'Programming', icon: '⚙️', description: 'System programming and exploit development' },
    { name: 'SQL', level: 88, category: 'Programming', icon: '🗄️', description: 'Database querying and SQL injection' },
    { name: 'Go', level: 75, category: 'Programming', icon: '🚀', description: 'Concurrent programming and tooling' },

    // Tools & Frameworks
    { name: 'Burp Suite', level: 93, category: 'Tools & Frameworks', icon: '🔥', description: 'Web application security testing' },
    { name: 'Metasploit', level: 90, category: 'Tools & Frameworks', icon: '💣', description: 'Exploitation framework and post-exploitation' },
    { name: 'Nmap', level: 94, category: 'Tools & Frameworks', icon: '📡', description: 'Network scanning and reconnaissance' },
    { name: 'Wireshark', level: 91, category: 'Tools & Frameworks', icon: '🦈', description: 'Network protocol analysis' },
    { name: 'Ghidra', level: 85, category: 'Tools & Frameworks', icon: '👾', description: 'Reverse engineering and disassembly' },
    { name: 'Radare2', level: 82, category: 'Tools & Frameworks', icon: '🔬', description: 'Binary analysis framework' },
    { name: 'IDA Pro', level: 80, category: 'Tools & Frameworks', icon: '🔭', description: 'Interactive disassembler' },
    { name: 'John/Hashcat', level: 88, category: 'Tools & Frameworks', icon: '🔓', description: 'Password cracking and hash analysis' },
    { name: 'pwntools', level: 87, category: 'Tools & Frameworks', icon: '🛠️', description: 'CTF framework and exploit development' },
    { name: 'SQLmap', level: 89, category: 'Tools & Frameworks', icon: '💉', description: 'Automated SQL injection tool' },
    { name: 'Docker', level: 86, category: 'Tools & Frameworks', icon: '🐳', description: 'Containerization and deployment' },
    { name: 'Git', level: 90, category: 'Tools & Frameworks', icon: '📦', description: 'Version control and collaboration' },

    // AI & ML
    { name: 'Machine Learning', level: 85, category: 'AI & ML', icon: '🧠', description: 'ML algorithms and model training' },
    { name: 'Neural Networks', level: 82, category: 'AI & ML', icon: '🕸️', description: 'Deep learning and neural architectures' },
    { name: 'Anomaly Detection', level: 88, category: 'AI & ML', icon: '🔍', description: 'ML-based threat detection' },
    { name: 'AI Security', level: 83, category: 'AI & ML', icon: '🛡️', description: 'Securing AI systems and adversarial ML' },
    { name: 'Data Analysis', level: 87, category: 'AI & ML', icon: '📊', description: 'Data processing and statistical analysis' },
    { name: 'Scikit-learn', level: 84, category: 'AI & ML', icon: '📈', description: 'ML library for Python' },
    { name: 'TensorFlow', level: 78, category: 'AI & ML', icon: '🔷', description: 'Deep learning framework' },
    { name: 'Pandas/NumPy', level: 86, category: 'AI & ML', icon: '🐼', description: 'Data manipulation libraries' },

    // Cloud & Infrastructure
    { name: 'AWS', level: 85, category: 'Cloud & Infrastructure', icon: '☁️', description: 'Amazon Web Services infrastructure' },
    { name: 'Linux Administration', level: 93, category: 'Cloud & Infrastructure', icon: '🐧', description: 'Linux system administration and hardening' },
    { name: 'Kali Linux', level: 95, category: 'Cloud & Infrastructure', icon: '🐉', description: 'Penetration testing distribution' },
    { name: 'Active Directory', level: 80, category: 'Cloud & Infrastructure', icon: '🏢', description: 'AD enumeration and exploitation' },
    { name: 'Cloud Security', level: 82, category: 'Cloud & Infrastructure', icon: '🔒', description: 'Cloud security best practices' },
    { name: 'GCP', level: 78, category: 'Cloud & Infrastructure', icon: '☁️', description: 'Google Cloud Platform' },
    { name: 'CI/CD', level: 81, category: 'Cloud & Infrastructure', icon: '🔄', description: 'Continuous integration and deployment' }
];
