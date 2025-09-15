# Portfolio Admin Panel

A comprehensive admin panel for managing your portfolio website with a sleek black and yellow theme.

## Features

### 🔐 Authentication
- Simple login system (default: admin/admin123)
- Secure session management
- Logout functionality

### 📊 Dashboard
- Overview of portfolio statistics
- Quick action buttons
- Real-time data display

### 🚀 Project Management
- **Add New Projects**: Create projects with title, description, technologies, and links
- **Edit Projects**: Modify existing project details
- **Delete Projects**: Remove projects from your portfolio
- **Image Upload**: Add project screenshots
- **Technology Tags**: Organize projects by tech stack

### 💬 Testimonial Management
- **Add Testimonials**: Collect client feedback with names, roles, and companies
- **Edit Testimonials**: Update testimonial content and details
- **Delete Testimonials**: Remove outdated testimonials

### 👤 About Section Management
- **Profile Information**: Update name, title, bio, and contact details
- **Skills Management**: 
  - Frontend skills (HTML, CSS, JavaScript, React, Vue.js)
  - Backend skills (Node.js, Python, PHP, MySQL, MongoDB)
  - Tools (Git, Docker, AWS, Figma)
- **Statistics**: Manage project count, experience years, and client numbers
- **Contact Details**: Update email, phone, and location

### 🎨 Layout Control
- **Section Ordering**: Drag and drop to reorder portfolio sections
- **Visibility Toggles**: Show/hide any section (About, Skills, Projects, Testimonials, Contact)
- **Real-time Preview**: See changes before publishing

### 📁 Media Library
- **Image Upload**: Drag and drop or click to upload images
- **Media Management**: View, delete, and organize uploaded files
- **File Support**: JPG, PNG, GIF, and other image formats

### 👁️ Preview & Publishing
- **Live Preview**: See how your portfolio looks with current changes
- **Publish Changes**: Apply updates to your live portfolio
- **Version Control**: Track changes and updates

## Getting Started

### 1. Access the Admin Panel
Navigate to `admin/index.html` in your browser.

### 2. Login
- **Username**: `admin`
- **Password**: `admin123`

### 3. Start Managing Your Portfolio
- Use the navigation tabs to access different sections
- Make changes using the intuitive forms and controls
- Preview changes before publishing
- Save and publish your updates

## File Structure

```
admin/
├── index.html          # Main admin panel interface
├── admin.css           # Styling with black & yellow theme
├── admin.js            # Admin panel functionality
└── README.md           # This documentation
```

## Usage Guide

### Adding a New Project
1. Go to the **Projects** tab
2. Click **"Add New Project"**
3. Fill in:
   - Project title
   - Description
   - Upload project image
   - Technologies (comma-separated)
   - Live demo URL (optional)
   - Source code URL (optional)
4. Click **"Save Project"**

### Managing Testimonials
1. Go to the **Testimonials** tab
2. Click **"Add New Testimonial"**
3. Enter:
   - Client feedback
   - Client name
   - Client role
   - Company name
4. Click **"Save Testimonial"**

### Updating About Section
1. Go to the **About** tab
2. Modify any field:
   - Personal information
   - Professional details
   - Skills (add/remove)
   - Statistics
   - Contact information
3. Click **"Save Changes"**

### Customizing Layout
1. Go to the **Layout** tab
2. **Reorder Sections**: Drag and drop sections to change their order
3. **Control Visibility**: Toggle sections on/off using checkboxes
4. Click **"Save Layout"**

### Managing Media
1. Go to the **Media** tab
2. **Upload Images**: Drag and drop or click to upload
3. **Organize**: View all uploaded media
4. **Delete**: Remove unused media files

## Customization

### Changing the Theme Colors
Edit `admin.css` to modify the color scheme:
- Primary: `#ffd700` (Yellow)
- Background: `#1a1a1a` (Black)
- Secondary: `#2a2a2a` (Dark Gray)

### Adding New Features
The admin panel is built with a modular JavaScript architecture. You can easily extend it by:
- Adding new tabs in the navigation
- Creating new form handlers
- Implementing additional data management functions

## Security Notes

⚠️ **Important**: This is a prototype admin panel using client-side storage. For production use:

1. **Implement proper backend authentication**
2. **Use secure API endpoints**
3. **Add input validation and sanitization**
4. **Implement CSRF protection**
5. **Use HTTPS for all communications**
6. **Add rate limiting and brute force protection**

## Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## Dependencies

- **Font Awesome 6.0.0**: Icons
- **Inter Font**: Typography
- **SortableJS**: Drag and drop functionality (included in admin.js)

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify all files are in the correct directory structure
3. Ensure JavaScript is enabled in your browser
4. Clear browser cache if experiencing display issues

## Future Enhancements

- [ ] User management (multiple admin accounts)
- [ ] Backup and restore functionality
- [ ] Analytics dashboard
- [ ] SEO management tools
- [ ] Social media integration
- [ ] Email notifications
- [ ] Advanced media editing
- [ ] Portfolio templates
- [ ] Export/import functionality

---

**Happy Portfolio Management! 🎉**
