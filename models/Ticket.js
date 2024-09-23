const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);
const User = require('./User');

class Ticket extends Model {}

Ticket.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    customer_id: {
        type: DataTypes.INTEGER,
    },
    assigned_to: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },
    status: {
        type: DataTypes.ENUM('open', 'in_progress', 'closed'),
        defaultValue: 'open',
    },
    priority: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        defaultValue: 'medium',
    },
    subject: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: DataTypes.TEXT,
}, {
    sequelize,
    modelName: 'Ticket',
    timestamps: true,
});

module.exports = Ticket;
