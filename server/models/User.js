const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    phone: {
        type: String,
        default: ''
    },
    role: {
        type: Number,
        default: 0  // 0 = user, 1 = admin
    },
    history: {
        type: Array,
        default: []
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
