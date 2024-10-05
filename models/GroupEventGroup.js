/**
 * Importing Sequelize and setting up the database connection.
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Defining the GroupEventGroup model.
 * 
 * This model represents the association between a group and an event.
 * 
 * @param {integer} id - The unique identifier for the group event group, auto-incrementing and primary key.
 * @param {integer} event_id - The foreign key referencing the 'GroupEvents' model.
 * @param {integer} group_id - The foreign key referencing the 'Groups' model.
 */
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

// Exporting the GroupEventGroup model
module.exports = GroupEventGroup;
