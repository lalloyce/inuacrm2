/**
 * Importing Sequelize and setting up the database connection.
 */
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Defining the SalesTarget model.
 * 
 * This model represents a sales target within the system.
 * 
 * @class SalesTarget
 * @extends Model
 */
class SalesTarget extends Model {}

/**
 * Initializing the SalesTarget model with its attributes.
 * 
 * @param {Object} attributes - The attributes of the SalesTarget model.
 * @param {Object} options - The options for the SalesTarget model.
 */
SalesTarget.init({
    /**
     * The unique identifier for the sales target, auto-incrementing and primary key.
     * 
     * @param {integer} id - The unique identifier.
     */
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    /**
     * The target amount for the sales target, a decimal number with a maximum of 10 digits and 2 decimal places, not null.
     * Validation ensures the target amount cannot be negative.
     * 
     * @param {decimal} target_amount - The target amount for the sales target.
     */
    target_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0, // Ensure target amount cannot be negative
        },
    },
    /**
     * The target date for the sales target, a date, not null.
     * 
     * @param {date} target_date - The target date for the sales target.
     */
    target_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    /**
     * The foreign key referencing the GroupSalesContracts table, indicating the contract associated with the sales target.
     * Optional: define behavior on contract deletion.
     * 
     * @param {integer} group_sales_contract_id - The foreign key referencing the GroupSalesContracts table.
     */
    group_sales_contract_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'GroupSalesContracts',
            key: 'id',
        },
        onDelete: 'CASCADE', // Optional: define behavior on contract deletion
    },
}, {
    /**
     * Associating the model with the sequelize instance and database.
     */
    sequelize,
    /**
     * The name of the model.
     */
    modelName: 'SalesTarget',
    /**
     * The name of the table in the database.
     */
    tableName: 'sales_targets',
    /**
     * Enable timestamps for the model.
     */
    timestamps: true,
});

/**
 * Exporting the SalesTarget model.
 */
module.exports = SalesTarget;
