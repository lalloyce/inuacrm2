/**
 * Importing Sequelize and setting up the database connection.
 * 
 * This section imports the necessary Sequelize modules and initializes the database connection.
 * The path to the database connection file may need to be adjusted based on the project structure.
 */
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path as necessary

// Logging the sequelize instance to ensure it's not undefined
console.log(sequelize); // Should not be undefined

/**
 * Defining the User model.
 * 
 * This section defines the User model using Sequelize. The model includes attributes based on the schema.sql file.
 * 
 * @param {string} email - The user's email, unique and not null.
 * @param {string} password - The user's password, not null.
 * @param {string} full_name - The user's full name, not null.
 * @param {string} role - The user's role, not null.
 * @param {boolean} is_verified - The user's verification status, default false.
 * @param {string} verification_token - The user's verification token, optional.
 * @param {string} avatar - The user's avatar, optional.
 * @param {datetime} last_login - The user's last login date and time, optional.
 * @param {integer} login_count - The user's login count, default 0.
 * @param {datetime} createdAt - The user's creation date and time, default CURRENT_TIMESTAMP.
 * @param {datetime} updatedAt - The user's last update date and time, default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP.
 */
class User extends Model {}

User.init(
    {
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
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            onUpdate: DataTypes.NOW,
        },
    },
    {
        sequelize, // Pass the Sequelize instance
        modelName: 'User',
        tableName: 'users', 
    }
);

// Exporting the User model
module.exports = User;