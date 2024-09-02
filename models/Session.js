const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Session = sequelize.define('Session', {
  session_id: {
    type: DataTypes.STRING(255),
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  expires: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  data: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'sessions',
  timestamps: false,
});

module.exports = Session;
