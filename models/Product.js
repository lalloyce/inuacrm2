const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Product extends Model {}

Product.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(255), // Specified length for better control
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true, // Explicitly allowing null
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0, // Ensuring price cannot be negative
        },
    },
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

module.exports = Product;
