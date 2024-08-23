// src/models/PasswordResetToken.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const PasswordResetToken = sequelize.define('PasswordResetToken', {
    TokenID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    Token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ExpiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    timestamps: true,
    createdAt: 'CreatedAt',
});

User.hasMany(PasswordResetToken, { foreignKey: 'UserID' });
PasswordResetToken.belongsTo(User, { foreignKey: 'UserID' });

module.exports = PasswordResetToken;
