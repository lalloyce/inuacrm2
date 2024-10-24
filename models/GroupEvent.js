// models/GroupEvent.js
module.exports = (sequelize, DataTypes) => {
  const GroupEvent = sequelize.define('GroupEvent', {
    eventType: { type: DataTypes.ENUM('arrears_meeting', 'formation_meeting', 'training_meeting'), allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    eventDate: { type: DataTypes.DATE, allowNull: false },
    startTime: { type: DataTypes.TIME },
    endTime: { type: DataTypes.TIME },
    subLocation: { type: DataTypes.STRING, allowNull: false },
    ward: { type: DataTypes.STRING, allowNull: false },
    county: { type: DataTypes.ENUM('Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita/Taveta', 'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Meru', 'Tharaka-Nithi', 'Embu', 'Kitui', 'Machakos', 'Makueni', 'Nyandarua', 'Nyeri', 'Kirinyaga', 'Murang\'a', 'Kiambu', 'Turkana', 'West Pokot', 'Samburu', 'Trans Nzoia', 'Uasin Gishu', 'Elgeyo/Marakwet', 'Nandi', 'Baringo', 'Laikipia', 'Nakuru', 'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Kakamega', 'Vihiga', 'Bungoma', 'Busia', 'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira', 'Nairobi City'), allowNull: false },
    status: { type: DataTypes.ENUM('planned', 'in_progress', 'completed', 'cancelled'), defaultValue: 'planned' }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  GroupEvent.associate = (models) => {
    GroupEvent.belongsTo(models.User, { foreignKey: 'created_by' });
    GroupEvent.hasMany(models.GroupEventAttendee, { foreignKey: 'event_id' });
    GroupEvent.hasMany(models.GroupEventGroup, { foreignKey: 'event_id' });
  };

  return GroupEvent;
};
