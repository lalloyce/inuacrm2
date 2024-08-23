const express = require('express');
const apiRoutes = require('./api'); // Import the combined API routes
const sequelize = require('./config/database'); // Import the Sequelize instance

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Use the combined API routes under '/api'
app.use('/api', apiRoutes);

// Default route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Sync the models with the database
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database & tables synced!');
    })
    .catch((err) => {
        console.error('Failed to sync database:', err);
    });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
