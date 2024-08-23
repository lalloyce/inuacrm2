// src/models/SalesContract.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Customer = require('./Customer');

const SalesContract = sequelize.define('SalesContract', {
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
    product_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    installment_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    installment_frequency: {
        type: DataTypes.ENUM('weekly', 'bi-weekly', 'monthly'),
        allowNull: false,
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('active', 'completed', 'defaulted'),
        allowNull: false,
    },
}, {
    timestamps: true,
    createdAt: 'created_at',
});

Customer.hasMany(SalesContract, { foreignKey: 'customer_id' });
SalesContract.belongsTo(Customer, { foreignKey: 'customer_id' });

module.exports = SalesContract;
