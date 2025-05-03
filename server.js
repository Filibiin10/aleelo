// server.js
import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { OAuth2Client } from 'google-auth-library';
import authRoutes from "./routes/authRoutes.js";
import domainRoutes from "./routes/domainRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import hostingRoutes from "./routes/hostingRoutes.js";
import paymentRoutes from './routes/paymentRoutes.js';
import emailRoutes from './routes/emailRoutes.js';


const app = express();
const PORT = 7000;

// === MIDDLEWARE === //
// app.use(cors());
app.use(cors({
  origin: [
    "https://shiineuu.com",
    "http://localhost:5173",
    "http://localhost:5174"
  ],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// === ROUTES === //
app.use("/api/auth", authRoutes);
app.use("/api/domains", domainRoutes);
app.use("/api/users", userRoutes);
app.use("/api/hosting", hostingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/email', emailRoutes);


const client = new OAuth2Client("719009318816-d85q1a384d3rtq1g6hobllqpkspgfdli.apps.googleusercontent.com");

app.post('/api/auth/google', async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "719009318816-d85q1a384d3rtq1g6hobllqpkspgfdli.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();
    
    // Send user info back
    res.json({
      message: "Token verified successfully",
      user: {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        email_verified: payload.email_verified,
        picture: payload.picture,
        given_name: payload.given_name,
        family_name: payload.family_name,
        locale: payload.locale,
        iat: payload.iat,
        exp: payload.exp
      }
    });    

  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(401).json({ error: "Invalid token" });
  }
});



// === START SERVER === //
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
