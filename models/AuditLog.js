/**
 * Importing Sequelize and setting up the database connection.
 */
const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = new Sequelize(process.env.DATABASE_URL);
/**
 * Importing the User model for association.
 */
const User = require("./user");

/**
 * Defining the AuditLog model.
 *
 * This model represents an audit log entry within the system.
 *
 * @class AuditLog
 * @extends Model
 */
class AuditLog extends Model {}

/**
 * Initializing the AuditLog model with its attributes.
 *
 * @param {object} attributes - The attributes of the AuditLog model.
 */
AuditLog.init(
  {
    /**
     * The unique identifier for the audit log entry, auto-incrementing and primary key.
     *
     * @param {integer} id - The unique identifier.
     */
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    /**
     * The foreign key referencing the 'Users' model, indicating the user responsible for the action.
     *
     * @param {integer} userId - The foreign key referencing the 'Users' model.
     */
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    /**
     * The action performed, not null.
     *
     * @param {string} action - The action performed.
     */
    action: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    /**
     * The endpoint accessed, not null.
     *
     * @param {string} endpoint - The endpoint accessed.
     */
    endpoint: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    /**
     * The HTTP method used, not null.
     *
     * @param {string} method - The HTTP method used.
     */
    method: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    /**
     * The status code of the response, not null.
     *
     * @param {integer} statusCode - The status code of the response.
     */
    statusCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    /**
     * The message associated with the audit log entry.
     *
     * @param {string} message - The message associated with the audit log entry.
     */
    message: DataTypes.STRING(255),
  },
  {
    /**
     * Setting up the model with the Sequelize instance and other configurations.
     *
     * @param {object} sequelize - The Sequelize instance.
     * @param {string} modelName - The name of the model.
     * @param {boolean} timestamps - Indicates if timestamps are enabled.
     */
    sequelize,
    modelName: "AuditLog",
    timestamps: true,
  },
);

/**
 * Exporting the AuditLog model.
 */
module.exports = AuditLog;
