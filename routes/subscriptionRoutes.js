const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { validateInput } = require('../utils/validateInput');

// Routes de gestion des abonnements
router.post('/create-subscription', authMiddleware, roleMiddleware(['admin', 'recruiter']), validateInput, subscriptionController.createSubscription);
router.get('/plans', subscriptionController.getSubscriptionPlans);
router.get('/my-subscription', authMiddleware, subscriptionController.getCurrentSubscription);

// Routes Stripe
router.post('/create-checkout-session', authMiddleware, subscriptionController.createCheckoutSession);
router.post('/webhook', express.raw({type: 'application/json'}), subscriptionController.handleStripeWebhook);
router.post('/cancel-subscription', authMiddleware, subscriptionController.cancelSubscription);
router.post('/update-subscription', authMiddleware, subscriptionController.updateSubscription);

// Routes de facturation
router.get('/invoices', authMiddleware, subscriptionController.getInvoices);
router.get('/payment-methods', authMiddleware, subscriptionController.getPaymentMethods);
router.post('/add-payment-method', authMiddleware, subscriptionController.addPaymentMethod);

module.exports = router; 