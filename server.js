// Import required modules
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { Sequelize } = require('sequelize');
const moment = require('moment-timezone');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// Import middleware
const { authMiddleware } = require('./middleware/authMiddleware');
const auditMiddleware = require('./middleware/audit');
const errorHandler = require('./middleware/errorHandler');

// Initialize Express app
const app = express();

// Import Sequelize instance and models
const sequelize = require('./config/database');
const User = require('./models/User');
const Notification = require('./models/Notification');
const Customer = require('./models/Customer');
const Group = require('./models/Group');
const AuditLog = require('./models/AuditLog');
const Payment = require('./models/Payment');
const Ticket = require('./models/Ticket');
const Deal = require('./models/Deal');

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Configure session store using MySQL
const sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Configure session middleware
app.use(session({
    key: 'session_cookie_name',
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// Initialize nodemailer transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

// Function to send email using nodemailer
const sendEmail = async (to, subject, text) => {
    try {
        let info = await transporter.sendMail({
            from: `"Inua CRM" <${process.env.SMTP_USER}>`,
            to: to,
            subject: subject,
            text: text,
        });
        console.log('Email sent:', info);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Apply CORS middleware
app.use(cors());

// Apply authentication middleware to all routes
app.use(authMiddleware);

// Apply audit middleware to all routes
app.use(auditMiddleware);

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
        const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        user.reset_token = resetToken;
        user.reset_token_expires = moment().add(1, 'hour').tz('Africa/Nairobi').format();
        await user.save();

        // Send email with reset token
        await sendEmail(user.email, 'Password Reset', `Your password reset link is: ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`);

        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Error in forgot password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to test database connection
app.get('/api/test-db', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.json({ message: 'Database connection has been established successfully.' });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        res.status(500).json({ error: 'Unable to connect to the database', details: error.message });
    }
});

// Default route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
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
        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to fetch all groups
app.get('/api/groups', async (req, res) => {
    try {
        const groups = await Group.findAll({
            include: [{ model: User, as: 'leader', attributes: ['id', 'full_name'] }]
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
app.get('/api/user-role', (req, res) => {
    res.json({ role: req.user.role });
});

// Route to get users by role
app.get('/api/users-by-role', async (req, res) => {
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
app.get('/api/groups-count', async (req, res) => {
    try {
        const count = await Group.count();
        res.json({ count });
    } catch (error) {
        console.error('Error fetching groups count:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to get tickets by status
app.get('/api/tickets-by-status', async (req, res) => {
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
app.get('/api/deals-by-status', async (req, res) => {
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
app.get('/api/audit-logs', async (req, res) => {
    try {
        const auditLogs = await AuditLog.findAll();
        res.json(auditLogs);
    } catch (error) {
        console.error('Error fetching audit logs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to get all customers
app.get('/api/customers', async (req, res) => {
    try {
        const customers = await Customer.findAll();
        res.json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to create a new customer
app.post('/api/customers', async (req, res) => {
    try {
        const {
            first_name,
            middle_name,
            last_name,
            national_id_number,
            mpesa_mobile_number,
            alternative_mobile_number,
            gender,
            date_of_birth,
            village,
            sub_location,
            ward,
            sub_county,
            county
        } = req.body;

        const customer = await Customer.create({
            first_name,
            middle_name,
            last_name,
            national_id_number,
            mpesa_mobile_number,
            alternative_mobile_number,
            gender,
            date_of_birth,
            village,
            sub_location,
            ward,
            sub_county,
            county,
            created_by: req.user.id
        });

        res.status(201).json(customer);
    } catch (error) {
        console.error('Error creating customer:', error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: error.errors.map(e => e.message).join(', ') });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to create a new group
app.post('/api/groups', async (req, res) => {
    try {
        const { name, leaderId } = req.body;
        const group = await Group.create({
            name,
            leaderId,
            created_by: req.user.id
        });

        // Send notification
        const salesManager = await User.findOne({ where: { role: 'sales_manager' } });
        if (salesManager) {
            await Notification.create({
                message: `New group: "${name}" created and needs approval.`,
                userId: salesManager.id,
            });
        } else {
            console.log('No sales manager found to send notification');
        }

        // Send email
        const leader = await User.findByPk(leaderId);
        await sendEmail(
            leader.email,
            'New Group Created',
            `A new group "${name}" has been created and needs your approval.`
        );

        res.status(201).json(group);
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to search counties
app.get('/api/counties', async (req, res) => {
    const { search } = req.query;
    const allCounties = [
        'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo Marakwet', 'Embu', 'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado',
        'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kakamega', 'Kericho', 'Kiambu',
        'Kilifi', 'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia',
        'Lamu', 'Machakos', 'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi',
        'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu', 'Siaya', 'Taita Taveta', 'Tana River',
        'Tharaka Nithi', 'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
    ];
    const filteredCounties = allCounties.filter(county =>
        county.toLowerCase().startsWith(search.toLowerCase())
    );
    res.json(filteredCounties);
});

// Route to process a repayment
app.post('/api/repayments', async (req, res) => {
    const { customerId, amount, transactionNumber } = req.body;

    try {
        // Start a database transaction
        const result = await sequelize.transaction(async (t) => {
            // 1. Fetch customer details
            const customer = await Customer.findByPk(customerId, { transaction: t });
            if (!customer) {
                throw new Error('Customer not found');
            }

            // 2. Calculate new outstanding balance
            const newOutstandingBalance = parseFloat(customer.outstandingLoan) - parseFloat(amount);
            if (newOutstandingBalance < 0) {
                throw new Error('Repayment amount exceeds outstanding loan');
            }

            // 3. Update customer's outstanding balance using atomic update
            const [updatedRows] = await Customer.update(
                { outstandingLoan: sequelize.literal(`outstandingLoan - ${amount}`) },
                { where: { id: customerId, outstandingLoan: { [Sequelize.Op.gte]: amount } }, transaction: t }
            );

            if (updatedRows === 0) {
                throw new Error('Failed to update customer balance');
            }

            // 4. Create a new repayment record
            const payment = await Payment.create({
                customerId,
                amount,
                transactionNumber,
                createdBy: req.user.id
            }, { transaction: t });

            // Fetch the updated customer data
            const updatedCustomer = await Customer.findByPk(customerId, { transaction: t });

            return { customer: updatedCustomer, payment };
        });

        // 5. Generate receipt data
        const receiptData = {
            customerName: `${result.customer.firstName} ${result.customer.lastName}`,
            repaymentAmount: amount,
            transactionNumber: transactionNumber,
            newOutstandingBalance: result.customer.outstandingLoan,
            date: new Date().toISOString()
        };

        res.status(201).json({
            success: true,
            message: 'Repayment processed successfully',
            receipt: receiptData
        });
    } catch (error) {
        console.error('Error processing repayment:', error);
        res.status(500).json({ success: false, error: 'An error occurred while processing the repayment' });
    }
});

// Route to create a new ticket
app.post('/api/tickets', async (req, res) => {
  try {
    const { title, description, priority, customerId } = req.body;
    const ticket = await Ticket.create({
      title,
      description,
      priority,
      createdBy: req.user.id,
      customerId
    });
    res.status(201).json(ticket);
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(400).json({ error: 'Failed to create ticket' });
  }
});

// Get all tickets
app.get('/api/tickets', async (req, res) => {
  try {
    const tickets = await Ticket.findAll();
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// Get a specific ticket
app.get('/api/tickets/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (ticket) {
      res.json(ticket);
    } else {
      res.status(404).json({ error: 'Ticket not found' });
    }
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
});

// Update a ticket
app.put('/api/tickets/:id', async (req, res) => {
  try {
    const [updated] = await Ticket.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedTicket = await Ticket.findByPk(req.params.id);
      res.json(updatedTicket);
    } else {
      res.status(404).json({ error: 'Ticket not found' });
    }
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(400).json({ error: 'Failed to update ticket' });
  }
});

// Error handling middleware (should be last)
app.use(errorHandler);

// Sync all models with the database
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

// Start the server
sequelize.authenticate()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = app; // Export the app for testing purposes