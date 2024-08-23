// src/models/Customer.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const CustomerGroup = require('./CustomerGroup');

const Customer = sequelize.define('Customer', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
    },
    phone: {
        type: DataTypes.STRING,
    },
    address: {
        type: DataTypes.TEXT,
    },
    group_id: {
        type: DataTypes.INTEGER,
        references: {
            model: CustomerGroup,
            key: 'id',
        },
    },
}, {
    timestamps: true,
    createdAt: 'created_at',
});

CustomerGroup.hasMany(Customer, { foreignKey: 'group_id' });
Customer.belongsTo(CustomerGroup, { foreignKey: 'group_id' });

module.exports = Customer;
