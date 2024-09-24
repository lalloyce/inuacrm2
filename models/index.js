const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};

// Read all model files and import them
fs.readdirSync(__dirname)
    .filter(file => file.endsWith('.js') && file !== 'index.js')
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

// Associate models
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// In your index.js file, after defining the models
const User = require('./User');
const GroupLeader = require('./GroupLeader');
const Group = require('./Group');
const GroupSalesContract = require('./GroupSalesContract');
const Customer = require('./Customer');
const Product = require('./Product');
const SalesTarget = require('./SalesTarget');
const Payment = require('./Payment');
const Notification = require('./Notification');
const AuditLog = require('./AuditLog');

// Define indexes
User.init({
    // ... existing fields ...
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    indexes: [
        { unique: true, fields: ['email'] },
        { fields: ['email'] },
    ],
});

GroupLeader.init({
    // ... existing fields ...
}, {
    sequelize,
    modelName: 'GroupLeader',
    tableName: 'group_leaders',
    timestamps: true,
    indexes: [
        { fields: ['mobile_number'] },
    ],
});

Customer.init({
    // ... existing fields ...
}, {
    sequelize,
    modelName: 'Customer',
    tableName: 'customers',
    timestamps: true,
    indexes: [
        { fields: ['national_id_number'] },
        { fields: ['mpesa_mobile_number'] },
        { fields: ['group_sales_contract_id'] },
        { fields: ['created_by'] },
    ],
});

GroupSalesContract.init({
    // ... existing fields ...
}, {
    sequelize,
    modelName: 'GroupSalesContract',
    tableName: 'group_sales_contracts',
    timestamps: true,
    indexes: [
        { fields: ['group_id'] },
    ],
});

Payment.init({
    // ... existing fields ...
}, {
    sequelize,
    modelName: 'Payment',
    tableName: 'payments',
    timestamps: true,
    indexes: [
        { fields: ['customer_id'] },
    ],
});

// Continue for other models...

module.exports = db;