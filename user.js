const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    notifications: [
        {
            date: { type: Date, required: true },
            time: { type: String, required: true },
            specialOrders: { type: String }
        }
    ],
    compliance: {
        percentage: { type: Number, default: 0 },
        pillCount: { type: Number, default: 0 }
    }
});

module.exports = mongoose.model('User', userSchema);

