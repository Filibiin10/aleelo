import db from '../db.js'; // ✅ This is the pool instance
import bcrypt from "bcryptjs";

// Create User
export const createUser = async ({
  person_name,
  company_name,
  address,
  city,
  sp,
  pc,
  cc,
  voice,
  billing_ref,
  email,
  usereff,
  password
}) => {
  const hashedPassword = bcrypt.hashSync(password, 10);

  const query = `
    INSERT INTO users (
      person_name,
      company_name,
      address,
      city,
      sp,
      pc,
      cc,
      voice,
      billing_ref,
      email,
      usereff,
      password
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    person_name,
    company_name,
    address,
    city,
    sp,
    pc,
    cc,
    voice,
    billing_ref,
    email,
    usereff,
    hashedPassword
  ];

  await db.execute(query, values); // ✅ use db instead of initDB
};

// Find User by Email
export const getUserByEmail = async (email) => {
  const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
  return users.length > 0 ? users[0] : null;
};

// Get User by ID
export const getUserById = async (id) => {
  const [users] = await db.execute(
    "SELECT id, person_name AS fullName, email, phone FROM users WHERE id = ?",
    [id]
  );
  return users.length > 0 ? users[0] : null;
};

// Get User by usereff
export const getUserByUserRef = async (userRef) => {
  try {
    console.log("Searching for usereff =", userRef);
    const [rows] = await db.query("SELECT * FROM users WHERE usereff = ?", [String(userRef)]);
    console.log("Query Result:", rows);
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error("Error fetching user by usereff:", err.message);
    throw err;
  }
};
