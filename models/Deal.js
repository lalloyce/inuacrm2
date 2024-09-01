const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Deal = sequelize.define('Deal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  customer_id: DataTypes.INTEGER,
  assigned_to: DataTypes.INTEGER,
  amount: DataTypes.DECIMAL(10, 2),
  status: {
    type: DataTypes.ENUM('prospect', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'),
  },
  expected_close_date: DataTypes.DATEONLY,
}, {
  tableName: 'deals',
  timestamps: true,
  underscored: true,
});

module.exports = Deal;
