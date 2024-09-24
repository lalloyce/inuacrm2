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
    references: {
      model: 'GroupEvents', // Assuming you have a GroupEvent model
      key: 'id',
    },
  },
  group_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Groups', // Assuming you have a Groups model
      key: 'id',
    },
  },
}, {
  tableName: 'group_event_groups',
  timestamps: false,
});

module.exports = GroupEventGroup;
