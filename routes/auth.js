/**
 * Middleware imports
 */
const roleAuth = require('../middleware/roleAuth');
const { sendEmail } = require('../utils/notificationManager');

/**
 * Route to approve a user
 * 
 * This route is protected by the roleAuth middleware, allowing only admins to access it.
 * It updates a user's isActive status and role if provided, and sends an email notification
 * if the user is approved.
 * 
 * @param {NextFunction} req - The request object
 * @param {Response} res - The response object
 */
router.post('/approve-user', roleAuth(['admin']), async (req, res) => {
  /**
   * Extracting userId, approved status, and role from the request body
   */
  const { userId, approved, role } = req.body;
  /**
   * Finding the user by their ID
   */
  const user = await User.findById(userId);
  
  /**
   * If the user is not found, return a 404 error
   */
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  /**
   * Updating the user's isActive status and role if provided
   */
  user.isActive = approved;
  if (role) {
    user.role = role;
  }
  await user.save();

  /**
   * Sending an email notification if the user is approved
   */
  if (approved) {
    await sendEmail(user.email, 'Account Approved', 'Your account has been approved.');
  }

  /**
   * Returning a success message
   */
  res.json({ message: 'User updated successfully' });
});