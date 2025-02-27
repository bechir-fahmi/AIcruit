const mongoose = require('mongoose');

const TestSessionSchema = new mongoose.Schema({
    candidateTest: { type: mongoose.Schema.Types.ObjectId, ref: 'CandidateTest', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    windowSwitches: { type: Number, default: 0 },
    suspiciousActions: [{
        type: { type: String, enum: ['copy', 'paste', 'window_switch', 'inactivity'] },
        timestamp: Date,
        details: String
    }],
    recordingUrl: String, // Pour le lien de l'enregistrement webcam/écran
    status: { type: String, enum: ['ongoing', 'completed', 'suspended'], default: 'ongoing' }
});

module.exports = mongoose.model('TestSession', TestSessionSchema); 