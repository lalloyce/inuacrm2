/**
 * Importing Sequelize and setting up the database connection.
 */
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Defining the ProductSale model.
 */
class ProductSale extends Model {}

/**
 * Initializing the ProductSale model with its attributes.
 */
ProductSale.init({
    /**
     * The unique identifier for the product sale.
     */
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    /**
     * The foreign key referencing the GroupSalesContracts table.
     */
    contract_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'GroupSalesContracts', // Reference to GroupSalesContract model
            key: 'id',
        },
    },
    /**
     * The foreign key referencing the Products table.
     */
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Products', // Reference to Product model
            key: 'id',
        },
    },
    /**
     * The quantity of the product sold.
     * Validation ensures the quantity is at least 1.
     */
    quantity_sold: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1, // Ensure quantity sold is at least 1
        },
    },
    /**
     * The date of the sale.
     */
    sale_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    /**
     * The total amount of the sale.
     * This field is required.
     */
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false, // Ensure total amount is required
    },
}, {
    /**
     * Associating the model with the sequelize instance and database.
     */
    sequelize,
    /**
     * The name of the model.
     */
    modelName: 'ProductSale',
    /**
     * The name of the table in the database.
     */
    tableName: 'product_sales', // Explicitly define table name
    /**
     * Enable timestamps for the model.
     */
    timestamps: true,
});

/**
 * Exporting the ProductSale model.
 */
module.exports = ProductSale;
