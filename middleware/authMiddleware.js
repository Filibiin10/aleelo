import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET ="s3cr3t_k3y_f0r_JWT_t0kens";

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.token; // 🍪 Get token from cookie named "token"
  console.log(token)

  if (!token) {
    return res.status(403).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
