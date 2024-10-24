// models/Group.js
module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    groupName: { type: DataTypes.STRING, allowNull: false },
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Group.associate = (models) => {
    Group.hasMany(models.GroupLeader);
    Group.hasMany(models.GroupSalesContract);
  };

  return Group;
};
