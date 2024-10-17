/**
 * Importing models for association definitions.
 */
const User = require('./User');
const Session = require('./Session');
const GroupLeader = require('./GroupLeader');
const GroupEvent = require('./GroupEvent');
const GroupEventAttendee = require('./GroupEventAttendee');
const GroupEventGroup = require('./GroupEventGroup');
const Customer = require('./Customer');
const GroupSalesContract = require('./GroupSalesContract');
const Product = require('./Product');
const SalesTarget = require('./SalesTarget');
const Payment = require('./Payment');
const Notification = require('./Notification');
const AuditLog = require('./AuditLog');
const CustomerBalance = require('./CustomerBalance');

// Define associations
/**
 * Defining associations between models.
 * 
 * Establishing a hasMany relationship between User and Session, indicating that a user can have multiple sessions.
 */
User.hasMany(Session);
Session.belongsTo(User);

/**
 * Establishing a hasMany relationship between User and GroupEvent, indicating that a user can create multiple group events.
 * 
 * @param {string} foreignKey - The foreign key referencing the User model.
 */
User.hasMany(GroupEvent, { foreignKey: 'created_by' });
GroupEvent.belongsTo(User, { foreignKey: 'created_by' });

/**
 * Establishing a hasMany relationship between GroupEvent and GroupEventAttendee, indicating that a group event can have multiple attendees.
 */
GroupEvent.hasMany(GroupEventAttendee);
GroupEventAttendee.belongsTo(GroupEvent);

/**
 * Establishing a hasMany relationship between GroupEvent and GroupEventGroup, indicating that a group event can be part of multiple groups.
 */
GroupEvent.hasMany(GroupEventGroup);
GroupEventGroup.belongsTo(GroupEvent);

// Customer associations
/**
 * Establishing a hasMany relationship between Customer and GroupSalesContract, indicating that a customer can have multiple group sales contracts.
 * 
 * @param {string} foreignKey - The foreign key referencing the Customer model.
 */
Customer.hasMany(GroupSalesContract);
GroupSalesContract.belongsTo(Customer, { foreignKey: 'customer_id' });

/**
 * Establishing a hasMany relationship between Customer and Payment, indicating that a customer can make multiple payments.
 * 
 * @param {string} foreignKey - The foreign key referencing the Customer model.
 */
Customer.hasMany(Payment);
Payment.belongsTo(Customer, { foreignKey: 'customer_id' });

/**
 * Establishing a hasMany relationship between Customer and Notification, indicating that a customer can receive multiple notifications.
 * 
 * @param {string} foreignKey - The foreign key referencing the Customer model.
 */
Customer.hasMany(Notification);
Notification.belongsTo(Customer, { foreignKey: 'userId' });

/**
 * Establishing a hasOne relationship between Customer and CustomerBalance, indicating that a customer has one balance.
 * 
 * @param {string} foreignKey - The foreign key referencing the Customer model.
 */
Customer.hasOne(CustomerBalance);
CustomerBalance.belongsTo(Customer, { foreignKey: 'customer_id' });

// GroupSalesContract associations
/**
 * Establishing a hasMany relationship between GroupSalesContract and SalesTarget, indicating that a group sales contract can have multiple sales targets.
 * 
 * @param {string} foreignKey - The foreign key referencing the GroupSalesContract model.
 */
GroupSalesContract.hasMany(SalesTarget);
SalesTarget.belongsTo(GroupSalesContract, { foreignKey: 'group_sales_contract_id' });

// Product associations
/**
 * Establishing a hasMany relationship between Product and SalesTarget, indicating that a product can have multiple sales targets.
 * 
 * @param {string} foreignKey - The foreign key referencing the Product model.
 */
Product.hasMany(SalesTarget);
SalesTarget.belongsTo(Product, { foreignKey: 'product_id' });

// AuditLog associations
/**
 * Establishing a hasMany relationship between User and AuditLog, indicating that a user can have multiple audit log entries.
 * 
 * @param {string} foreignKey - The foreign key referencing the User model.
 */
User.hasMany(AuditLog);
AuditLog.belongsTo(User, { foreignKey: 'userId' });

// Export models
module.exports = {
  User,
  Session,
  GroupLeader,
  GroupEvent,
  GroupEventAttendee,
  GroupEventGroup,
  Customer,
  GroupSalesContract,
  Product,
  SalesTarget,
  Payment,
  Notification,
  AuditLog,
  CustomerBalance,
};
