/**
 * Importing Sequelize and setting up the database connection.
 */
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Defining the Product model.
 * 
 * This model represents a product within the system.
 * 
 * @class Product
 * @extends Model
 */
class Product extends Model {}

/**
 * Initializing the Product model with its attributes.
 * 
 * @param {Object} attributes - The attributes of the Product model.
 * @param {Object} options - The options for the Product model.
 */
Product.init({
    /**
     * The unique identifier for the product, auto-incrementing and primary key.
     * 
     * @param {integer} id - The unique identifier.
     */
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    /**
     * The name of the product, a string with a maximum length of 255 characters, not null.
     * 
     * @param {string} name - The name of the product.
     */
    name: {
        type: DataTypes.STRING(255), // Specified length for better control
        allowNull: false,
    },
    /**
     * The description of the product, a text field that can be null.
     * 
     * @param {text} description - The description of the product.
     */
    description: {
        type: DataTypes.TEXT,
        allowNull: true, // Explicitly allowing null
    },
    /**
     * The price of the product, a decimal number with a maximum of 10 digits and 2 decimal places, not null.
     * 
     * @param {decimal} price - The price of the product.
     */
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0, // Ensuring price cannot be negative
        },
    },
    /**
     * The stock quantity of the product, an integer that cannot be negative, not null.
     * 
     * @param {integer} stock - The stock quantity of the product.
     */
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0, // Ensuring stock cannot be negative
        },
    },
}, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: true,
    underscored: true, // Use underscored naming convention
});

/**
 * Exporting the Product model.
 */
module.exports = Product;
