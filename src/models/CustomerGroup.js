// src/models/CustomerGroup.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const CustomerGroup = sequelize.define('CustomerGroup', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    coordinator_id: {
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

User.hasMany(CustomerGroup, { foreignKey: 'coordinator_id' });
CustomerGroup.belongsTo(User, { foreignKey: 'coordinator_id' });

module.exports = CustomerGroup;
