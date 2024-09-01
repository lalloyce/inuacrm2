const User = require('./User');
const Session = require('./Session');
const GroupLeader = require('./GroupLeader');
const GroupEvent = require('./GroupEvent');
const GroupEventAttendee = require('./GroupEventAttendee');
const GroupEventGroup = require('./GroupEventGroup');

// Define associations
User.hasMany(Session);
Session.belongsTo(User);

User.hasMany(GroupEvent, { foreignKey: 'created_by' });
GroupEvent.belongsTo(User, { foreignKey: 'created_by' });

GroupEvent.hasMany(GroupEventAttendee);
GroupEventAttendee.belongsTo(GroupEvent);

GroupEvent.hasMany(GroupEventGroup);
GroupEventGroup.belongsTo(GroupEvent);

// Export models
module.exports = {
  User,
  Session,
  GroupLeader,
  GroupEvent,
  GroupEventAttendee,
  GroupEventGroup,
};
