const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

// Define the User model
const User = sequelize.define('User', {
    // Unique identifier for the user
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    // User's email address (unique)
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    // Hashed password
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    // User's full name
    full_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    // User's role in the system
    role: {
        type: DataTypes.ENUM('customer_service', 'sales_manager', 'group_coordinator', 'other_manager', 'admin'),
        allowNull: false,
    },
    // Flag to indicate if the user's email is verified
    is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    // Token used for email verification
    verification_token: DataTypes.STRING(255),
    // Token used for password reset
    reset_token: DataTypes.STRING(255),
    // Expiration date for the password reset token
    reset_token_expires: DataTypes.DATE,
    // URL or path to the user's avatar image
    avatar: DataTypes.STRING(255),
    // Timestamp of the user's last login
    last_login: DataTypes.DATE,
    // Number of times the user has logged in
    login_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    // Enable automatic timestamp fields (createdAt, updatedAt)
    timestamps: true,
});

// Export the User model
module.exports = User;