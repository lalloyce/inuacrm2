const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);
const User = require('./User');

class AuditLog extends Model {}

AuditLog.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },
    action: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    endpoint: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    method: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    statusCode: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    message: DataTypes.STRING(255),
}, {
    sequelize,
    modelName: 'AuditLog',
    timestamps: true,
});

module.exports = AuditLog;