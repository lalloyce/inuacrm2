/**
 * Importing Sequelize and setting up the database connection.
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Defining the GroupEvent model.
 * 
 * This model represents a group event within the system.
 * 
 * @param {integer} id - The unique identifier for the group event, auto-incrementing and primary key.
 * @param {string} event_type - The type of the event, can be 'arrears_meeting', 'formation_meeting', or 'training_meeting'.
 * @param {string} title - The title of the event.
 * @param {text} description - The description of the event.
 * @param {date} event_date - The date of the event.
 * @param {time} start_time - The start time of the event.
 * @param {time} end_time - The end time of the event.
 * @param {string} sub_location - The sub-location where the event will take place.
 * @param {string} ward - The ward where the event will take place.
 * @param {string} county - The county where the event will take place.
 * @param {string} status - The status of the event, can be 'planned', 'in_progress', 'completed', or 'cancelled'.
 * @param {integer} created_by - The foreign key referencing the 'Users' model, indicating the user who created the event.
 */
const GroupEvent = sequelize.define('GroupEvent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  event_type: {
    type: DataTypes.ENUM('arrears_meeting', 'formation_meeting', 'training_meeting'),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: DataTypes.TEXT,
  event_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  start_time: DataTypes.TIME,
  end_time: DataTypes.TIME,
  sub_location: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  ward: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  county: {
    type: DataTypes.ENUM('Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita/Taveta', 'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Meru', 'Tharaka-Nithi', 'Embu', 'Kitui', 'Machakos', 'Makueni', 'Nyandarua', 'Nyeri', 'Kirinyaga', 'Murang\'a', 'Kiambu', 'Turkana', 'West Pokot', 'Samburu', 'Trans Nzoia', 'Uasin Gishu', 'Elgeyo/Marakwet', 'Nandi', 'Baringo', 'Laikipia', 'Nakuru', 'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Kakamega', 'Vihiga', 'Bungoma', 'Busia', 'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira', 'Nairobi City'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('planned', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'planned',
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // Assuming you have a Users model
      key: 'id',
    },
  },
}, {
  tableName: 'group_events',
  timestamps: true,
  underscored: true,
});

// Exporting the GroupEvent model
module.exports = GroupEvent;
