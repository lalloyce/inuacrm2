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
User.hasMany(Session);
Session.belongsTo(User);

User.hasMany(GroupEvent, { foreignKey: 'created_by' });
GroupEvent.belongsTo(User, { foreignKey: 'created_by' });

GroupEvent.hasMany(GroupEventAttendee);
GroupEventAttendee.belongsTo(GroupEvent);

GroupEvent.hasMany(GroupEventGroup);
GroupEventGroup.belongsTo(GroupEvent);

// Customer associations
Customer.hasMany(GroupSalesContract);
GroupSalesContract.belongsTo(Customer, { foreignKey: 'customer_id' });

Customer.hasMany(Payment);
Payment.belongsTo(Customer, { foreignKey: 'customer_id' });

Customer.hasMany(Notification);
Notification.belongsTo(Customer, { foreignKey: 'userId' });

Customer.hasOne(CustomerBalance);
CustomerBalance.belongsTo(Customer, { foreignKey: 'customer_id' });

// GroupSalesContract associations
GroupSalesContract.hasMany(SalesTarget);
SalesTarget.belongsTo(GroupSalesContract, { foreignKey: 'group_sales_contract_id' });

// Product associations
Product.hasMany(SalesTarget);
SalesTarget.belongsTo(Product, { foreignKey: 'product_id' });

// AuditLog associations
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
