// Simple Portfolio Data Manager
window.portfolioData = {
    about: {
        name: "Mr Mehboob Ceo",
        title: "Full Stack Developer & UI/UX Designer",
        bio: "I'm a passionate developer with over 5 years of experience creating web applications and digital solutions. I love turning complex problems into simple, beautiful, and intuitive designs.",
        projects: "50+",
        experience: "5+ years",
        clients: "30+",
        email: "mehboob@example.com",
        phone: "+1 (555) 123-4567",
        location: "New York, NY",
        skills: {
            frontend: ["HTML5", "CSS3", "JavaScript", "React", "Vue.js"],
            backend: ["Node.js", "Python", "PHP", "MySQL", "MongoDB"],
            tools: ["Git", "Docker", "AWS", "Figma"]
        }
    },
    projects: [
        {
            id: "1",
            title: "E-Commerce Platform",
            description: "A full-stack e-commerce solution with payment integration, user management, and admin dashboard.",
            tech: ["React", "Node.js", "MongoDB", "Stripe"],
            demo: "https://demo-ecommerce.com",
            code: "https://github.com/username/ecommerce",
            image: null
        },
        {
            id: "2",
            title: "Task Management App",
            description: "A collaborative task management application with real-time updates and team collaboration features.",
            tech: ["Vue.js", "Firebase", "CSS3"],
            demo: "https://task-app-demo.com",
            code: "https://github.com/username/task-app",
            image: null
        }
    ],
    testimonials: [
        {
            id: "1",
            content: "Working with Mr Mehboob was an absolute pleasure. He delivered our project on time and exceeded our expectations with his attention to detail and technical expertise.",
            name: "Sarah Johnson",
            role: "Project Manager",
            company: "TechCorp"
        },
        {
            id: "2",
            content: "Mr Mehboob's development skills are exceptional. He transformed our ideas into a beautiful, functional website that perfectly represents our brand.",
            name: "Michael Chen",
            role: "CEO",
            company: "StartupXYZ"
        }
    ],
    layout: {
        sections: ['about', 'skills', 'projects', 'testimonials', 'contact'],
        visibility: {
            about: true,
            skills: true,
            projects: true,
            testimonials: true,
            contact: true
        }
    },
    media: []
};

// Load data from localStorage if available
if (localStorage.getItem('portfolioData')) {
    try {
        const saved = JSON.parse(localStorage.getItem('portfolioData'));
        window.portfolioData = { ...window.portfolioData, ...saved };
    } catch (e) {
        console.error('Error loading portfolio data:', e);
    }
}

// Save data to localStorage
function savePortfolioData() {
    localStorage.setItem('portfolioData', JSON.stringify(window.portfolioData));
    // Notify other tabs/windows
    window.dispatchEvent(new CustomEvent('portfolioDataChanged'));
}

// Update functions
window.updatePortfolioAbout = function(aboutData) {
    window.portfolioData.about = { ...window.portfolioData.about, ...aboutData };
    savePortfolioData();
};

window.addPortfolioProject = function(project) {
    project.id = Date.now().toString();
    window.portfolioData.projects.push(project);
    savePortfolioData();
    return project.id;
};

window.updatePortfolioProject = function(projectId, projectData) {
    const index = window.portfolioData.projects.findIndex(p => p.id === projectId);
    if (index !== -1) {
        window.portfolioData.projects[index] = { ...window.portfolioData.projects[index], ...projectData };
        savePortfolioData();
    }
};

window.deletePortfolioProject = function(projectId) {
    window.portfolioData.projects = window.portfolioData.projects.filter(p => p.id !== projectId);
    savePortfolioData();
};

window.addPortfolioTestimonial = function(testimonial) {
    testimonial.id = Date.now().toString();
    window.portfolioData.testimonials.push(testimonial);
    savePortfolioData();
    return testimonial.id;
};

window.updatePortfolioTestimonial = function(testimonialId, testimonialData) {
    const index = window.portfolioData.testimonials.findIndex(t => t.id === testimonialId);
    if (index !== -1) {
        window.portfolioData.testimonials[index] = { ...window.portfolioData.testimonials[index], ...testimonialData };
        savePortfolioData();
    }
};

window.deletePortfolioTestimonial = function(testimonialId) {
    window.portfolioData.testimonials = window.portfolioData.testimonials.filter(t => t.id !== testimonialId);
    savePortfolioData();
};

window.updatePortfolioLayout = function(layoutData) {
    window.portfolioData.layout = { ...window.portfolioData.layout, ...layoutData };
    savePortfolioData();
};

// Listen for storage changes (cross-tab sync)
window.addEventListener('storage', (e) => {
    if (e.key === 'portfolioData') {
        try {
            const newData = JSON.parse(e.newValue);
            window.portfolioData = newData;
            window.dispatchEvent(new CustomEvent('portfolioDataChanged'));
        } catch (err) {
            console.error('Error parsing portfolio data:', err);
        }
    }
});
