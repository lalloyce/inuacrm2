const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GroupEventGroup = sequelize.define('GroupEventGroup', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  group_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'group_event_groups',
  timestamps: false,
});

module.exports = GroupEventGroup;
