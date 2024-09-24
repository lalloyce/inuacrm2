const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Payment extends Model {}

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