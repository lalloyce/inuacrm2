const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const SalesContract = sequelize.define('SalesContract', {
        productName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        totalAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        installmentAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        installmentFrequency: {
            type: DataTypes.ENUM('weekly', 'bi-weekly', 'monthly'),
            allowNull: false,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('active', 'completed', 'defaulted'),
            allowNull: false,
        },
    });

    SalesContract.associate = (models) => {
        SalesContract.belongsTo(models.Customer);
        SalesContract.hasMany(models.Payment);
    };

    return SalesContract;
};