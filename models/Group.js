const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Group = sequelize.define('Group', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  group_leader_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  group_coordinator_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  member_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 5,
      max: 10,
    },
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
  tableName: 'groups',
  timestamps: true,
  underscored: true,
});

module.exports = Group;
