# E-Notice Board - Neyveli Township Administration Office

A comprehensive digital notice board system built with Node.js, MySQL, and modern web technologies to provide centralized, user-friendly, and accessible platform for Neyveli Township residents.

## 🚀 Features

- *Priority & Highlighting System* - Urgent notices pinned on top with red badges
- *Multi-Language Support* - English & Tamil interface
- *Expiry & Auto-Archive* - Automatic shifting of old notices to archive
- *Category Icons* - Visual symbols for Tender, Circular, Event, etc.
- *Downloadable & Printable Notices* - PDF download and print option
- *Search + Filter Combo* - Keyword search + category/date filter
- *Admin Panel* - Complete notice management system
- *Real-time Updates* - Auto-refresh every 5 minutes
- *File Upload Support* - Attach PDFs, documents, and images
- *Responsive Design* - Works on desktop, tablet, and mobile

## 🛠 Technology Stack

- *Backend*: Node.js with Express.js
- *Database*: MySQL
- *Frontend*: HTML5, CSS3, Bootstrap 5, JavaScript
- *File Upload*: Multer
- *Additional*: Font Awesome for icons

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14.0.0 or higher)
- MySQL (v5.7 or higher)
- npm (comes with Node.js)

## 🔧 Installation & Setup

### 1. Clone or Download the Project

Create a new directory for your project and save all the files:

bash
mkdir neyveli-eboard
cd neyveli-eboard


### 2. Create Project Structure


neyveli-eboard/
├── server.js
├── package.json
├── public/
│   ├── index.html
│   └── admin.html
├── uploads/
└── README.md


### 3. Install Dependencies

bash
npm install


Or manually install each dependency:

bash
npm install express mysql2 body-parser cors multer
npm install --save-dev nodemon


### 4. Create Required Directories

bash
mkdir -p uploads public


### 5. Setup MySQL Database

1. *Start MySQL service* on your system
2. *Create a database user* (or use existing):

sql
CREATE USER 'eboard_user'@'localhost' IDENTIFIED BY 'your_password_here';
GRANT ALL PRIVILEGES ON *.* TO 'eboard_user'@'localhost';
FLUSH PRIVILEGES;


3. *Update database configuration* in server.js:

javascript
const dbConfig = {
    host: 'localhost',
    user: 'eboard_user',        // Change this
    password: 'your_password',   // Change this
    database: 'neyveli_eboard'
};


### 6. Place HTML Files

Move the HTML files to the public directory:
- index.html → public/index.html
- admin.html → public/admin.html

### 7. Start the Application

For development (with auto-restart):
bash
npm run dev


For production:
bash
npm start


## 🌐 Access the Application

Once the server is running:

- *Public Interface*: http://localhost:3000
- *Admin Panel*: http://localhost:3000/admin
- *API Endpoints: http://localhost:3000/api/

## 📱 Usage Guide

### For Public Users

1. *View Notices*: Visit the main page to see all active notices
2. *Search & Filter*: Use the search bar and filters to find specific notices
3. *Language Toggle*: Click the language button to switch between English and Tamil
4. *Download Files*: Click the download button on notices with attached files
5. *Print Notices*: Use the print button to print individual notices
6. *View Archive*: Click "View Archive" to see older notices

### For Administrators

1. *Access Admin Panel*: Go to /admin URL
2. *Dashboard*: View statistics and recent activities
3. *Add Notice*: Use the "Add Notice" tab to create new notices
4. *Manage Notices*: Edit, archive, or delete existing notices
5. *File Management*: Upload and manage attached files
6. *Auto-Archive*: Expired notices are automatically archived

## 🔧 API Endpoints

### Public Endpoints
- GET /api/notices - Get all active notices
- GET /api/notices?archived=true - Get archived notices
- GET /api/notices/:id - Get specific notice
- GET /api/stats - Get notice statistics

### Admin Endpoints
- POST /api/notices - Create new notice
- PUT /api/notices/:id - Update notice
- DELETE /api/notices/:id - Delete notice
- PUT /api/notices/:id/archive - Archive notice

## 📊 Database Schema

### Notices Table
sql
CREATE TABLE notices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    title_ta TEXT,
    content TEXT NOT NULL,
    content_ta TEXT,
    category VARCHAR(50) NOT NULL,
    priority BOOLEAN DEFAULT FALSE,
    date_posted DATE NOT NULL,
    expiry_date DATE NOT NULL,
    link VARCHAR(255),
    file_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_archived BOOLEAN DEFAULT FALSE
);


## 🔒 Security Considerations

For production deployment, consider implementing:

1. *Authentication*: Add login system for admin panel
2. *Authorization*: Role-based access control
3. *Input Validation*: Server-side validation for all inputs
4. *File Upload Security*: Restrict file types and sizes
5. *SQL Injection Protection*: Use parameterized queries (already implemented)
6. *HTTPS*: Enable SSL/TLS encryption
7. *Rate Limiting*: Prevent API abuse

## 🚀 Deployment

### Production Environment Variables

Create a .env file:

NODE_ENV=production
PORT=3000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=neyveli_eboard


### Process Manager (PM2)

bash
npm install -g pm2
pm2 start server.js --name "neyveli-eboard"
pm2 startup
pm2 save


## 🔄 Maintenance

