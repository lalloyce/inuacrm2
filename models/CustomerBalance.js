const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class CustomerBalance extends Model {}

CustomerBalance.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    customer_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Customers',
            key: 'id',
        },
        allowNull: false,
    },
    balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    last_updated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'CustomerBalance',
    tableName: 'customer_balances',
    timestamps: true,
});

// Define associations if necessary
CustomerBalance.associate = (models) => {
    CustomerBalance.belongsTo(models.Customer, {
        foreignKey: 'customer_id',
        as: 'customer',
    });
};

module.exports = CustomerBalance;
