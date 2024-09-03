const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Customer = sequelize.define('Customer', {
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
  national_id_number: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false,
  },
  mpesa_mobile_number: {
    type: DataTypes.STRING(15),
    unique: true,
    allowNull: false,
  },
  alternative_mobile_number: DataTypes.STRING(15),
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: false,
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  village: DataTypes.STRING(100),
  sub_location: DataTypes.STRING(100),
  ward: DataTypes.STRING(100),
  sub_county: DataTypes.STRING(100),
  county: {
    type: DataTypes.ENUM('Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita/Taveta', 'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Meru', 'Tharaka-Nithi', 'Embu', 'Kitui', 'Machakos', 'Makueni', 'Nyandarua', 'Nyeri', 'Kirinyaga', 'Murang\'a', 'Kiambu', 'Turkana', 'West Pokot', 'Samburu', 'Trans Nzoia', 'Uasin Gishu', 'Elgeyo/Marakwet', 'Nandi', 'Baringo', 'Laikipia', 'Nakuru', 'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Kakamega', 'Vihiga', 'Bungoma', 'Busia', 'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira', 'Nairobi City'),
    allowNull: false,
  },
  group_sales_contract_id: DataTypes.INTEGER,
  is_group_leader: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'customers',
  timestamps: true,
  underscored: true,
});

module.exports = Customer;