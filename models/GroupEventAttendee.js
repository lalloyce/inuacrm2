/**
 * Importing Sequelize and setting up the database connection.
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Defining the GroupEventAttendee model.
 * 
 * This model represents the association between a group event and an attendee.
 * 
 * @param {integer} id - The unique identifier for the group event attendee, auto-incrementing and primary key.
 * @param {integer} event_id - The foreign key referencing the 'GroupEvents' model.
 * @param {integer} customer_id - The foreign key referencing the 'Customers' model.
 * @param {string} status - The status of the attendee, default is 'attending'.
 */
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

// Exporting the GroupEventAttendee model
module.exports = GroupEventAttendee;
