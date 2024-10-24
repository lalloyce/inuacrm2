// models/CustomerGroup.js

/**
 * Defines the CustomerGroup model.
 *
 * @param {object} sequelize - The Sequelize instance.
 * @param {object} DataTypes - The data types provided by Sequelize.
 * @returns {object} The CustomerGroup model.
 */
module.exports = (sequelize, DataTypes) => {
  /**
   * The CustomerGroup model schema.
   */
  const CustomerGroup = sequelize.define('CustomerGroup', {
    groupName: { type: DataTypes.STRING, allowNull: false },
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  /**
   * Associates the CustomerGroup model with other models.
   *
   * @param {object} models - The models to associate with.
   */
  CustomerGroup.associate = (models) => {
    CustomerGroup.belongsTo(models.GroupLeader, { foreignKey: 'group_leader_id' });
    CustomerGroup.hasMany(models.Customer, { foreignKey: 'group_id' });
  };

  return CustomerGroup;
};