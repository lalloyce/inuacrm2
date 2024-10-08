/**
 * Importing Sequelize and setting up the database connection.
 */
const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);
const User = require('./User');

/**
 * Defining the Ticket model.
 * 
 * @class Ticket
 * @extends Model
 */
class Ticket extends Model {}

/**
 * Initializing the Ticket model with its attributes.
 * 
 * @param {object} attributes - The attributes of the Ticket model.
 */
Ticket.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false, // Ensure customer_id is required
    },
    assigned_to: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        onDelete: 'SET NULL', // Optional: define behavior on user deletion
    },
    status: {
        type: DataTypes.ENUM('open', 'in_progress', 'closed'),
        defaultValue: 'open',
    },
    priority: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        defaultValue: 'medium',
    },
    subject: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true, // Explicitly allowing null
    },
}, {
    sequelize,
    modelName: 'Ticket',
    tableName: 'tickets', // Explicitly define table name
    timestamps: true,
});

// Exporting the Ticket model
module.exports = Ticket;
