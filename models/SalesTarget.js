const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class SalesTarget extends Model {}

SalesTarget.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    target_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0, // Ensure target amount cannot be negative
        },
    },
    target_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    group_sales_contract_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'GroupSalesContracts',
            key: 'id',
        },
        onDelete: 'CASCADE', // Optional: define behavior on contract deletion
    },
}, {
    sequelize,
    modelName: 'SalesTarget',
    tableName: 'sales_targets',
    timestamps: true,
});

module.exports = SalesTarget;
