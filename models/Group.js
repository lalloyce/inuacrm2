/**
 * Importing Sequelize and setting up the database connection.
 */
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const GroupLeader = require("./GroupLeader");

/**
 * Defining the Group model.
 *
 * This model represents a group within the system.
 *
 * @class Group
 * @extends Model
 */
class Group extends Model {}

/**
 * Initializing the Group model with its attributes.
 *
 * @param {object} attributes - The attributes of the Group model.
 */
Group.init(
  {
    /**
     * The unique identifier for the group, auto-incrementing and primary key.
     *
     * @param {integer} id - The unique identifier.
     */
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    /**
     * The name of the group, not null.
     *
     * @param {string} group_name - The name of the group.
     */
    group_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    /**
     * The foreign key referencing the 'GroupLeaders' model.
     *
     * @param {integer} group_leader_id - The foreign key referencing the 'GroupLeaders' model.
     */
    group_leader_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "GroupLeaders",
        key: "id",
      },
    },
  },
  {
    /**
     * Setting up the database connection and model properties.
     *
     * @param {object} sequelize - The Sequelize instance.
     * @param {string} modelName - The name of the model.
     * @param {string} tableName - The name of the table in the database.
     * @param {boolean} timestamps - Indicates if timestamps are enabled.
     */
    sequelize,
    modelName: "Group",
    tableName: "groups",
    timestamps: true,
  },
);

Group.belongsTo(GroupLeader, { foreignKey: "group_leader_id" });
// Exporting the Group model
module.exports = Group;
