import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

async function initDB() {
  try {
    const pool = await mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      ssl: {
        rejectUnauthorized: false
      }
    });

    const [rows] = await pool.query('SELECT 1');
    console.log("✅ DB connection and query successful");

    return pool;
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    return null;
  }
}

export default initDB;
