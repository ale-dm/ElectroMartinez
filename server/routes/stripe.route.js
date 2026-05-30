const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const auth = require('../middleware/auth');

// @route   POST api/stripe/create-payment-intent
// @desc    Create payment intent for specific payment method
// @access  Private
router.post('/create-payment-intent', auth, async (req, res) => {
    try {
        const { amount, paymentMethodType } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ msg: 'Cantidad inválida' });
        }

        // Mapeo de tipos de pago específicos
        const paymentMethodTypesMap = {
            'card': ['card'],
            'paypal': ['paypal'],
            'revolut_pay': ['revolut_pay'],
            'google_pay': ['card'],
            'apple_pay': ['card']
        };

        const paymentMethods = paymentMethodTypesMap[paymentMethodType] || ['card'];

        // Crear Payment Intent con método específico
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'eur',
            payment_method_types: paymentMethods,
            metadata: {
                userId: req.user.id,
                paymentMethodType: paymentMethodType
            }
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        console.error('❌ Error creating payment intent:', error);
        res.status(500).json({ msg: 'Error al crear payment intent', error: error.message });
    }
});

module.exports = router;
