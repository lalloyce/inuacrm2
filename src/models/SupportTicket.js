// src/models/SupportTicket.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Customer = require('./Customer');
const User = require('./User');

const SupportTicket = sequelize.define('SupportTicket', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    customer_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Customer,
            key: 'id',
        },
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    status: {
        type: DataTypes.ENUM('open', 'in_progress', 'resolved', 'closed'),
        allowNull: false,
    },
    assigned_to: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },
}, {
    timestamps: true,
    createdAt: 'created_at',
});

Customer.hasMany(SupportTicket, { foreignKey: 'customer_id' });
SupportTicket.belongsTo(Customer, { foreignKey: 'customer_id' });

User.hasMany(SupportTicket, { foreignKey: 'assigned_to' });
SupportTicket.belongsTo(User, { foreignKey: 'assigned_to' });

module.exports = SupportTicket;
