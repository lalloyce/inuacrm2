require('dotenv').config();
const express = require('express');
const path = require('path');
const { sequelize } = require('./models');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { v2: cloudinary } = require('cloudinary');

const app = express();
const PORT = process.env.PORT || 3000;

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api', routes);

// Route to handle image transformation
app.get('/transform-image', async (req, res) => {
    try {
        const result = cloudinary.url('logo_v1_zlkibi.jpg', {
            transformation: [
                {effect: "make_transparent"},
                {width: 200, crop: "scale"}
            ]
        });
        res.json({ url: result });
    } catch (error) {
        console.error('Error transforming image:', error);
        res.status(500).json({ error: 'Error transforming image' });
    }
});

// Serve index.html for any other routes (for SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling
app.use(errorHandler);

// Start the server and sync the database
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});