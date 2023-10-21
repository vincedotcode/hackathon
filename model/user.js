const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: { 
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Entry Level', 'Associate', 'Mid-Level', 'Senior', 'Lead', 'Manager', 'Director', 'VP', 'C-level', 'Admin'],
        default: 'Entry Level'
    },
    dateJoined: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: Date,
});


const User = mongoose.model('User', employeeSchema);

module.exports = User;
