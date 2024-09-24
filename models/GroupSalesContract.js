const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class GroupSalesContract extends Model {}

GroupSalesContract.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    group_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Groups',
            key: 'id',
        },
        allowNull: false,
    },
    contract_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    final_due_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    sales_territory: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    total_items_sold: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    total_group_down_payment: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    total_group_monthly_installment: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    total_group_payment_plan_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('active', 'completed', 'defaulted'),
        defaultValue: 'active',
    },
}, {
    sequelize,
    modelName: 'GroupSalesContract',
    tableName: 'group_sales_contracts',
    timestamps: true,
});

module.exports = GroupSalesContract;
