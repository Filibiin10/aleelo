// routes/paymentRoutes.js
import express from 'express';
import { checkPaymentStatusEDahab, checkPaymentStatusEVC } from '../services/paymentService.js';
import { makeEvcPayment } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/pay/edahab', async (req, res) => {
  const { phone, amount } = req.body;
  const url = await checkPaymentStatusEDahab(phone, amount);
  if (url) {
    res.json({ url });
  } else {
    res.status(500).json({ error: 'eDahab payment initiation failed' });
  }
});

router.post('/pay/evc', async (req, res) => {
  const { phone, amount, tokenID } = req.body;
  const result = await checkPaymentStatusEVC(phone, amount, tokenID);
  res.json(result);
});

router.post('/evc', makeEvcPayment);

export default router;
