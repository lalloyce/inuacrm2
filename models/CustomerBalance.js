// models/CustomerBalance.js
module.exports = (sequelize, DataTypes) => {
  const CustomerBalance = sequelize.define('CustomerBalance', {
    loanTerm: { type: DataTypes.INTEGER, allowNull: false, comment: 'in months' },
    loanPrinciple: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    downpayment: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    weeklyRepaymentAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false }, // Use a calculated field if supported by Sequelize
    amountPaid: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    loanOutstandingBalance: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
  }, {
    timestamps: true,
    createdAt: 'last_updated',
  });

  CustomerBalance.associate = (models) => {
    CustomerBalance.belongsTo(models.Customer, { foreignKey: 'customer_id' });
    CustomerBalance.belongsTo(models.GroupSalesContract, { foreignKey: 'contract_id' });
  };

  return CustomerBalance;
};
