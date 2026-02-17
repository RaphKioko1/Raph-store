// server.js
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors()); // allow frontend requests

// M-Pesa Sandbox Credentials
const consumerKey = 'YOUR_CONSUMER_KEY';
const consumerSecret = 'YOUR_CONSUMER_SECRET';
const shortCode = '174379'; // Sandbox Business Shortcode
const passkey = 'YOUR_PASSKEY';

// Generate OAuth token
async function getAccessToken() {
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    const { data } = await axios.get(
        'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        { headers: { Authorization: `Basic ${auth}` } }
    );
    return data.access_token;
}

// STK Push Endpoint
app.post('/pay', async (req, res) => {
    const { phone, amount } = req.body;

    try {
        const token = await getAccessToken();
        const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
        const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');

        const payload = {
            BusinessShortCode: shortCode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: amount,
            PartyA: phone,
            PartyB: shortCode,
            PhoneNumber: phone,
            CallBackURL: "https://yourdomain.com/callback", // sandbox demo, can be localhost
            AccountReference: "RaphShoes",
            TransactionDesc: "Shoe Purchase"
        };

        const response = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        res.json(response.data);
    } catch (err) {
        res.status(500).json(err.response.data);
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
