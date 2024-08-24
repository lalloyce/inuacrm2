const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('admin', 'group_coordinator', 'sales_manager', 'customer_service', 'management'),
        allowNull: false,
    },
});

const PasswordResetToken = sequelize.define('PasswordResetToken', {
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

const CustomerGroup = sequelize.define('CustomerGroup', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

const Customer = sequelize.define('Customer', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
    },
    phone: DataTypes.STRING,
    address: DataTypes.TEXT,
});

const SalesContract = sequelize.define('SalesContract', {
    productName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    installmentAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    installmentFrequency: {
        type: DataTypes.ENUM('weekly', 'bi-weekly', 'monthly'),
        allowNull: false,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('active', 'completed', 'defaulted'),
        allowNull: false,
    },
});

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

const SupportTicket = sequelize.define('SupportTicket', {
    subject: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: DataTypes.TEXT,
    status: {
        type: DataTypes.ENUM('open', 'in_progress', 'resolved', 'closed'),
        allowNull: false,
    },
});

// Define associations
User.hasMany(PasswordResetToken);
PasswordResetToken.belongsTo(User);

User.hasMany(CustomerGroup, { foreignKey: 'coordinatorId' });
CustomerGroup.belongsTo(User, { as: 'coordinator', foreignKey: 'coordinatorId' });

CustomerGroup.hasMany(Customer);
Customer.belongsTo(CustomerGroup);

Customer.hasMany(SalesContract);
SalesContract.belongsTo(Customer);

SalesContract.hasMany(Payment);
Payment.belongsTo(SalesContract);

Customer.hasMany(SupportTicket);
SupportTicket.belongsTo(Customer);

User.hasMany(SupportTicket, { foreignKey: 'assignedTo' });
SupportTicket.belongsTo(User, { as: 'assignedUser', foreignKey: 'assignedTo' });

module.exports = {
    sequelize,
    User,
    PasswordResetToken,
    CustomerGroup,
    Customer,
    SalesContract,
    Payment,
    SupportTicket,
};