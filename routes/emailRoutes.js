import express from 'express';
import { sendWelcomeEmail } from '../utils/sendWelcomeEmail.js';

const router = express.Router();
// routes/emailRoutes.js
router.post('/welcome', async (req, res) => {
    const { to } = req.body;
  
    if (!to || typeof to !== "string" || !to.includes("@")) {
      return res.status(400).json({ error: "Invalid or missing 'to' email address" });
    }
  
    try {
      await sendWelcomeEmail(req.body);
      res.status(200).json({ success: true });
    } catch (err) {
      console.error('Email failed:', err);
      res.status(500).json({ error: 'Failed to send welcome email' });
    }
  });
  
export default router;
