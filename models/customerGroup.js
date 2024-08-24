const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const CustomerGroup = sequelize.define('CustomerGroup', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    CustomerGroup.associate = (models) => {
        CustomerGroup.belongsTo(models.User, { as: 'coordinator', foreignKey: 'coordinatorId' });
        CustomerGroup.hasMany(models.Customer);
    };

    return CustomerGroup;
};