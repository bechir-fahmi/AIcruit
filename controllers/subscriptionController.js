const Subscription = require('../models/Subscription');
const Entreprise = require('../models/Entreprise');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createSubscription = async (req, res) => {
    try {
        const { entrepriseId, plan } = req.body;

        // Vérifier si l'entreprise existe
        const entreprise = await Entreprise.findById(entrepriseId);
        if (!entreprise) {
            return res.status(404).json({ message: "Entreprise non trouvée." });
        }

        // Associer le plan à un ID Stripe valide
        const planPrices = {
            free: process.env.STRIPE_FREE_PLAN_ID,   // ID configuré sur Stripe
            basic: process.env.STRIPE_BASIC_PLAN_ID,
            premium: process.env.STRIPE_PREMIUM_PLAN_ID
        };

        if (!planPrices[plan]) {
            return res.status(400).json({ message: "Plan invalide." });
        }

        // Créer un client Stripe
        const customer = await stripe.customers.create({
            metadata: { entrepriseId }
        });

        // Créer l'abonnement Stripe
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: planPrices[plan] }],  // Associer le bon ID Stripe
            payment_behavior: 'default_incomplete',
            expand: ['latest_invoice.payment_intent']
        });

        // Sauvegarder l'abonnement dans MongoDB
        const newSubscription = new Subscription({
            entreprise: entrepriseId,
            stripeCustomerId: customer.id,
            stripeSubscriptionId: subscription.id,
            plan,
            startDate: new Date(),
            status: subscription.status
        });

        await newSubscription.save();

        res.json({
            subscriptionId: subscription.id,
            clientSecret: subscription.latest_invoice.payment_intent.client_secret
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
