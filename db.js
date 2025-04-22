// db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 5,
//   queueLimit: 0,
// });

const pool = mysql.createPool({
  host: "mysql.gb.stackcp.com",
  port: 58164,
  user: "aleelo-353039380cf0",
  password: "aleelo123",
  database: "aleelo-353039380cf0",
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});


// Optional test connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL Pool connected");
    connection.release();
  } catch (err) {
    console.error("❌ MySQL connection error:", err.message);
  }
})();

export default pool;
