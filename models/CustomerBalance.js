/**
 * Importing Sequelize and setting up the database connection.
 */
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Defining the CustomerBalance model.
 */
class CustomerBalance extends Model {}

/**
 * Initializing the CustomerBalance model with its attributes.
 */
CustomerBalance.init({
    /**
     * The unique identifier for the customer balance.
     */
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    /**
     * The foreign key referencing the Customers table.
     */
    customer_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Customers',
            key: 'id',
        },
        allowNull: false,
    },
    /**
     * The current balance of the customer.
     */
    balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    /**
     * The date and time the balance was last updated.
     */
    last_updated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    /**
     * Setting up the model with the Sequelize instance and other configurations.
     */
    sequelize,
    modelName: 'CustomerBalance',
    tableName: 'customer_balances',
    timestamps: true,
});

/**
 * Defining associations for the CustomerBalance model.
 * In this case, a CustomerBalance belongs to a Customer.
 */
CustomerBalance.associate = (models) => {
    CustomerBalance.belongsTo(models.Customer, {
        foreignKey: 'customer_id',
        as: 'customer',
    });
};

/**
 * Exporting the CustomerBalance model.
 */
module.exports = CustomerBalance;
