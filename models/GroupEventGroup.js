// models/GroupEventGroup.js
module.exports = (sequelize, DataTypes) => {
  const GroupEventGroup = sequelize.define('GroupEventGroup', {});

  GroupEventGroup.associate = (models) => {
    GroupEventGroup.belongsTo(models.GroupEvent, { foreignKey: 'event_id' });
    GroupEventGroup.belongsTo(models.Group, { foreignKey: 'group_id' });
  };

  return GroupEventGroup;
};
