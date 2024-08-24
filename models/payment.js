const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Payment = sequelize.define('Payment', {
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        paymentDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    });

    Payment.associate = (models) => {
        Payment.belongsTo(models.SalesContract);
    };

    return Payment;
};