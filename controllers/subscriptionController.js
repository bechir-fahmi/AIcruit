const Subscription = require('../models/Subscription');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createSubscription = async (req, res) => {
    try {
        const { entrepriseId, plan } = req.body;
        // Logique de création d'abonnement avec Stripe
        // ...
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Autres méthodes nécessaires... 