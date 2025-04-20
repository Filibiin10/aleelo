// db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

let pool;

async function initDB() {
  try {
    pool = await mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
    });

    console.log("✅ MySQL Pool created");
    return pool;
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    return null;
  }
}

export default initDB;
