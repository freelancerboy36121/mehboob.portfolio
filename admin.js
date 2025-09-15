// Admin Panel JavaScript
class PortfolioAdmin {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.portfolioData = {
            projects: [],
            testimonials: [],
            about: {},
            layout: {
                sections: ['about', 'skills', 'projects', 'testimonials', 'contact'],
                visibility: {
                    about: true,
                    skills: true,
                    projects: true,
                    testimonials: true,
                    contact: true
                }
            }
        };
        
        this.init();
    }

    init() {
        this.checkAuth();
        this.bindEvents();
        this.loadPortfolioData();
        this.setupDragAndDrop();
    }

    // Authentication
    checkAuth() {
        const token = localStorage.getItem('adminToken');
        if (token) {
            this.isAuthenticated = true;
            this.showDashboard();
        } else {
            this.showLogin();
        }
    }

    showLogin() {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('adminDashboard').classList.add('hidden');
    }

    showDashboard() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminDashboard').classList.remove('hidden');
        this.updateDashboardStats();
    }

    // Event Binding
    bindEvents() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        
        // Navigation tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Dashboard buttons
        document.getElementById('previewBtn').addEventListener('click', () => this.showPreview());
        document.getElementById('publishBtn').addEventListener('click', () => this.publishChanges());
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());

        // Project management
        document.getElementById('addProjectBtn').addEventListener('click', () => this.showProjectModal());
        document.getElementById('projectForm').addEventListener('submit', (e) => this.handleProjectSubmit(e));

        // Testimonial management
        document.getElementById('addTestimonialBtn').addEventListener('click', () => this.showTestimonialModal());
        document.getElementById('testimonialForm').addEventListener('submit', (e) => this.handleTestimonialSubmit(e));

        // About section
        document.getElementById('saveAboutBtn').addEventListener('click', () => this.saveAboutSection());

        // Layout management
        document.getElementById('saveLayoutBtn').addEventListener('click', () => this.saveLayout());

        // Media management
        document.getElementById('uploadMediaBtn').addEventListener('click', () => this.triggerFileUpload());
        this.setupFileUpload();
        
        // Project image preview
        const projectImageInput = document.getElementById('projectImage');
        if (projectImageInput) {
            projectImageInput.addEventListener('change', (e) => this.handleProjectImageChange(e));
        }

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => this.closeModal(e.target.closest('.modal').id));
        });

        // Skill management
        document.querySelectorAll('.add-skill').forEach(btn => {
            btn.addEventListener('click', (e) => this.showSkillModal(e.target.dataset.category));
        });
        document.getElementById('skillForm').addEventListener('submit', (e) => this.handleSkillSubmit(e));

        // Visibility toggles
        document.querySelectorAll('.visibility-toggle input').forEach(toggle => {
            toggle.addEventListener('change', (e) => this.updateSectionVisibility(e.target.id, e.target.checked));
        });
    }

    // Login Handler
    handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simple authentication (in production, use proper backend)
        if (username === 'admin' && password === 'admin123') {
            this.isAuthenticated = true;
            this.currentUser = { username: 'admin' };
            localStorage.setItem('adminToken', 'demo-token');
            this.showDashboard();
            this.showMessage('Login successful!', 'success');
        } else {
            this.showMessage('Invalid credentials. Try admin/admin123', 'error');
        }
    }

    logout() {
        this.isAuthenticated = false;
        this.currentUser = null;
        localStorage.removeItem('adminToken');
        this.showLogin();
        this.showMessage('Logged out successfully', 'info');
    }

    // Tab Management
    switchTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // Show selected tab
        document.getElementById(tabName + 'Tab').classList.add('active');
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Load tab-specific content
        this.loadTabContent(tabName);
    }

    loadTabContent(tabName) {
        switch(tabName) {
            case 'projects':
                this.loadProjects();
                break;
            case 'testimonials':
                this.loadTestimonials();
                break;
            case 'about':
                this.loadAboutSection();
                break;
            case 'layout':
                this.loadLayoutSettings();
                break;
            case 'media':
                this.loadMediaLibrary();
                break;
        }
    }

    // Dashboard Stats
    updateDashboardStats() {
        document.getElementById('projectCount').textContent = this.portfolioData.projects.length;
        document.getElementById('testimonialCount').textContent = this.portfolioData.testimonials.length;
        document.getElementById('viewCount').textContent = Math.floor(Math.random() * 1000) + 100;
        document.getElementById('lastUpdated').textContent = new Date().toLocaleDateString();
    }

    // Project Management
    showProjectModal(projectId = null) {
        const modal = document.getElementById('projectModal');
        const title = document.getElementById('projectModalTitle');
        const form = document.getElementById('projectForm');

        if (projectId) {
            // Edit mode
            const project = this.portfolioData.projects.find(p => p.id === projectId);
            if (project) {
                title.textContent = 'Edit Project';
                this.populateProjectForm(project);
                form.dataset.editId = projectId;
            }
        } else {
            // Add mode
            title.textContent = 'Add New Project';
            form.reset();
            delete form.dataset.editId;
        }

        this.showModal('projectModal');
    }

    populateProjectForm(project) {
        document.getElementById('projectTitle').value = project.title;
        document.getElementById('projectDescription').value = project.description;
        document.getElementById('projectTech').value = project.tech.join(', ');
        document.getElementById('projectDemo').value = project.demo || '';
        document.getElementById('projectCode').value = project.code || '';
        
        // Show current image if exists
        const imagePreview = document.getElementById('projectImagePreview');
        if (imagePreview) {
            if (project.image) {
                imagePreview.innerHTML = `
                    <img src="${project.image}" alt="Current project image" style="max-width: 200px; max-height: 150px; border-radius: 8px;">
                    <button type="button" class="btn btn-sm btn-outline" onclick="removeProjectImage()" style="margin-top: 10px;">
                        <i class="fas fa-trash"></i> Remove Image
                    </button>
                `;
                imagePreview.style.display = 'block';
            } else {
                imagePreview.style.display = 'none';
            }
        }
    }

    handleProjectSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const imageFile = formData.get('image');
        
        // Handle image upload
        let imageUrl = null;
        if (imageFile && imageFile.size > 0) {
            imageUrl = URL.createObjectURL(imageFile);
            
            // Store image in media library
            if (!this.portfolioData.media) {
                this.portfolioData.media = [];
            }
            
            const mediaItem = {
                id: Date.now().toString(),
                name: imageFile.name,
                url: imageUrl,
                type: 'image',
                usedIn: 'project'
            };
            
            this.portfolioData.media.push(mediaItem);
        }
        
        const projectData = {
            id: e.target.dataset.editId || Date.now().toString(),
            title: formData.get('title'),
            description: formData.get('description'),
            tech: formData.get('tech').split(',').map(t => t.trim()).filter(t => t),
            demo: formData.get('demo'),
            code: formData.get('code'),
            image: imageUrl
        };

        if (e.target.dataset.editId) {
            // Update existing project
            const index = this.portfolioData.projects.findIndex(p => p.id === e.target.dataset.editId);
            if (index !== -1) {
                this.portfolioData.projects[index] = projectData;
            }
        } else {
            // Add new project
            this.portfolioData.projects.push(projectData);
        }

        // Update global data immediately
        if (window.portfolioData) {
            window.portfolioData.projects = this.portfolioData.projects;
            if (window.portfolioData.media) {
                window.portfolioData.media = this.portfolioData.media;
            }
            localStorage.setItem('portfolioData', JSON.stringify(window.portfolioData));
            window.dispatchEvent(new CustomEvent('portfolioDataChanged'));
        }

        this.savePortfolioData();
        this.closeModal('projectModal');
        this.showMessage('Project saved successfully!', 'success');
        this.loadProjects();
    }

    loadProjects() {
        const container = document.getElementById('projectsList');
        container.innerHTML = '';

        this.portfolioData.projects.forEach(project => {
            const projectElement = this.createProjectElement(project);
            container.appendChild(projectElement);
        });
    }

    createProjectElement(project) {
        const div = document.createElement('div');
        div.className = 'project-item';
        div.innerHTML = `
            <div class="project-header">
                <h3 class="project-title">${project.title}</h3>
                <div class="project-actions">
                    <button class="btn btn-sm btn-secondary" onclick="admin.editProject('${project.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="admin.deleteProject('${project.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
            ${project.image ? `
                <div class="project-image-preview">
                    <img src="${project.image}" alt="${project.title}" style="max-width: 100%; max-height: 200px; border-radius: 8px; margin-bottom: 1rem;">
                </div>
            ` : ''}
            <p class="project-description">${project.description}</p>
            <div class="project-tech">
                ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
        `;
        return div;
    }

    editProject(projectId) {
        this.showProjectModal(projectId);
    }

    deleteProject(projectId) {
        if (confirm('Are you sure you want to delete this project?')) {
            this.portfolioData.projects = this.portfolioData.projects.filter(p => p.id !== projectId);
            this.savePortfolioData();
            this.showMessage('Project deleted successfully!', 'success');
            this.loadProjects();
        }
    }

    // Testimonial Management
    showTestimonialModal(testimonialId = null) {
        const modal = document.getElementById('testimonialModal');
        const title = document.getElementById('testimonialModalTitle');
        const form = document.getElementById('testimonialForm');

        if (testimonialId) {
            // Edit mode
            const testimonial = this.portfolioData.testimonials.find(t => t.id === testimonialId);
            if (testimonial) {
                title.textContent = 'Edit Testimonial';
                this.populateTestimonialForm(testimonial);
                form.dataset.editId = testimonialId;
            }
        } else {
            // Add mode
            title.textContent = 'Add New Testimonial';
            form.reset();
            delete form.dataset.editId;
        }

        this.showModal('testimonialModal');
    }

    populateTestimonialForm(testimonial) {
        document.getElementById('testimonialContent').value = testimonial.content;
        document.getElementById('testimonialName').value = testimonial.name;
        document.getElementById('testimonialRole').value = testimonial.role;
        document.getElementById('testimonialCompany').value = testimonial.company || '';
    }

    handleTestimonialSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const testimonialData = {
            id: e.target.dataset.editId || Date.now().toString(),
            content: formData.get('content'),
            name: formData.get('name'),
            role: formData.get('role'),
            company: formData.get('company')
        };

        if (e.target.dataset.editId) {
            // Update existing testimonial
            const index = this.portfolioData.testimonials.findIndex(t => t.id === e.target.dataset.editId);
            if (index !== -1) {
                this.portfolioData.testimonials[index] = testimonialData;
            }
        } else {
            // Add new testimonial
            this.portfolioData.testimonials.push(testimonialData);
        }

        // Update global data immediately
        if (window.portfolioData) {
            window.portfolioData.testimonials = this.portfolioData.testimonials;
            localStorage.setItem('portfolioData', JSON.stringify(window.portfolioData));
            window.dispatchEvent(new CustomEvent('portfolioDataChanged'));
        }

        this.savePortfolioData();
        this.closeModal('testimonialModal');
        this.showMessage('Testimonial saved successfully!', 'success');
        this.loadTestimonials();
    }

    loadTestimonials() {
        const container = document.getElementById('testimonialsList');
        container.innerHTML = '';

        this.portfolioData.testimonials.forEach(testimonial => {
            const testimonialElement = this.createTestimonialElement(testimonial);
            container.appendChild(testimonialElement);
        });
    }

    createTestimonialElement(testimonial) {
        const div = document.createElement('div');
        div.className = 'testimonial-item';
        div.innerHTML = `
            <div class="testimonial-header">
                <h3 class="testimonial-author">${testimonial.name}</h3>
                <div class="testimonial-actions">
                    <button class="btn btn-sm btn-secondary" onclick="admin.editTestimonial('${testimonial.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="admin.deleteTestimonial('${testimonial.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
            <p class="testimonial-content">"${testimonial.content}"</p>
            <p class="testimonial-role">${testimonial.role}${testimonial.company ? ` at ${testimonial.company}` : ''}</p>
        `;
        return div;
    }

    editTestimonial(testimonialId) {
        this.showTestimonialModal(testimonialId);
    }

    deleteTestimonial(testimonialId) {
        if (confirm('Are you sure you want to delete this testimonial?')) {
            this.portfolioData.testimonials = this.portfolioData.testimonials.filter(t => t.id !== testimonialId);
            this.savePortfolioData();
            this.showMessage('Testimonial deleted successfully!', 'success');
            this.loadTestimonials();
        }
    }

    // About Section Management
    loadAboutSection() {
        // Load existing data into form
        if (this.portfolioData.about.name) {
            document.getElementById('aboutName').value = this.portfolioData.about.name;
            document.getElementById('aboutTitle').value = this.portfolioData.about.title;
            document.getElementById('aboutBio').value = this.portfolioData.about.bio;
            document.getElementById('aboutProjects').value = this.portfolioData.about.projects;
            document.getElementById('aboutExperience').value = this.portfolioData.about.experience;
            document.getElementById('aboutClients').value = this.portfolioData.about.clients;
            document.getElementById('aboutEmail').value = this.portfolioData.about.email;
            document.getElementById('aboutPhone').value = this.portfolioData.about.phone;
            document.getElementById('aboutLocation').value = this.portfolioData.about.location;
        }

        // Load skills
        this.loadSkills();
    }

    loadSkills() {
        const categories = ['frontend', 'backend', 'tools'];
        categories.forEach(category => {
            const container = document.getElementById(category + 'Skills');
            container.innerHTML = '';
            
            if (this.portfolioData.about.skills && this.portfolioData.about.skills[category]) {
                this.portfolioData.about.skills[category].forEach(skill => {
                    const skillElement = this.createSkillElement(skill, category);
                    container.appendChild(skillElement);
                });
            }
        });
    }

    createSkillElement(skill, category) {
        const span = document.createElement('span');
        span.className = 'skill-tag';
        span.innerHTML = `
            ${skill}
            <button class="remove-skill" onclick="admin.removeSkill('${skill}', '${category}')">&times;</button>
        `;
        return span;
    }

    showSkillModal(category) {
        this.currentSkillCategory = category;
        this.showModal('skillModal');
    }

    handleSkillSubmit(e) {
        e.preventDefault();
        const skillName = document.getElementById('skillName').value.trim();
        
        if (skillName) {
            if (!this.portfolioData.about.skills) {
                this.portfolioData.about.skills = { frontend: [], backend: [], tools: [] };
            }
            
            if (!this.portfolioData.about.skills[this.currentSkillCategory].includes(skillName)) {
                this.portfolioData.about.skills[this.currentSkillCategory].push(skillName);
                this.savePortfolioData();
                this.loadSkills();
                this.closeModal('skillModal');
                this.showMessage('Skill added successfully!', 'success');
            } else {
                this.showMessage('Skill already exists!', 'error');
            }
        }
    }

    removeSkill(skill, category) {
        if (confirm(`Remove skill "${skill}"?`)) {
            this.portfolioData.about.skills[category] = this.portfolioData.about.skills[category].filter(s => s !== skill);
            this.savePortfolioData();
            this.loadSkills();
            this.showMessage('Skill removed successfully!', 'success');
        }
    }

    saveAboutSection() {
        const aboutData = {
            name: document.getElementById('aboutName').value,
            title: document.getElementById('aboutTitle').value,
            bio: document.getElementById('aboutBio').value,
            projects: document.getElementById('aboutProjects').value,
            experience: document.getElementById('aboutExperience').value,
            clients: document.getElementById('aboutClients').value,
            email: document.getElementById('aboutEmail').value,
            phone: document.getElementById('aboutPhone').value,
            location: document.getElementById('aboutLocation').value,
            skills: this.portfolioData.about.skills || { frontend: [], backend: [], tools: [] }
        };

        this.portfolioData.about = aboutData;
        
        // Update global data immediately
        if (window.portfolioData) {
            window.portfolioData.about = aboutData;
            localStorage.setItem('portfolioData', JSON.stringify(window.portfolioData));
            window.dispatchEvent(new CustomEvent('portfolioDataChanged'));
        }
        
        this.savePortfolioData();
        this.showMessage('About section saved successfully!', 'success');
    }

    // Layout Management
    loadLayoutSettings() {
        // Load section order
        const orderList = document.getElementById('sectionOrder');
        orderList.innerHTML = '';
        
        this.portfolioData.layout.sections.forEach(section => {
            const li = document.createElement('li');
            li.dataset.section = section;
            li.innerHTML = `
                <i class="fas fa-grip-vertical"></i>
                <span>${section.charAt(0).toUpperCase() + section.slice(1)} Section</span>
            `;
            orderList.appendChild(li);
        });

        // Load visibility toggles
        Object.keys(this.portfolioData.layout.visibility).forEach(section => {
            const toggle = document.getElementById('show' + section.charAt(0).toUpperCase() + section.slice(1));
            if (toggle) {
                toggle.checked = this.portfolioData.layout.visibility[section];
            }
        });
    }

    setupDragAndDrop() {
        const orderList = document.getElementById('sectionOrder');
        if (orderList) {
            new Sortable(orderList, {
                animation: 150,
                onEnd: (evt) => {
                    const newOrder = Array.from(orderList.children).map(li => li.dataset.section);
                    this.portfolioData.layout.sections = newOrder;
                }
            });
        }
    }

    updateSectionVisibility(sectionId, visible) {
        const section = sectionId.replace('show', '').toLowerCase();
        this.portfolioData.layout.visibility[section] = visible;
    }

    saveLayout() {
        this.savePortfolioData();
        this.showMessage('Layout saved successfully!', 'success');
    }

    // Project Image Preview
    handleProjectImageChange(e) {
        const file = e.target.files[0];
        const imagePreview = document.getElementById('projectImagePreview');
        
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.innerHTML = `
                    <img src="${e.target.result}" alt="Image preview" style="max-width: 200px; max-height: 150px; border-radius: 8px;">
                    <button type="button" class="btn btn-sm btn-outline" onclick="removeProjectImage()" style="margin-top: 10px;">
                        <i class="fas fa-trash"></i> Remove Image
                    </button>
                `;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.style.display = 'none';
        }
    }

    // Media Management
    setupFileUpload() {
        const uploadZone = document.getElementById('uploadZone');
        const fileInput = document.getElementById('fileInput');

        uploadZone.addEventListener('click', () => fileInput.click());
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.style.borderColor = '#ffd700';
        });
        uploadZone.addEventListener('dragleave', () => {
            uploadZone.style.borderColor = '#444';
        });
        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.style.borderColor = '#444';
            const files = e.dataTransfer.files;
            this.handleFileUpload(files);
        });

        fileInput.addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files);
        });
    }

    triggerFileUpload() {
        document.getElementById('fileInput').click();
    }

    handleFileUpload(files) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.addMediaItem(file.name, e.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    addMediaItem(name, dataUrl) {
        if (!this.portfolioData.media) {
            this.portfolioData.media = [];
        }

        const mediaItem = {
            id: Date.now().toString(),
            name: name,
            url: dataUrl,
            type: 'image'
        };

        this.portfolioData.media.push(mediaItem);
        this.savePortfolioData();
        this.loadMediaLibrary();
        this.showMessage('Media uploaded successfully!', 'success');
    }

    loadMediaLibrary() {
        const container = document.getElementById('mediaGrid');
        container.innerHTML = '';

        if (this.portfolioData.media) {
            this.portfolioData.media.forEach(item => {
                const mediaElement = this.createMediaElement(item);
                container.appendChild(mediaElement);
            });
        }
    }

    createMediaElement(item) {
        const div = document.createElement('div');
        div.className = 'media-item';
        div.innerHTML = `
            <img src="${item.url}" alt="${item.name}">
            <div class="media-item-info">
                <div class="media-item-name">${item.name}</div>
                <div class="media-item-actions">
                    <button class="btn-delete" onclick="admin.deleteMedia('${item.id}')">Delete</button>
                    <button class="btn-use" onclick="admin.useMedia('${item.id}')">Use</button>
                </div>
            </div>
        `;
        return div;
    }

    deleteMedia(mediaId) {
        if (confirm('Delete this media item?')) {
            this.portfolioData.media = this.portfolioData.media.filter(m => m.id !== mediaId);
            this.savePortfolioData();
            this.loadMediaLibrary();
            this.showMessage('Media deleted successfully!', 'success');
        }
    }

    useMedia(mediaId) {
        // Implementation for using media in projects/about section
        this.showMessage('Media usage feature coming soon!', 'info');
    }

    // Preview and Publishing
    showPreview() {
        this.showModal('previewModal');
        // Update preview iframe with current data
        setTimeout(() => {
            const iframe = document.getElementById('previewFrame');
            iframe.src = '../index.html';
        }, 100);
    }

    publishChanges() {
        // In a real application, this would sync with the main portfolio
        this.savePortfolioData();
        this.showMessage('Changes published successfully!', 'success');
    }

    // Modal Management
    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    // Data Management
    loadPortfolioData() {
        const saved = localStorage.getItem('portfolioData');
        if (saved) {
            this.portfolioData = { ...this.portfolioData, ...JSON.parse(saved) };
        }
        
        // Also try to get from global data manager if available
        if (window.portfolioDataManager) {
            const globalData = window.portfolioDataManager.getAllData();
            this.portfolioData = { ...this.portfolioData, ...globalData };
        }
    }

    savePortfolioData() {
        localStorage.setItem('portfolioData', JSON.stringify(this.portfolioData));
        
        // Update global data manager
        if (window.portfolioData) {
            // Sync our data with global data
            Object.keys(this.portfolioData).forEach(key => {
                if (key === 'about' && this.portfolioData[key]) {
                    window.updatePortfolioAbout(this.portfolioData[key]);
                } else if (key === 'projects' && this.portfolioData[key]) {
                    // Update projects in global data
                    window.portfolioData.projects = this.portfolioData.projects;
                    localStorage.setItem('portfolioData', JSON.stringify(window.portfolioData));
                } else if (key === 'testimonials' && this.portfolioData[key]) {
                    // Update testimonials in global data
                    window.portfolioData.testimonials = this.portfolioData.testimonials;
                    localStorage.setItem('portfolioData', JSON.stringify(window.portfolioData));
                } else if (key === 'layout' && this.portfolioData[key]) {
                    window.updatePortfolioLayout(this.portfolioData[key]);
                }
            });
        }
    }

    // Utility Functions
    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

// Initialize admin panel
let admin;
document.addEventListener('DOMContentLoaded', () => {
    admin = new PortfolioAdmin();
});

    // Global functions for onclick handlers
    window.admin = admin;

    // Remove project image function
    window.removeProjectImage = function() {
        const imagePreview = document.getElementById('projectImagePreview');
        if (imagePreview) {
            imagePreview.style.display = 'none';
            imagePreview.innerHTML = '';
        }
        
        // Clear the file input
        const fileInput = document.getElementById('projectImage');
        if (fileInput) {
            fileInput.value = '';
        }
    };
