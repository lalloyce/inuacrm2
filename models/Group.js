const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);
const GroupLeader = require('./GroupLeader');
const User = require('./User');

class Group extends Model {}

Group.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    group_leader_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: GroupLeader,
            key: 'id',
        },
    },
    group_coordinator_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    member_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 5,
            max: 10,
        },
    },
}, {
    sequelize,
    modelName: 'Group',
    timestamps: true,
});

module.exports = Group;
