/**
 * This is the Payment model.
 * It is used to define the structure of the 'payments' table in the database.
 */
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Payment extends Model {}

/**
 * Initialize the Payment model with the following fields:
 * - id: an auto-incrementing integer, the primary key of the table
 * - amount: a decimal number, not null
 * - payment_date: a date, not null
 * - customer_id: a foreign key that references the 'id' field of the 'Customers' table
 */
Payment.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    payment_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    customer_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Customers',
            key: 'id',
        },
    },
}, {
    sequelize,
    modelName: 'Payment',
    tableName: 'payments',
    timestamps: true,
});

module.exports = Payment;