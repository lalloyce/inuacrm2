/**
 * Importing Sequelize and setting up the database connection.
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Logging the sequelize instance to ensure it's not undefined
console.log(sequelize); // Should not be undefined

/**
 * Defining the User model.
 * 
 * @param {string} id - The unique identifier for the user, auto-incrementing and primary key.
 * @param {string} email - The user's email address, unique and not null.
 * @param {string} password - The user's password, not null.
 * @param {string} full_name - The user's full name, not null.
 * @param {string} role - The user's role, an enumeration of predefined roles, not null.
 * @param {boolean} is_verified - Indicates if the user is verified, default is false.
 * @param {string} verification_token - The token used for verification.
 * @param {string} avatar - The user's avatar URL.
 * @param {Date} last_login - The date and time of the user's last login.
 * @param {integer} login_count - The number of times the user has logged in, default is 0.
 */
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    full_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('customer_service', 'sales_manager', 'group_coordinator', 'other_manager', 'admin'),
        allowNull: false,
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    verification_token: {
        type: DataTypes.STRING,
    },
    avatar: {
        type: DataTypes.STRING,
    },
    last_login: {
        type: DataTypes.DATE,
    },
    login_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    tableName: 'users',
    timestamps: true,
});

// Exporting the User model
module.exports = User;