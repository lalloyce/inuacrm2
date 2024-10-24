// models/GroupSalesContract.js
module.exports = (sequelize, DataTypes) => {
  const GroupSalesContract = sequelize.define('GroupSalesContract', {
    contractDate: { type: DataTypes.DATE, allowNull: false },
    finalDueDate: { type: DataTypes.DATE, allowNull: false },
    salesTerritory: { type: DataTypes.STRING, allowNull: false },
    totalItemsSold: { type: DataTypes.INTEGER, allowNull: false },
    totalGroupDownPayment: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    totalGroupMonthlyInstallment: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    totalGroupPaymentPlanPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: { type: DataTypes.ENUM('active', 'completed', 'defaulted'), defaultValue: 'active', allowNull: false }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  GroupSalesContract.associate = (models) => {
    GroupSalesContract.belongsTo(models.Group, { foreignKey: 'group_id' });
    GroupSalesContract.hasMany(models.Customer);
  };

  return GroupSalesContract;
};
