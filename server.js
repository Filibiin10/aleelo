// server.js
import express from 'express';
import cors from 'cors';
import authRoutes from "./routes/authRoutes.js";
import domainRoutes from "./routes/domainRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import hostingRoutes from "./routes/hostingRoutes.js";
import db from "./db.js";

const app = express();
const PORT = 7000;

// === MIDDLEWARE === //
app.use(cors());
app.use(express.json());

// === ROUTES === //
app.use("/api/auth", authRoutes);
app.use("/api/domains", domainRoutes);
app.use("/api/users", userRoutes);
app.use("/api/hosting", hostingRoutes);

// === DATABASE TEST === //fghfth
db.getConnection((err) => {
  if (err) console.error("❌ MySQL Connection Failed:", err);
  else console.log("✅ MySQL Connected Successfully");
});

// === START SERVER === //
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
