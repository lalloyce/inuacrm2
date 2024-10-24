// models/GroupEventAttendee.js
module.exports = (sequelize, DataTypes) => {
  const GroupEventAttendee = sequelize.define('GroupEventAttendee', {
    attended: { type: DataTypes.BOOLEAN, defaultValue: false }
  });

  GroupEventAttendee.associate = (models) => {
    GroupEventAttendee.belongsTo(models.GroupEvent, { foreignKey: 'event_id' });
    GroupEventAttendee.belongsTo(models.Customer, { foreignKey: 'customer_id' });
  };

  return GroupEventAttendee;
};
