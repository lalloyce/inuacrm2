const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);

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
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    quantity_sold: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    sale_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
    },
}, {
    sequelize,
    modelName: 'ProductSale',
    timestamps: true,
});

module.exports = ProductSale;
