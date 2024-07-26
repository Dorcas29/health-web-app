const express = require('express');
const User = require('../models/user');
const router = express.Router();

// Add Notification
router.post('/add', async (req, res) => {
    const { username, notification } = req.body;
    try {
        const user = await User.findOne({ username });
        user.notifications.push(notification);
        await user.save();
        res.status(200).send('Notification added successfully');
    } catch (error) {
        res.status(400).send('Error adding notification');
    }
});

module.exports = router;

