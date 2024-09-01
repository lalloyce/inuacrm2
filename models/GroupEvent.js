const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
  },
}, {
  tableName: 'group_events',
  timestamps: true,
  underscored: true,
});

module.exports = GroupEvent;
