const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GroupSalesContract = sequelize.define('GroupSalesContract', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  group_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  contract_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  final_due_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  sales_territory: {
    type: DataTypes.STRING(100),
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
    allowNull: false,
    defaultValue: 'active',
  },
}, {
  tableName: 'group_sales_contracts',
  timestamps: true,
  underscored: true,
});

module.exports = GroupSalesContract;
