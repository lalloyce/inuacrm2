const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models/user'); // Adjust the path according to your project structure
const { sendPasswordResetConfirmationEmail } = require('../utils/email'); // Adjust the path to the email utility
const router = express.Router();

router.post('/', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        await user.update({ password: hashedPassword });

        // Send password reset confirmation email
        sendPasswordResetConfirmationEmail(email);

        // Successful password reset
        res.status(200).json({ success: true, message: 'Password has been reset successfully.' });

    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ error: 'An error occurred during password reset.' });
    }
});

module.exports = router;
