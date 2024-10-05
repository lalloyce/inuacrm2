const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Customer Model
 * Represents a customer in the system.
 * 
 * This model captures essential information about a customer, including their personal details, contact information, and location.
 * It also includes fields related to their group sales contract and leadership status.
 */
const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Unique identifier for the customer'
  },
  first_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'Customer\'s first name'
  },
  middle_name: {
    type: DataTypes.STRING(50),
    comment: 'Customer\'s middle name (optional)'
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'Customer\'s last name'
  },
  national_id_number: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false,
    comment: 'Customer\'s national ID number'
  },
  mpesa_mobile_number: {
    type: DataTypes.STRING(15),
    unique: true,
    allowNull: false,
    comment: 'Customer\'s M-Pesa mobile number'
  },
  alternative_mobile_number: {
    type: DataTypes.STRING(15),
    comment: 'Customer\'s alternative mobile number (optional)'
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: false,
    comment: 'Customer\'s gender'
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: 'Customer\'s date of birth'
  },
  village: {
    type: DataTypes.STRING(100),
    comment: 'Customer\'s village (optional)'
  },
  sub_location: {
    type: DataTypes.STRING(100),
    comment: 'Customer\'s sub-location (optional)'
  },
  ward: {
    type: DataTypes.STRING(100),
    comment: 'Customer\'s ward (optional)'
  },
  sub_county: {
    type: DataTypes.STRING(100),
    comment: 'Customer\'s sub-county (optional)'
  },
  county: {
    type: DataTypes.ENUM('Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita/Taveta', 'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Meru', 'Tharaka-Nithi', 'Embu', 'Kitui', 'Machakos', 'Makueni', 'Nyandarua', 'Nyeri', 'Kirinyaga', 'Murang\'a', 'Kiambu', 'Turkana', 'West Pokot', 'Samburu', 'Trans Nzoia', 'Uasin Gishu', 'Elgeyo/Marakwet', 'Nandi', 'Baringo', 'Laikipia', 'Nakuru', 'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Kakamega', 'Vihiga', 'Bungoma', 'Busia', 'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira', 'Nairobi City'),
    allowNull: false,
    comment: 'Customer\'s county'
  },
  group_sales_contract_id: {
    type: DataTypes.INTEGER,
    comment: 'ID of the group sales contract (if applicable)'
  },
  is_group_leader: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Indicates if the customer is a group leader'
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'ID of the user who created this customer record'
  }
}, {
  tableName: 'customers',
  timestamps: true,
  underscored: true,
});

module.exports = Customer;