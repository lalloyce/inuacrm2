const roleAuth = require('../middleware/roleAuth');
const { sendEmail } = require('../utils/notificationManager');

router.post('/approve-user', roleAuth(['admin']), async (req, res) => {
  const { userId, approved, role } = req.body;
  const user = await User.findById(userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  user.isActive = approved;
  if (role) {
    user.role = role;
  }
  await user.save();

  if (approved) {
    await sendEmail(user.email, 'Account Approved', 'Your account has been approved.');
  }

  res.json({ message: 'User updated successfully' });
});