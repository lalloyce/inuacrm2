const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models'); // Import User model from Sequelize
const router = express.Router();

// Get the index page
router.get('/', (req, res, next) => {
    let user = req.session.user;
    if (user) {
        res.redirect('/home');
        return;
    }
    res.render('index', { title: "My Application" });
});

// Get home page
router.get('/home', (req, res, next) => {
    let user = req.session.user;

    if (user) {
        res.render('home', { opp: req.session.opp, name: user.fullname });
        return;
    }
    res.redirect('/');
});

// Post login data
router.post('/login', async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { username: req.body.username } });
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            req.session.user = user;
            req.session.opp = 1;
            res.redirect('/home');
        } else {
            res.send('Username/Password incorrect!');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal server error');
    }
});

// Post register data
router.post('/register', async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await User.create({
            username: req.body.username,
            fullname: req.body.fullname,
            password: hashedPassword
        });

        if (newUser) {
            req.session.user = newUser;
            req.session.opp = 0;
            res.redirect('/home');
        } else {
            res.status(400).send('Error creating a new user');
        }
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Internal server error');
    }
});

// Get logout page
router.get('/logout', (req, res, next) => {
    if (req.session.user) {
        req.session.destroy(() => {
            res.redirect('/');
        });
    }
});

// Registration Confirmation
router.get('/confirm', async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({ where: { confirmationToken: token } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired token.' });
        }

        // Confirm the user's account
        user.isConfirmed = true;
        user.confirmationToken = null;
        await user.save();

        // Redirect to dashboard
        res.redirect('/dashboard.html');

    } catch (error) {
        console.error('Error during account confirmation:', error);
        res.status(500).json({ error: 'An error occurred during account confirmation.' });
    }
});


module.exports = router;
