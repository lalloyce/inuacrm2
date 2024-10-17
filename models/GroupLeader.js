/**
 * Importing Sequelize and setting up the database connection.
 */
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

/**
 * Defining the GroupLeader model.
 *
 * @class GroupLeader
 * @extends Model
 */
class GroupLeader extends Model {}

/**
 * Initializing the GroupLeader model with its attributes.
 *
 * @param {object} attributes - The attributes of the GroupLeader model.
 */
GroupLeader.init(
  {
    /**
     * The unique identifier for the group leader, auto-incrementing and primary key.
     *
     * @param {integer} id - The unique identifier.
     */
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    /**
     * The first name of the group leader, not null.
     *
     * @param {string} first_name - The first name of the group leader.
     */
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    /**
     * The middle name of the group leader, optional.
     *
     * @param {string} middle_name - The middle name of the group leader.
     */
    middle_name: {
      type: DataTypes.STRING,
    },
    /**
     * The last name of the group leader, not null.
     *
     * @param {string} last_name - The last name of the group leader.
     */
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    /**
     * The mobile number of the group leader, unique and not null.
     *
     * @param {string} mobile_number - The mobile number of the group leader.
     */
    mobile_number: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    /**
     * The village of the group leader, optional.
     *
     * @param {string} village - The village of the group leader.
     */
    village: {
      type: DataTypes.STRING,
    },
    /**
     * The sub location of the group leader, optional.
     *
     * @param {string} sub_location - The sub location of the group leader.
     */
    sub_location: {
      type: DataTypes.STRING,
    },
    /**
     * The ward of the group leader, optional.
     *
     * @param {string} ward - The ward of the group leader.
     */
    ward: {
      type: DataTypes.STRING,
    },
    /**
     * The county of the group leader, not null.
     *
     * @param {string} county - The county of the group leader.
     */
    county: {
      type: DataTypes.ENUM(
        "Mombasa",
        "Kwale",
        "Kilifi",
        "Tana River",
        "Lamu",
        "Taita/Taveta",
        "Garissa",
        "Wajir",
        "Mandera",
        "Marsabit",
        "Isiolo",
        "Meru",
        "Tharaka-Nithi",
        "Embu",
        "Kitui",
        "Machakos",
        "Makueni",
        "Nyandarua",
        "Nyeri",
        "Kirinyaga",
        "Muranga",
        "Kiambu",
        "Turkana",
        "West Pokot",
        "Samburu",
        "Trans Nzoia",
        "Uasin Gishu",
        "Elgeyo/Marakwet",
        "Nandi",
        "Baringo",
        "Laikipia",
        "Nakuru",
        "Narok",
        "Kajiado",
        "Kericho",
        "Bomet",
        "Kakamega",
        "Vihiga",
        "Bungoma",
        "Busia",
        "Siaya",
        "Kisumu",
        "Homa Bay",
        "Migori",
        "Kisii",
        "Nyamira",
        "Nairobi City",
      ),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "GroupLeader",
    tableName: "GroupLeaders",
    timestamps: true,
  },
);
// Exporting the GroupLeader model
module.exports = GroupLeader;
