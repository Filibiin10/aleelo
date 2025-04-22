import { createUser, getUserByEmail, getUserById, getUserByUserRef } from "../models/UserModel.js";
import { transporter } from '../utils/mailer.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const JWT_SECRET = "s3cr3t_k3y_f0r_JWT_t0kens";

// 🔹 Sign Up Controller
export const signUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      country,
      password,
      usereff
    } = req.body;

    const fullName = `${firstName} ${lastName}`;
    const companyName = `${firstName} Ltd`;
    const sp = "BN";
    const pc = "12345";
    const cc = country;
    const billing_ref = "auto-generated";

    // Check if user exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    await createUser({
      person_name: fullName,
      company_name: companyName,
      address,
      city,
      sp,
      pc,
      cc,
      voice: phone,
      billing_ref,
      email,
      usereff,
      password: hashedPassword // ✅ stored securely
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const countryCodeMap = {
  "United States": "US",
  Canada: "CA",
  "United Kingdom": "GB",
  Somalia: "SO",
};


export const checkOrCreateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address, city, country , password} = req.body;
    console.log(email)
    const countryCode = countryCodeMap[country] || "US";

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(200).json({
        message: "User already exists in database",
        userRef: existingUser.usereff,
      });
    }

    // 🔁 Create StackCP user
    const stackRes = await axios.post("http://localhost:7000/api/users/create", {
      person_name: `${firstName} ${lastName}`,
      company_name: `${firstName} Ltd`,
      address,
      city,
      sp: "BN",
      pc: "12345",
      cc: countryCode,
      voice: phone,
      billing_ref: "auto-generated",
      email,
    });

    const ref = stackRes.data?.data?.result?.ref;
    const passwordStack = stackRes.data?.data?.result?.password;
    const msg = stackRes.data?.message;

    if (!ref && msg === "ℹ️ StackCP user already exists") {
      return res.status(409).json({ message: "Email exists in StackCP but not in DB" });
    }

    // 💾 Save to SQL DB
    await createUser({
      person_name: `${firstName} ${lastName}`,
      company_name: `${firstName} Ltd`,
      address,
      city,
      sp: "BN",
      pc: "12345",
      cc: countryCode,
      voice: phone,
      billing_ref: "auto-generated",
      email,
      usereff: ref,
      password // optional: hash this if needed
    });

    // 📧 Send login info
    await transporter.sendMail({
      to: 'filibiinfanax10@gmail.com',
      subject: "Your StackCP Account Details",
      text: `Hi ${firstName},
    
    Your StackCP account has been created.
    
    Login Reference: ${ref}
    Password: ${passwordStack}
    
    Login here: https://portal.shiineuu.com/
    
    Please keep this information safe.
    
    Thank you!`,
      html: `
        <p>Hi ${firstName},</p>
        <p>Your StackCP account has been created.</p>
        <p><strong>Email :</strong> ${email}<br/>
        <strong>Password:</strong> ${passwordStack}</p>
        <strong> Login here: https://portal.shiineuu.com/</p>
        <p><a href="https://portal.shiineuu.com/" target="_blank">Click here to login</a></p>
        <p>Please keep this information safe.</p>
        <p>Thank you!</p>
      `
    });
    

    return res.status(201).json({
      message: "User created in both systems and email sent",
      userRef: ref
    });

  } catch (error) {
    console.error("❌ Server error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error?.message
    });
  }
};


// // 🔹 Login Controller
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find user
//     const user = await getUserByEmail(email);
//     console.log(email)
//     console.log(user.password);
//     console.log(bcrypt.compareSync(password, user?.password));

//     // Check if user exists and password is valid
//     if (!user || !bcrypt.compareSync(password, user.password)) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     // Generate JWT Token
//     const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

//     res.json({
//       message: "Login successful",
//       token,
//       user: {
//         id: user.id,
//         fullName: user.person_name,
//         email: user.email,
//         stackUserRef: user.usereff // ✅ Include user ref
//       },
//       fulluser : user
//     });

//   } catch (error) {
//     console.error("Login error:", error.message);
//     res.status(500).json({ error: error.message || "Server error" });
//   }
// };


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email); // Your DB query

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

    const isProduction = process.env.NODE_ENV === "production";

    // Set cookies
    res.cookie("userRef", user.usereff, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        fullName: user.person_name,
        email: user.email,
        stackUserRef: user.usereff,
      },
    });

  } catch (error) {
    res.status(500).json({ error: error.message || "Server error" });
    console.log(error)
  }
};

export const whoAmI = (req, res) => {
  const userRef = req.cookies.userRef;
  if (!userRef) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json({ userRef });
};

export const logout = (req, res) => {
  const isProduction = "production" === "production";

  res.clearCookie("userRef", {
    httpOnly: true,
    sameSite: "Strict",
    secure: isProduction,
    path: "/",
  });

  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Strict",
    secure: isProduction,
    path: "/",
  });

  res.json({ message: "Logged out successfully" });
};



// 🔹 Get Profile Controller (Protected Route)
export const getProfile = async (req, res) => {
  try {
    const user = await getUserById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const findUserByUserRef = async (req, res) => {
  const { userRef } = req.params;

  try {
    const userreff = `stack-user:${userRef}`
    // console.log(userreff)
    const user = await getUserByUserRef(userreff);
    // console.log(user)

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Add prefix to usereff
    // user.usereff = `stack-user:${user.usereff}`;

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