### Regular Tasks

1. *Database Backup*: Regular MySQL backups
2. *File Cleanup*: Clean old uploaded files
3. *Log Monitoring*: Monitor application logs
4. *Updates*: Keep dependencies updated

### Auto-Archive Feature

The system automatically archives expired notices daily. You can also manually archive notices through the admin panel.

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Error

Error: connect ECONNREFUSED 127.0.0.1:3306

*Solution:*
- Ensure MySQL service is running
- Check database credentials in server.js
- Verify MySQL is listening on port 3306

#### 2. File Upload Issues

Error: ENOENT: no such file or directory, open 'uploads/...'

*Solution:*
- Ensure uploads directory exists
- Check file permissions
- Verify multer configuration

#### 3. Port Already in Use

Error: listen EADDRINUSE :::3000

*Solution:*
- Change port in server.js or kill existing process
- Find process: lsof -i :3000
- Kill process: kill -9 <PID>

#### 4. Database Schema Issues
*Solution:*
- Drop and recreate database
- Check MySQL version compatibility
- Verify SQL syntax

### Log Files

Check application logs for detailed error information:
bash
# If using PM2
pm2 logs neyveli-eboard

# If running directly
node server.js


## 📈 Performance Optimization

### Database Optimization

1. *Add Indexes*:
sql
CREATE INDEX idx_notices_category ON notices(category);
CREATE INDEX idx_notices_priority ON notices(priority);
CREATE INDEX idx_notices_date_posted ON notices(date_posted);
CREATE INDEX idx_notices_expiry_date ON notices(expiry_date);
CREATE INDEX idx_notices_archived ON notices(is_archived);


2. *Database Connection Pooling*:
javascript
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'your_user',
    password: 'your_password',
    database: 'neyveli_eboard'
});


### Frontend Optimization

1. *Enable Gzip Compression*:
javascript
const compression = require('compression');
app.use(compression());


2. *Static File Caching*:
javascript
app.use(express.static('public', {
    maxAge: '1d',
    etag: true
}));


## 🔧 Customization

### Adding New Categories

1. *Update Database*: Add new category values
2. *Update Frontend*: Add options in category dropdowns
3. *Update CSS*: Add category-specific styling

### Adding New Languages

1. *Update Translations*: Add new language object in translations
2. *Database Schema*: Add new language columns (e.g., title_hi, content_hi)
3. *Frontend Logic*: Extend language toggle functionality

### Custom Styling

Modify CSS variables in the HTML files:
css
:root {
    --primary-color: #your-color;
    --secondary-color: #your-color;
    --accent-color: #your-color;
}


## 📊 Monitoring & Analytics

### Basic Monitoring

Add basic logging to track usage:
javascript
// Add to server.js
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});


### Database Health Check

javascript
// Add health check endpoint
app.get('/health', async (req, res) => {
    try {
        await db.execute('SELECT 1');
        res.json({ status: 'healthy', timestamp: new Date().toISOString() });
    } catch (error) {
        res.status(500).json({ status: 'unhealthy', error: error.message });
    }
});


## 🔐 Security Hardening

### 1. Input Sanitization

bash
npm install express-validator helmet


javascript
const { body, validationResult } = require('express-validator');
const helmet = require('helmet');

app.use(helmet());

// Validate notice creation
app.post('/api/notices', [
    body('title').isLength({ min: 5, max: 255 }).trim().escape(),
    body('content').isLength({ min: 10 }).trim(),
    body('category').isIn(['tender', 'circular', 'event', 'general']),
    // ... other validations
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // ... rest of the code
});


### 2. Rate Limiting

bash
npm install express-rate-limit


javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);


### 3. File Upload Security

javascript
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});


## 📚 Additional Resources

### Official Documentation
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Bootstrap Documentation](https://getbootstrap.com/docs/5.3/getting-started/introduction/)

### Useful Tools
- [Postman](https://www.postman.com/) - API testing
- [MySQL Workbench](https://www.mysql.com/products/workbench/) - Database management
- [PM2](https://pm2.keymetrics.io/) - Process management
- [Nginx](https://nginx.org/) - Reverse proxy for production

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch: git checkout -b feature-name
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style

- Use consistent indentation (2 spaces)
- Follow JavaScript ES6+ standards
- Add comments for complex logic
- Use meaningful variable names

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For technical support or questions:

- *Email*: it-department@neyveli-township.gov.in
- *Phone*: +91-XXX-XXX-XXXX
- *Office Hours*: Monday to Friday, 9:00 AM to 5:00 PM

## 🔄 Version History

### v1.0.0 (Current)
- Initial release
- Basic notice management
- Multi-language support
- File upload functionality
- Auto-archive feature
- Responsive design

### Planned Features (v1.1.0)
- Email notifications
- SMS alerts for urgent notices
- Advanced search with date ranges
- Notice subscription by category
- Mobile app
- Digital signatures for notices

---

## 📞 Emergency Contacts

In case of system downtime or critical issues:

- *System Administrator*: +91-XXX-XXX-XXXX
- *Database Administrator*: +91-XXX-XXX-XXXX
- *IT Help Desk*: +91-XXX-XXX-XXXX

---

*Developed for Neyveli Township Administration Office*  
Enhancing digital governance and citizen services
