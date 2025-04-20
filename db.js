import mysql from "mysql2/promise";

// Create a database connection pool
const db = await mysql.createPool({
  host: "mysql.gb.stackcp.com",              // Host from 20i
  port: 58164,                                // ✅ Use correct port from 20i
  user: "aleelo-353039380cf0",            // Your MySQL username
  password: "aleelo123",             // Your MySQL password
  database: "aleelo-353039380cf0",
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});

// Test connection
try {
  const connection = await db.getConnection();
  console.log("✅ Connected to MySQL Database");
  connection.release();
} catch (err) {
  console.error("❌ Database connection failed:", err.message);
}

export default db;
