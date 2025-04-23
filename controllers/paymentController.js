// controllers/paymentController.js
import axios from 'axios';

export const makeEvcPayment = async (req, res) => {
  const { phone, tokenID, amount, description } = req.body;

  const date = new Date().toISOString();

  const data = {
    schemaVersion: "1.0",
    requestId: Date.now().toString(),
    timestamp: date,
    channelName: "WEB",
    serviceName: "API_PURCHASE",
    serviceParams: {
      merchantUid: "M0910155",
      apiUserId: "1000132",
      apiKey: "API-1343643943AHX",
      paymentMethod: "MWALLET_ACCOUNT",
      payerInfo: {
        accountNo: phone,
      },
      transactionInfo: {
        referenceId: tokenID,
        invoiceId: `INV0${tokenID}`,
        amount: amount,
        currency: "USD",
        description: description,
      },
    },
  };

  try {
    const response = await axios.post('https://api.waafipay.net/asm', data, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status === 200) {
      res.json(response.data);
    } else {
      console.error('Payment failed:', response.data);
      res.status(400).json({ message: 'Payment failed, please try again.' });
    }
  } catch (error) {
    console.error('Error during payment:', error);
    res.status(500).json({ error: error.toString() });
  }
};
