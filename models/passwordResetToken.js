const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const PasswordResetToken = sequelize.define('PasswordResetToken', {
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    });

    PasswordResetToken.associate = (models) => {
        PasswordResetToken.belongsTo(models.User);
    };

    return PasswordResetToken;
};