
const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Vaagi', 
    database: 'neyveli_eboard'
};


let db;

async function initializeDatabase() {
    try {
        db = await mysql.createConnection(dbConfig);
        console.log('Connected to MySQL database');
        
       
        await db.execute(`CREATE DATABASE IF NOT EXISTS neyveli_eboard`);
        await db.execute(`USE neyveli_eboard`);
        
        
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS notices (
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
            )
        `;
        
        await db.execute(createTableQuery);
        
        const [rows] = await db.execute('SELECT COUNT(*) as count FROM notices');
        if (rows[0].count === 0) {
            await insertSampleData();
        }
        
    } catch (error) {
        console.error('Database initialization error:', error);
    }
}

async function insertSampleData() {
    const sampleNotices = [
        {
            title: 'Tender Notice - Road Maintenance Project',
            title_ta: 'டெண்டர் அறிவிப்பு - சாலை பராமரிப்பு திட்டம்',
            content: 'Sealed tenders are invited for the road maintenance project in Blocks 1-5. Interested contractors should submit their bids before the deadline.',
            content_ta: 'பிளாக் 1-5 இல் சாலை பராமரிப்பு திட்டத்திற்கு சீல் செய்யப்பட்ட டெண்டர்கள் அழைக்கப்படுகின்றன.',
            category: 'tender',
            priority: true,
            date_posted: '2025-06-14',
            expiry_date: '2025-06-25'
        },
        {
            title: 'Water Supply Maintenance Notice',
            title_ta: 'நீர் வழங்கல் பராமரிப்பு அறிவிப்பு',
            content: 'Water supply will be temporarily suspended in Blocks 6-10 on August 16, 2025, from 9:00 AM to 5:00 PM for routine maintenance work.',
            content_ta: 'வழக்கமான பராமரிப்பு வேலைகளுக்காக ஆகஸ்ட் 16, 2025 அன்று காலை 9:00 முதல் மாலை 5:00 வரை பிளாக் 6-10 இல் நீர் வழங்கல் நிறுத்தப்படும்.',
            category: 'general',
            priority: true,
            date_posted: '2025-08-13',
            expiry_date: '2025-08-17'
        },
        {
            title: 'Community Health Camp - August 2025',
            title_ta: 'சமூக சுகாதார முகாம் - ஆகஸ்ட் 2025',
            content: 'A free health camp will be organized at the Community Center from August 20-22, 2025. All residents are welcome to participate.',
            content_ta: 'ஆகஸ்ட் 20-22, 2025 வரை சமூக மையத்தில் இலவச சுகாதார முகாம் ஏற்பாடு செய்யப்படும்.',
            category: 'event',
            priority: false,
            date_posted: '2025-08-12',
            expiry_date: '2025-08-23'
        },
        {
            title: 'Electricity Bill Payment Circular',
            title_ta: 'மின்சாரம் கட்டணம் செலுத்துதல் சுற்றறிக்கை',
            content: 'All residents are reminded to pay their electricity bills before the due date to avoid disconnection.',
            content_ta: 'துண்டிக்கப்படுவதைத் தவிர்க்க அனைத்து குடியிருப்பாளர்களும் குறிப்பிட்ட தேதிக்கு முன் மின்சாரக் கட்டணத்தைச் செலுத்த நினைவூட்டப்படுகிறார்கள்.',
            category: 'circular',
            priority: false,
            date_posted: '2025-08-10',
            expiry_date: '2025-09-10'
        }
    ];
    
    for (const notice of sampleNotices) {
        await db.execute(
            'INSERT INTO notices (title, title_ta, content, content_ta, category, priority, date_posted, expiry_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [notice.title, notice.title_ta, notice.content, notice.content_ta, notice.category, notice.priority, notice.date_posted, notice.expiry_date]
        );
    }
    
    console.log('Sample data inserted successfully');
}

async function autoArchiveNotices() {
    try {
        const today = new Date().toISOString().split('T')[0];
        await db.execute(
            'UPDATE notices SET is_archived = TRUE WHERE expiry_date < ? AND is_archived = FALSE',
            [today]
        );
        console.log('Auto-archive completed');
    } catch (error) {
        console.error('Auto-archive error:', error);
    }
}


app.get('/api/notices', async (req, res) => {
    try {
        const { category, priority, search, archived } = req.query;
        let query = 'SELECT * FROM notices WHERE is_archived = ?';
        let params = [archived === 'true'];
        
        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }
        
        if (priority) {
            query += ' AND priority = ?';
            params.push(priority === 'true');
        }
        
        if (search) {
            query += ' AND (title LIKE ? OR content LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }
        
        query += ' ORDER BY priority DESC, date_posted DESC';
        
        const [rows] = await db.execute(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching notices:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/notices/:id', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM notices WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Notice not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching notice:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/notices', upload.single('file'), async (req, res) => {
    try {
        const { title, title_ta, content, content_ta, category, priority, expiry_date } = req.body;
        const date_posted = new Date().toISOString().split('T')[0];
        const file_path = req.file ? req.file.path : null;
        
        const [result] = await db.execute(
            'INSERT INTO notices (title, title_ta, content, content_ta, category, priority, date_posted, expiry_date, file_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [title, title_ta || null, content, content_ta || null, category, priority === 'true', date_posted, expiry_date, file_path]
        );
        
        res.json({ id: result.insertId, message: 'Notice created successfully' });
    } catch (error) {
        console.error('Error creating notice:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/notices/:id', upload.single('file'), async (req, res) => {
    try {
        const { title, title_ta, content, content_ta, category, priority, expiry_date } = req.body;
        const file_path = req.file ? req.file.path : null;
        
        let query = 'UPDATE notices SET title = ?, title_ta = ?, content = ?, content_ta = ?, category = ?, priority = ?, expiry_date = ?';
        let params = [title, title_ta || null, content, content_ta || null, category, priority === 'true', expiry_date];
        
        if (file_path) {
            query += ', file_path = ?';
            params.push(file_path);
        }
        
        query += ' WHERE id = ?';
        params.push(req.params.id);
        
        await db.execute(query, params);
        res.json({ message: 'Notice updated successfully' });
    } catch (error) {
        console.error('Error updating notice:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/notices/:id', async (req, res) => {
    try {
        await db.execute('DELETE FROM notices WHERE id = ?', [req.params.id]);
        res.json({ message: 'Notice deleted successfully' });
    } catch (error) {
        console.error('Error deleting notice:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/stats', async (req, res) => {
    try {
        const [totalActive] = await db.execute('SELECT COUNT(*) as count FROM notices WHERE is_archived = FALSE');
        const [totalUrgent] = await db.execute('SELECT COUNT(*) as count FROM notices WHERE is_archived = FALSE AND priority = TRUE');
        const [totalToday] = await db.execute('SELECT COUNT(*) as count FROM notices WHERE is_archived = FALSE AND date_posted = CURDATE()');
        const [totalArchived] = await db.execute('SELECT COUNT(*) as count FROM notices WHERE is_archived = TRUE');
        
        res.json({
            totalActive: totalActive[0].count,
            totalUrgent: totalUrgent[0].count,
            totalToday: totalToday[0].count,
            totalArchived: totalArchived[0].count
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/notices/:id/archive', async (req, res) => {
    try {
        await db.execute('UPDATE notices SET is_archived = TRUE WHERE id = ?', [req.params.id]);
        res.json({ message: 'Notice archived successfully' });
    } catch (error) {
        console.error('Error archiving notice:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

setInterval(autoArchiveNotices, 24 * 60 * 60 * 1000);

async function startServer() {
    await initializeDatabase();
    app.listen(PORT, () => {
        console.log(`E-Notice Board server running on port ${PORT}`);
        console.log(`Public interface: http://localhost:${PORT}`);
        console.log(`Admin interface: http://localhost:${PORT}/admin`);
    });
}

startServer();

process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    if (db) {
        await db.end();
    }
    process.exit(0);
});

module.exports = app;