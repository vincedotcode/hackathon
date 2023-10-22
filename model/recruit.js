const mongoose = require('mongoose');

const recruitSchema = new mongoose.Schema({
    fullName: {
        type: String,
    
        trim: true
    },
    professionalSummary: {
        type: String,
    
        trim: true
    },
    workHistory: [
        {
            title: {
                type: String,
           
                trim: true
            },
            company: {
                type: String,
                
                trim: true
            },
            startDate: {
                type: String,
               
            },
            endDate: {
                type: String,
               
            },
            responsibilities: [
                {
                    type: String
                }
            ]
        }
    ],
    skills: [
        {
            type: String
        }
    ],
    contact: {
        address: {
            type: String,
           
            trim: true
        },
        phone: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            trim: true
        }
    },
    education: [
        {
            degree: {
                type: String,
               
                trim: true
            },
            school: {
                type: String,
             
                trim: true
            },
            year: {
                type: String,
                
            }
        }
    ],
    hobbies: [
        {
            type: String
        }
    ],
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
});

module.exports = mongoose.model('Recruit', recruitSchema);


