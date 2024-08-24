const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('admin', 'group_coordinator', 'sales_manager', 'customer_service', 'management'),
            allowNull: false,
        },
    });

    User.associate = (models) => {
        User.hasMany(models.PasswordResetToken);
        User.hasMany(models.CustomerGroup, { foreignKey: 'coordinatorId' });
        User.hasMany(models.SupportTicket, { foreignKey: 'assignedTo' });
    };

    return User;
};