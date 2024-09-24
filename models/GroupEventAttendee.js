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
    references: {
      model: 'GroupEvents', // Assuming you have a GroupEvent model
      key: 'id',
    },
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Customers', // Assuming you have a Customers model
      key: 'id',
    },
  },
  status: {
    type: DataTypes.ENUM('attending', 'not_attending', 'maybe'),
    defaultValue: 'attending',
  },
}, {
  tableName: 'group_event_attendees',
  timestamps: true,
  underscored: true,
});

module.exports = GroupEventAttendee;
