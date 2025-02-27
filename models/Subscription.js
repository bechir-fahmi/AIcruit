const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    entreprise: { type: mongoose.Schema.Types.ObjectId, ref: 'Entreprise', required: true },
    plan: { type: String, enum: ['free', 'basic', 'premium'], required: true },
    testsRemaining: { type: Number, default: 3 }, // Pour le plan gratuit
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    status: { type: String, enum: ['active', 'cancelled', 'expired'], default: 'active' },
    paymentHistory: [{
        amount: Number,
        date: Date,
        status: String
    }]
});

module.exports = mongoose.model('Subscription', SubscriptionSchema); 