const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Customer = sequelize.define('Customer', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
        },
        phone: DataTypes.STRING,
        address: DataTypes.TEXT,
    });

    Customer.associate = (models) => {
        Customer.belongsTo(models.CustomerGroup);
        Customer.hasMany(models.SalesContract);
        Customer.hasMany(models.SupportTicket);
    };

    return Customer;
};