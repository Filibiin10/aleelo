import db from "../db.js";
import bcrypt from "bcryptjs";

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
  const hashedPassword = bcrypt.hashSync(password, 10); // Still hash it, good practice

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


  await db.execute(query, values);
};


// Find User by Email
export const getUserByEmail = async (email) => {
  const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
  return users.length > 0 ? users[0] : null;
};

// Get User Profile
export const getUserById = async (id) => {
  const [users] = await db.execute("SELECT id, fullName, email, phone FROM users WHERE id = ?", [id]);
  return users.length > 0 ? users[0] : null;
};
