require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());
app.use(express.static('public'));  // Serve your frontend from /public

const ORANGE_APP_ID = process.env.ORANGE_APP_ID;
const ORANGE_APP_SECRET = process.env.ORANGE_APP_SECRET;
const ORANGE_BASE_URL = process.env.ORANGE_BASE_URL;
const CALLBACK_URL = process.env.CALLBACK_URL;

// Helper: Get OAuth token for API auth
async function getAccessToken() {
  try {
    const response = await axios.post(`${ORANGE_BASE_URL}/oauth/v2/token`, 
      'grant_type=client_credentials', 
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${ORANGE_APP_ID}:${ORANGE_APP_SECRET}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Token error:', error.response?.data);
    throw error;
  }
}

// Endpoint: Create Orange Money Session
app.post('/create-session', async (req, res) => {
  const { amount, currency = 'XOF', customerPhone, description = 'Payment for order' } = req.body;  // e.g., { amount: 1000, customerPhone: '+22501234567' }

  try {
    const token = await getAccessToken();

    // Create payment request
    const paymentResponse = await axios.post(`${ORANGE_BASE_URL}/omoney/v1/payments`, {
      amount: amount,
      currency: currency,
      customer: { phone: customerPhone },
      description: description,
      redirectUrl: CALLBACK_URL  // Where user is redirected after payment
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Orange-App-Id': ORANGE_APP_ID
      }
    });

    const { sessionId, paymentUrl } = paymentResponse.data;  // Adjust fields based on exact API response

    // Redirect user to payment URL (or return it for frontend handling)
    res.json({ success: true, sessionId, paymentUrl });
    // Or: res.redirect(paymentUrl);  // Auto-redirect

  } catch (error) {
    console.error('Payment error:', error.response?.data);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Callback endpoint: Handle payment result from Orange
app.get('/payment-callback', async (req, res) => {
  const { sessionId, status, transactionId } = req.query;  // Params from Orange redirect

  if (status === 'SUCCESS') {
    // Update your DB: Mark order as paid
    console.log(`Payment successful! Transaction ID: ${transactionId}`);
    res.send('<h1>Payment Successful! Redirecting...</h1><script>window.location.href="/success";</script>');
  } else {
    console.log(`Payment failed: ${status}`);
    res.send('<h1>Payment Failed. Try again.</h1><a href="/">Back to Home</a>');
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
