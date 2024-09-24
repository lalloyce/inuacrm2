const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class ProductSale extends Model {}

ProductSale.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    contract_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'GroupSalesContracts', // Reference to GroupSalesContract model
            key: 'id',
        },
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Products', // Reference to Product model
            key: 'id',
        },
    },
    quantity_sold: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1, // Ensure quantity sold is at least 1
        },
    },
    sale_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false, // Ensure total amount is required
    },
}, {
    sequelize,
    modelName: 'ProductSale',
    tableName: 'product_sales', // Explicitly define table name
    timestamps: true,
});

module.exports = ProductSale;
