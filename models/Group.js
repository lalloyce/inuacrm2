const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Group extends Model {}

Group.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    group_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    group_leader_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'GroupLeaders',
            key: 'id',
        },
    },
}, {
    sequelize,
    modelName: 'Group',
    tableName: 'groups',
    timestamps: true,
});

module.exports = Group;
