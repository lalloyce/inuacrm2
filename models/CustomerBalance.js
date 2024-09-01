const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CustomerBalance = sequelize.define('CustomerBalance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  contract_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  amount_paid: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  remaining_balance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  tableName: 'customer_balances',
  timestamps: true,
  updatedAt: 'last_updated',
  underscored: true,
});

module.exports = CustomerBalance;
