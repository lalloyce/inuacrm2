// models/SalesTarget.js
module.exports = (sequelize, DataTypes) => {
  const SalesTarget = sequelize.define('SalesTarget', {
    monthlyTarget: { type: DataTypes.INTEGER, allowNull: false, comment: 'units per month' },
    estimatedRevenueDownpayment: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    estimatedRevenueRepayments: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    totalItemsSold: { type: DataTypes.INTEGER, defaultValue: 0 }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  SalesTarget.associate = (models) => {
    SalesTarget.belongsTo(models.Product, { foreignKey: 'product_id' });
    SalesTarget.belongsTo(models.User, { foreignKey: 'group_coordinator_id' });
  };

  return SalesTarget;
};
