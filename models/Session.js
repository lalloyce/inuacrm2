const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

class Session extends Model {}

Session.init({
    session_id: {
        type: DataTypes.STRING(255),
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    expires: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    data: {
        type: DataTypes.TEXT,
        collate: 'utf8mb4_bin',
    },
}, {
    sequelize,
    modelName: 'Session',
    tableName: 'sessions', // Explicitly define table name
    timestamps: true,
});

module.exports = Session;
