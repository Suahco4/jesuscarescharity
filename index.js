require('dotenv').config();
const express = require('express');
const cors = require('cors');
// Initialize Stripe with your secret key
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To parse JSON bodies
app.use(express.static(__dirname)); // Serve static files from the root directory
// The /create-payment endpoint
app.post('/create-payment', async (req, res) => {
    try {
        const { amount, name, email } = req.body;

        // Create a Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd', // Change to your desired currency
                    product_data: {
                        name: 'Donation to Jesus Cares Charity',
                        images: [`${req.protocol}://${req.get('host')}/img/logo.png`], // Optional: shows logo on checkout page
                    },
                    unit_amount: Math.round(amount * 100), // Amount in cents
                },
                quantity: 1,
            }],
            mode: 'payment',
            customer_email: email, // Pre-fills the email field on the checkout page
            success_url: `${req.protocol}://${req.get('host')}/success.html?session_id={CHECKOUT_SESSION_ID}`, // Redirect URL on successful payment
            cancel_url: `${req.protocol}://${req.get('host')}/projects.html`, // Redirect URL if the user cancels
        });

        // Send the session URL back to the frontend
        res.json({ paymentLink: session.url });

    } catch (error) {
        console.error('Error creating payment session:', error);
        res.status(500).json({ error: 'Failed to create payment session.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});