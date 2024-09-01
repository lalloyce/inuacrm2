const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GroupLeader = sequelize.define('GroupLeader', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  first_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  middle_name: DataTypes.STRING(50),
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  mobile_number: {
    type: DataTypes.STRING(15),
    unique: true,
    allowNull: false,
  },
  village: DataTypes.STRING(100),
  sub_location: DataTypes.STRING(100),
  ward: DataTypes.STRING(100),
  county: {
    type: DataTypes.ENUM('Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita/Taveta', 'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Meru', 'Tharaka-Nithi', 'Embu', 'Kitui', 'Machakos', 'Makueni', 'Nyandarua', 'Nyeri', 'Kirinyaga', 'Murang\'a', 'Kiambu', 'Turkana', 'West Pokot', 'Samburu', 'Trans Nzoia', 'Uasin Gishu', 'Elgeyo/Marakwet', 'Nandi', 'Baringo', 'Laikipia', 'Nakuru', 'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Kakamega', 'Vihiga', 'Bungoma', 'Busia', 'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira', 'Nairobi City'),
    allowNull: false,
  },
  group_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  tableName: 'group_leaders',
  timestamps: true,
  underscored: true,
});

module.exports = GroupLeader;
