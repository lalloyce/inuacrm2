// Import required modules
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const FormData = require('form-data');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const errorHandler = require('./middleware/errorHandler');
const bodyParser = require('body-parser');
const { authMiddleware, roleMiddleware } = require('./middleware/auth');
const url = require('url');
const jwt = require('jsonwebtoken');
const { Sequelize } = require('sequelize');
const moment = require('moment-timezone');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse DATABASE_URL from .env
const dbUrl = new URL(process.env.DATABASE_URL);

// Configure session store using MySQL
const sessionStore = new MySQLStore({
    host: dbUrl.hostname,
    port: dbUrl.port,
    user: dbUrl.username,
    password: decodeURIComponent(dbUrl.password),
    database: dbUrl.pathname.substr(1) // Remove the leading slash
});

// Configure session middleware
app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// Import Sequelize instance and models
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    timezone: '+03:00', // East Africa Time (EAT) is UTC+3
    logging: false,
    define: {
        timestamps: true,
        underscored: true,
    },
});
const User = require('./models/User');
const Notification = require('./models/Notification');
const Customer = require('./models/Customer');
const Group = require('./models/Group');
const AuditLog = require('./models/AuditLog');

// Function to send email using nodemailer
const sendEmail = async (to, subject, text) => {
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    });

    try {
        let info = await transporter.sendMail({
            from: `"Inua CRM" <${process.env.SMTP_USER}>`, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
        });

        console.log('Email sent:', info);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Route to handle user login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (user && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ message: 'Login successful', token });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to handle user signup
app.post('/api/signup', async (req, res) => {
    try {
        const { email, password, full_name, role } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = await User.create({ email, password: hashedPassword, full_name, role });
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        console.error('Validation Error:', error);
        res.status(400).json({ error: error.message });
    }
});

// Route to handle forgot password
app.post('/api/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.reset_token = resetToken;
        user.reset_token_expires = moment().add(1, 'hour').tz('Africa/Nairobi').format(); // 1 hour
        await user.save();

        // Send email with reset token
        await sendEmail(user.email, 'Password Reset', `Your password reset token is: ${resetToken}`);

        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to test database connection
app.get('/api/test-db', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.json({ message: 'Database connection has been established successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Unable to connect to the database:', details: error.message });
    }
});

// Default route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Protected route example
app.get('/api/protected-route', authMiddleware, (req, res) => {
    res.json({ message: 'This is a protected route' });
});

// Error handling middleware
console.log('Error handler type:', typeof errorHandler);
app.use(errorHandler);

// Start the server
sequelize.authenticate().then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});

// Route to fetch notifications
app.get('/api/notifications', async (req, res) => {
    try {
        const notifications = await Notification.findAll();
        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to verify JWT token
app.get('/api/verify-token', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ valid: false, error: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ valid: false, error: 'Failed to authenticate token' });
        }
        res.json({ valid: true });
    });
});

// Route to fetch all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to fetch all groups
app.get('/api/groups', authMiddleware, async (req, res) => {
    try {
        const groups = await Group.findAll({
            include: [{ model: User, as: 'leader' }]
        });
        res.json(groups.map(group => ({
            id: group.id,
            name: group.name,
            leader_name: group.leader.full_name
        })));
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to get user role
app.get('/api/user-role', authMiddleware, (req, res) => {
    res.json({ role: req.user.role });
});

// Route to get users by role
app.get('/api/users-by-role', authMiddleware, async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['role', [sequelize.fn('COUNT', sequelize.col('role')), 'count']],
            group: ['role']
        });
        res.json({
            roles: users.map(user => user.role),
            counts: users.map(user => user.get('count'))
        });
    } catch (error) {
        console.error('Error fetching users by role:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to get groups count
app.get('/api/groups-count', authMiddleware, async (req, res) => {
    try {
        const count = await Group.count();
        res.json({ count });
    } catch (error) {
        console.error('Error fetching groups count:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to get tickets by status
app.get('/api/tickets-by-status', authMiddleware, async (req, res) => {
    try {
        const tickets = await Ticket.findAll({
            attributes: ['status', [sequelize.fn('COUNT', sequelize.col('status')), 'count']],
            group: ['status']
        });
        res.json({
            statuses: tickets.map(ticket => ticket.status),
            counts: tickets.map(ticket => ticket.get('count'))
        });
    } catch (error) {
        console.error('Error fetching tickets by status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to get deals by status
app.get('/api/deals-by-status', authMiddleware, async (req, res) => {
    try {
        const deals = await Deal.findAll({
            attributes: ['status', [sequelize.fn('COUNT', sequelize.col('status')), 'count']],
            group: ['status']
        });
        res.json({
            statuses: deals.map(deal => deal.status),
            counts: deals.map(deal => deal.get('count'))
        });
    } catch (error) {
        console.error('Error fetching deals by status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to fetch audit logs
app.get('/api/audit-logs', authMiddleware, async (req, res) => {
    try {
        const auditLogs = await AuditLog.findAll();
        res.json(auditLogs);
    } catch (error) {
        console.error('Error fetching audit logs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Apply the audit middleware to all routes
const auditMiddleware = require('./middleware/audit');
app.use(auditMiddleware);

// Route to get all customers
app.get('/api/customers', authMiddleware, async (req, res) => {
    try {
        const customers = await Customer.findAll();
        res.json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to create a new customer
app.post('/api/customers', authMiddleware, async (req, res) => {
    try {
        const { full_name, email, phone } = req.body;
        const customer = await Customer.create({ full_name, email, phone });
        res.status(201).json(customer);
    } catch (error) {
        console.error('Error creating customer:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to create a new group
app.post('/api/groups', authMiddleware, async (req, res) => {
    try {
        const { name, leaderId } = req.body;
        const group = await Group.create({ name, leaderId });

        // Send notification
        await Notification.create({
            message: `New group "${name}" created and needs approval.`,
            userId: leaderId, // Assuming leaderId is the group coordinator's boss
        });

        // Send email
        const leader = await User.findByPk(leaderId);
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: leader.email,
            subject: 'New Group Created',
            text: `A new group "${name}" has been created and needs your approval.`,
        };
        await transporter.sendMail(mailOptions);

        res.status(201).json(group);
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Example of using roleMiddleware
app.get('/api/admin-route', authMiddleware, roleMiddleware(['admin']), (req, res) => {
    res.json({ message: 'This is an admin route' });
});