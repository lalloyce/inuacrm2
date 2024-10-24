// models/Ticket.js
module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define('Ticket', {
    status: { type: DataTypes.ENUM('open', 'in_progress', 'closed'), defaultValue: 'open' },
    priority: { type: DataTypes.ENUM('low', 'medium', 'high'), defaultValue: 'medium' },
    subject: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Ticket.associate = (models) => {
    Ticket.belongsTo(models.Customer, { foreignKey: 'customer_id' });
    Ticket.belongsTo(models.User, { foreignKey: 'assigned_to' });
  };

  return Ticket;
};
