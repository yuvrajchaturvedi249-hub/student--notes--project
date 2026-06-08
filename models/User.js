const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isSubscribed: {
        type: Boolean,
        default: false
    },
    balance: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true // Isse account banane ki date aur time automatic save ho jata hai
});

module.exports = mongoose.model('User', userSchema);