import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();


export const transporter = nodemailer.createTransport({
  service: 'gmail', // Or use "Mailgun", "SendGrid", "Outlook", etc.
  auth: {
    user: process.env.MAIL_USER, // Your email
    pass: process.env.MAIL_PASS  // App password (not your email password)
  }
});
