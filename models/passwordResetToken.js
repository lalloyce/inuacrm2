const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);
const User = require('./User');

class PasswordResetToken extends Model {}

PasswordResetToken.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
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
    token: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    expires_at: {
        type: DataTypes.TIMESTAMP,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'PasswordResetToken',
    timestamps: true,
});

module.exports = PasswordResetToken;