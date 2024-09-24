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
        onDelete: 'CASCADE', // Optional: define behavior on user deletion
    },
    token: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    expires_at: {
        type: DataTypes.DATE, // Changed to DATE for better compatibility
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'PasswordResetToken',
    tableName: 'password_reset_tokens', // Explicitly define table name
    timestamps: true,
    underscored: true, // Use underscored naming convention
});

module.exports = PasswordResetToken;