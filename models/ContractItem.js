const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ContractItem = sequelize.define('ContractItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  contract_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  item_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  item_serial_number: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  down_payment: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  monthly_installment: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  total_payment_plan_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  tableName: 'contract_items',
  timestamps: true,
  underscored: true,
});

module.exports = ContractItem;
