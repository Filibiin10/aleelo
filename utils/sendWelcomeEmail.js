// utils/sendWelcomeEmail.js
import nodemailer from 'nodemailer';

export async function sendWelcomeEmail({
  to,
  name,
  domain,
  datecreated,
  packagetype,
  password,
  cpurl,
  ftpusername,
  ftpserver,
  mailserver,
  webmailurl,
  supportUrl,
  supportEmail,
  brandName = "StackCP"
}) {
  // Setup transporter (use your real SMTP)
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "filibiinfanax10@gmail.com",
      pass: "urea honv bugs zmed", // Not your Gmail login password
    }    
  });

  // Email HTML content (simplified version)
  const html = `
    <h2>Welcome to your new hosting, ${name}</h2>
    <p><strong>Domain:</strong> ${domain}</p>
    <p><strong>Package Type:</strong> ${packagetype}</p>
    <p><strong>Created:</strong> ${datecreated}</p>
    <h3>Control Panel</h3>
    <p>URL: <a href="${cpurl}">${cpurl}</a></p>
    <p>Username: ${domain}</p>
    <p>Password: ${password}</p>
    <h3>FTP</h3>
    <p>Username: ${ftpusername}</p>
    <p>Server: ${ftpserver}</p>
    <h3>Email</h3>
    <p>Mail Server: ${mailserver}</p>
    <p>Webmail: <a href="${webmailurl}">${webmailurl}</a></p>
    <p>If you have any issues, contact us at <a href="${supportUrl}">${supportUrl}</a> or <a href="mailto:${supportEmail}">${supportEmail}</a></p>
  `;

  const mailOptions = {
    from: '"Sales Team" <sales@example.com>',
    to,
    subject: `Welcome to ${brandName} Hosting`,
    html
  };

  await transporter.sendMail(mailOptions);
}
