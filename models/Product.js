// models/Product.js
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    productName: { type: DataTypes.STRING, allowNull: false },
    productSku: { type: DataTypes.STRING, unique: true, allowNull: false },
    buyingPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    sellingPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    estimatedProfit: { type: DataTypes.DECIMAL(10, 2), allowNull: false } // Use a calculated field if supported by Sequelize
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Product.associate = (models) => {
    Product.belongsTo(models.User, { foreignKey: 'created_by' });
    Product.hasMany(models.SalesTarget, { foreignKey: 'product_id' });
  };

  return Product;
};
