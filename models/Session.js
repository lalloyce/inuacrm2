// models/Session.js
module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define('Session', {
    sessionId: { type: DataTypes.STRING, primaryKey: true },
    expires: { type: DataTypes.DATE, allowNull: false },
    data: { type: DataTypes.TEXT, allowNull: false }
  }, {
    timestamps: true,
    createdAt: 'created_at'
  });

  Session.associate = (models) => {
    Session.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Session;
};
