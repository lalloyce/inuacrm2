/**
 * Importing Sequelize and setting up the database connection.
 */
const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);

/**
 * Defining the Deal model.
 * 
 * This model represents a deal within the system.
 * 
 * @class Deal
 * @extends Model
 */
class Deal extends Model {}

/**
 * Initializing the Deal model with its attributes.
 * 
 * @param {object} attributes - The attributes of the Deal model.
 */
Deal.init({
    /**
     * The unique identifier for the deal, auto-incrementing and primary key.
     * 
     * @param {integer} id - The unique identifier.
     */
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    /**
     * The foreign key referencing the 'Customers' model.
     * 
     * @param {integer} customer_id - The foreign key referencing the 'Customers' model.
     */
    customer_id: {
        type: DataTypes.INTEGER,
    },
    /**
     * The foreign key referencing the 'Users' model, indicating the user assigned to the deal.
     * 
     * @param {integer} assigned_to - The foreign key referencing the 'Users' model.
     */
    assigned_to: {
        type: DataTypes.INTEGER,
    },
    /**
     * The amount of the deal.
     * 
     * @param {decimal} amount - The amount of the deal.
     */
    amount: {
        type: DataTypes.DECIMAL(10, 2),
    },
    /**
     * The status of the deal, can be 'prospect', 'qualified', 'proposal', 'negotiation', 'closed_won', or 'closed_lost'.
     * 
     * @param {string} status - The status of the deal.
     */
    status: {
        type: DataTypes.ENUM('prospect', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'),
    },
    /**
     * The expected close date of the deal.
     * 
     * @param {date} expected_close_date - The expected close date of the deal.
     */
    expected_close_date: {
        type: DataTypes.DATEONLY,
    },
}, {
    /**
     * Setting up the database connection and model properties.
     * 
     * @param {object} sequelize - The Sequelize instance.
     * @param {string} modelName - The name of the model.
     * @param {string} tableName - The name of the table in the database.
     * @param {boolean} timestamps - Indicates if timestamps are enabled.
     * @param {boolean} underscored - Indicates if underscored is enabled.
     */
    sequelize,
    modelName: 'Deal',
    tableName: 'deals',
    timestamps: true,
    underscored: true,
});

// Exporting the Deal model
module.exports = Deal;
