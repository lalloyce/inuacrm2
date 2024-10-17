/**
 * Importing Sequelize and setting up the database connection.
 */
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Defining the GroupSalesContract model.
 * 
 * @class GroupSalesContract
 * @extends Model
 */
class GroupSalesContract extends Model {}

/**
 * Initializing the GroupSalesContract model with its attributes.
 * 
 * @param {object} attributes - The attributes of the GroupSalesContract model.
 */
GroupSalesContract.init({
    /**
     * The unique identifier for the group sales contract, auto-incrementing and primary key.
     * 
     * @param {integer} id - The unique identifier.
     */
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    /**
     * The foreign key referencing the 'Groups' model.
     * 
     * @param {integer} group_id - The foreign key referencing the 'Groups' model.
     */
    group_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Groups',
            key: 'id',
        },
        allowNull: false,
    },
    /**
     * The date of the contract.
     * 
     * @param {date} contract_date - The date of the contract.
     */
    contract_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    /**
     * The final due date for the contract.
     * 
     * @param {date} final_due_date - The final due date for the contract.
     */
    final_due_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    /**
     * The sales territory for the contract.
     * 
     * @param {string} sales_territory - The sales territory for the contract.
     */
    sales_territory: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    /**
     * The total number of items sold under the contract.
     * 
     * @param {integer} total_items_sold - The total number of items sold under the contract.
     */
    total_items_sold: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    /**
     * The total down payment for the group.
     * 
     * @param {decimal} total_group_down_payment - The total down payment for the group.
     */
    total_group_down_payment: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    /**
     * The total monthly installment for the group.
     * 
     * @param {decimal} total_group_monthly_installment - The total monthly installment for the group.
     */
    total_group_monthly_installment: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    /**
     * The total payment plan price for the group.
     * 
     * @param {decimal} total_group_payment_plan_price - The total payment plan price for the group.
     */
    total_group_payment_plan_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    /**
     * The status of the contract.
     * 
     * @param {enum} status - The status of the contract, can be 'active', 'completed', or 'defaulted'.
     */
    status: {
        type: DataTypes.ENUM('active', 'completed', 'defaulted'),
        defaultValue: 'active',
    },
}, {
    /**
     * Configuring the model.
     * 
     * @param {object} sequelize - The Sequelize instance.
     * @param {string} modelName - The name of the model.
     * @param {string} tableName - The name of the table in the database.
     * @param {boolean} timestamps - Indicates if timestamps are enabled.
     */
    sequelize,
    modelName: 'GroupSalesContract',
    tableName: 'group_sales_contracts',
    timestamps: true,
});

// Exporting the GroupSalesContract model
module.exports = GroupSalesContract;
