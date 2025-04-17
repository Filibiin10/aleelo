import mysql from "mysql2/promise";

// Create a database connection pool
const db = await mysql.createPool({
  host: "localhost",       // Change if needed
  user: "root",            // Change based on your DB setup
  password: "",            // Add your MySQL password
  database: "aleelo",
  waitForConnections: true,
  connectionLimit: 10,     // Maximum number of connections
  queueLimit: 0
});

// Test connection
try {
  const connection = await db.getConnection();
  console.log("Connected to MySQL Database ✅");
  connection.release();
} catch (err) {
  console.error("Database connection failed:", err.message);
}

export default db;
