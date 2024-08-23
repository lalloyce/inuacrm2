// src/models/Payment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const SalesContract = require('./SalesContract');

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    contract_id: {
        type: DataTypes.INTEGER,
        references: {
            model: SalesContract,
            key: 'id',
        },
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    payment_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    timestamps: true,
    createdAt: 'created_at',
});

SalesContract.hasMany(Payment, { foreignKey: 'contract_id' });
Payment.belongsTo(SalesContract, { foreignKey: 'contract_id' });

module.exports = Payment;
