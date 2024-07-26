const express = require('express');
const User = require('../models/user');
const router = express.Router();

// Update Compliance
router.post('/update', async (req, res) => {
    const { username, compliance } = req.body;
    try {
        const user = await User.findOne({ username });
        user.compliance = compliance;
        await user.save();
        res.status(200).send('Compliance updated successfully');
    } catch (error) {
        res.status(400).send('Error updating compliance');
    }
});

module.exports = router;

