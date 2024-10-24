// models/Deal.js
module.exports = (sequelize, DataTypes) => {
  const Deal = sequelize.define('Deal', {
    amount: { type: DataTypes.DECIMAL(10, 2) },
    status: { type: DataTypes.ENUM('prospect', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost') },
    expectedCloseDate: { type: DataTypes.DATE }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Deal.associate = (models) => {
    Deal.belongsTo(models.Customer, { foreignKey: 'customer_id' });
    Deal.belongsTo(models.User, { foreignKey: 'assigned_to' });
  };

  return Deal;
};
