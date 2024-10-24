// models/ProductSales.js
module.exports = (sequelize, DataTypes) => {
  const ProductSales = sequelize.define('ProductSales', {
    quantitySold: { type: DataTypes.INTEGER, allowNull: false },
    saleDate: { type: DataTypes.DATE, allowNull: false },
    totalAmount: { type: DataTypes.DECIMAL(10, 2) }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  ProductSales.associate = (models) => {
    ProductSales.belongsTo(models.GroupSalesContract, { foreignKey: 'contract_id' });
    ProductSales.belongsTo(models.Product, { foreignKey: 'product_id' });
  };

  return ProductSales;
};
