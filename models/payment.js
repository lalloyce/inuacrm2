// models/Payment.js
module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    paymentDate: { type: DataTypes.DATE, allowNull: false },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    paymentType: { type: DataTypes.ENUM('down_payment', 'installment'), allowNull: false },
    transactionId: { type: DataTypes.STRING, unique: true, allowNull: false }
  }, {
    timestamps: true,
    createdAt: 'created_at',
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.GroupSalesContract, { foreignKey: 'contract_id' });
    Payment.belongsTo(models.Customer, { foreignKey: 'customer_id' });
  };

  return Payment;
};
