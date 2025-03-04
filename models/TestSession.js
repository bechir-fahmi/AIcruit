const mongoose = require('mongoose');

const TestSessionSchema = new mongoose.Schema({
    candidateTest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CandidateTest',
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date
    },
    status: {
        type: String,
        enum: ['in_progress', 'paused', 'completed', 'terminated'],
        default: 'in_progress'
    },
    browserInfo: {
        browser: String,
        version: String,
        os: String,
        device: String
    },
    ipAddress: {
        type: String
    },
    proctorEvents: [
        {
            type: {
                type: String,
                enum: ['tab_switch', 'window_blur', 'copy_paste', 'multiple_faces', 'no_face', 'suspicious_movement']
            },
            timestamp: {
                type: Date,
                default: Date.now
            },
            data: {
                type: mongoose.Schema.Types.Mixed
            }
        }
    ],
    notes: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('TestSession', TestSessionSchema); 