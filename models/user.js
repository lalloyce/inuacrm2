const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);

class User extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    full_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('customer_service', 'sales_manager', 'group_coordinator', 'other_manager', 'admin'),
        allowNull: false,
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    verification_token: DataTypes.STRING(255),
    avatar: DataTypes.STRING(255),
    last_login: DataTypes.DATE,
    login_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    sequelize,
    modelName: 'User',
    timestamps: true,
});

module.exports = User;