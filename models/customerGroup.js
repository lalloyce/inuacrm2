/**
 * Importing Sequelize and setting up the database connection.
 */
const { DataTypes } = require('sequelize');

/**
 * Defining the CustomerGroup model.
 * 
 * This model represents a customer group within the system.
 * 
 * @param {sequelize} sequelize - The Sequelize instance.
 * @returns {CustomerGroup} - The CustomerGroup model.
 */
module.exports = (sequelize) => {
    /**
     * Initializing the CustomerGroup model with its attributes.
     * 
     * @param {object} attributes - The attributes of the CustomerGroup model.
     */
    const CustomerGroup = sequelize.define('CustomerGroup', {
        /**
         * The name of the customer group, not null.
         * 
         * @param {string} name - The name of the customer group.
         */
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    /**
     * Associating the CustomerGroup model with other models.
     * 
     * @param {object} models - The models object.
     */
    CustomerGroup.associate = (models) => {
        /**
         * Establishing a belongsTo relationship with the User model, indicating the coordinator of the customer group.
         * 
         * @param {string} as - The alias for the association.
         * @param {string} foreignKey - The foreign key referencing the User model.
         */
        CustomerGroup.belongsTo(models.User, { as: 'coordinator', foreignKey: 'coordinatorId' });
        /**
         * Establishing a hasMany relationship with the Customer model.
         */
        CustomerGroup.hasMany(models.Customer);
    };

    /**
     * Returning the CustomerGroup model.
     * 
     * @returns {CustomerGroup} - The CustomerGroup model.
     */
    return CustomerGroup;
};