const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const SupportTicket = sequelize.define('SupportTicket', {
        subject: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: DataTypes.TEXT,
        status: {
            type: DataTypes.ENUM('open', 'in_progress', 'resolved', 'closed'),
            allowNull: false,
        },
    });

    SupportTicket.associate = (models) => {
        SupportTicket.belongsTo(models.Customer);
        SupportTicket.belongsTo(models.User, { as: 'assignedUser', foreignKey: 'assignedTo' });
    };

    return SupportTicket;
};