const mongoose = require('mongoose');

const LinkTestSchema = new mongoose.Schema({
    test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
    candidateEmail: { type: String, required: true },
    uniqueLink: { type: String, required: true, unique: true },
    isUsed: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LinkTest', LinkTestSchema);
