const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    studentId: { type: String }, // Added field for student ID
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    joinDate: { type: Date },
    dueDate: { type: Date },
});

// This part is crucial for hashing passwords on registration
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', UserSchema);