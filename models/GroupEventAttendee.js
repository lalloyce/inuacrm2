const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GroupEventAttendee = sequelize.define('GroupEventAttendee', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  attended: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: 'group_event_attendees',
  timestamps: false,
});

module.exports = GroupEventAttendee;
