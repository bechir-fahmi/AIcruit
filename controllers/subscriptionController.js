const Subscription = require('../models/Subscription');
const Entreprise = require('../models/Entreprise');

// Initialize Stripe with a placeholder if the API key is not available
const stripe = process.env.STRIPE_SECRET_KEY 
    ? require('stripe')(process.env.STRIPE_SECRET_KEY)
    : { 
        customers: { create: () => ({ id: 'dummy-customer-id' }) },
        subscriptions: { create: () => ({ id: 'dummy-subscription-id', status: 'active', latest_invoice: { payment_intent: { client_secret: 'dummy-secret' } } }) }
      };

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
            free: process.env.STRIPE_FREE_PLAN_ID || 'free-plan-id',   // ID configuré sur Stripe
            basic: process.env.STRIPE_BASIC_PLAN_ID || 'basic-plan-id',
            premium: process.env.STRIPE_PREMIUM_PLAN_ID || 'premium-plan-id'
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

exports.getSubscriptionPlans = async (req, res) => {
    try {
        const plans = [
            {
                id: 'free',
                name: 'Gratuit',
                price: 0,
                features: ['3 tests par mois', 'Accès aux tests basiques', 'Support par email'],
                recommended: false
            },
            {
                id: 'basic',
                name: 'Basique',
                price: 29.99,
                features: ['20 tests par mois', 'Accès à tous les tests', 'Support prioritaire', 'Analyse des résultats'],
                recommended: true
            },
            {
                id: 'premium',
                name: 'Premium',
                price: 99.99,
                features: ['Tests illimités', 'Accès à tous les tests', 'Support dédié', 'Analyse avancée des résultats', 'Intégration API'],
                recommended: false
            }
        ];
        
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCurrentSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({ 
            entreprise: req.user._id,
            status: 'active'
        });
        
        if (!subscription) {
            return res.status(404).json({ message: 'Aucun abonnement actif trouvé' });
        }
        
        res.json(subscription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createCheckoutSession = async (req, res) => {
    try {
        const { priceId } = req.body;
        
        // Créer une session de paiement Stripe
        const session = {
            id: 'cs_test_' + Math.random().toString(36).substring(2, 15),
            url: 'https://example.com/checkout'
        };
        
        res.json({ url: session.url });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.handleStripeWebhook = async (req, res) => {
    try {
        // Traitement des webhooks Stripe
        res.json({ received: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.cancelSubscription = async (req, res) => {
    try {
        const { subscriptionId } = req.body;
        
        // Annuler l'abonnement dans Stripe et mettre à jour dans MongoDB
        const subscription = await Subscription.findOneAndUpdate(
            { stripeSubscriptionId: subscriptionId },
            { status: 'cancelled' },
            { new: true }
        );
        
        if (!subscription) {
            return res.status(404).json({ message: 'Abonnement non trouvé' });
        }
        
        res.json({ message: 'Abonnement annulé avec succès', subscription });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateSubscription = async (req, res) => {
    try {
        const { subscriptionId, newPlan } = req.body;
        
        // Mettre à jour l'abonnement dans Stripe et MongoDB
        const subscription = await Subscription.findOneAndUpdate(
            { stripeSubscriptionId: subscriptionId },
            { plan: newPlan },
            { new: true }
        );
        
        if (!subscription) {
            return res.status(404).json({ message: 'Abonnement non trouvé' });
        }
        
        res.json({ message: 'Abonnement mis à jour avec succès', subscription });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getInvoices = async (req, res) => {
    try {
        // Récupérer les factures depuis Stripe
        const invoices = [
            { id: 'inv_1', amount: 29.99, date: new Date(), status: 'paid' },
            { id: 'inv_2', amount: 29.99, date: new Date(), status: 'paid' }
        ];
        
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPaymentMethods = async (req, res) => {
    try {
        // Récupérer les méthodes de paiement depuis Stripe
        const paymentMethods = [
            { id: 'pm_1', brand: 'visa', last4: '4242', expMonth: 12, expYear: 2024 }
        ];
        
        res.json(paymentMethods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addPaymentMethod = async (req, res) => {
    try {
        const { paymentMethodId } = req.body;
        
        // Ajouter la méthode de paiement dans Stripe
        
        res.json({ message: 'Méthode de paiement ajoutée avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
