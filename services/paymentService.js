// paymentService.js
import axios from 'axios';
import crypto from 'crypto';

export async function checkPaymentStatusEDahab(phone, amount) {
  const apiKey = 'zNonWMHxh23FkA56n31EbAQj6n31EbAQjBig4tur';
  const agentCode = '090064';
  const returnUrl = 'https://gurmad.so';
  const secret = '3fwee9d935ce63a59404acb8e10aaab44faf2055';

  const payload = {
    apiKey,
    edahabNumber: phone,
    amount,
    agentCode,
    returnUrl
  };

  const jsonPayload = JSON.stringify(payload);
  const hash = crypto.createHash('sha256').update(jsonPayload + secret).digest('hex');
  const url = `https://edahab.net/api/api/IssueInvoice?hash=${hash}`;

  try {
    const response = await axios.post(url, payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    const invoiceID = response.data?.InvoiceId;
    if (!invoiceID) throw new Error('InvoiceId not returned');

    return `https://edahab.net/API/Payment?invoiceId=${invoiceID}`;
  } catch (error) {
    console.error('❌ eDahab error:', error?.response?.data || error.message);
    return null;
  }
}

export async function checkPaymentStatusEVC(phone, amount, tokenID) {
  const url = 'https://api.waafipay.net/asm';
  const date = new Date().toISOString().replace('T', ' ').split('.')[0];

  const payload = {
    schemaVersion: '1.0',
    requestId: `${Date.now()}`,
    timestamp: date,
    channelName: 'WEB',
    serviceName: 'API_PURCHASE',
    serviceParams: {
      merchantUid: 'M0912116',
      apiUserId: '1004459',
      apiKey: 'API-1667015408AHX',
      paymentMethod: 'MWALLET_ACCOUNT',
      payerInfo: {
        accountNo: phone
      },
      transactionInfo: {
        referenceId: tokenID,
        invoiceId: `INV0${tokenID}`,
        amount: amount.toString(),
        currency: 'USD',
        description: 'Taakuleynta Walaalaha Turkiya'
      }
    }
  };

  try {
    const response = await axios.post(url, payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    const resData = response.data;
    const status = resData?.responseMsg === '2001' ? 1 : 0;

    return {
      status,
      response: resData
    };
  } catch (error) {
    console.error('❌ eVC error:', error?.response?.data || error.message);
    return {
      status: 0,
      response: null
    };
  }
}
