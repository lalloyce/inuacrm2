/**
 * User model definition.
 *
 * This model represents a user in the system and includes fields for email, password, full name, role,
 * verification status, avatar, last login, and login count. It also defines associations with other models.
 *
 * @param {object} sequelize - The Sequelize instance.
 * @param {object} DataTypes - The data types provided by Sequelize.
 * @returns {object} - The User model.
 */
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('customer_service', 'sales_manager', 'group_coordinator', 'other_manager', 'admin'),
      allowNull: false
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    verificationToken: {
      type: DataTypes.STRING
    },
    avatar: {
      type: DataTypes.STRING
    },
    lastLogin: {
      type: DataTypes.DATE
    },
    loginCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });

  /**
   * Define associations for the User model.
   *
   * @param {object} models - The models to associate with.
   */
  User.associate = (models) => {
    User.hasMany(models.Session);
    User.hasMany(models.GroupEvent, { foreignKey: 'created_by' });
    User.hasMany(models.AuditLog, { foreignKey: 'userId' });
  };

  return User;
};