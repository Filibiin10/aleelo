// controllers/userController.js
import axios from 'axios';

const API_KEY = 'YzA1NzllZjNmYjE1YzBmYjU';
const RESELLER_ID = '*';
const API_BASE = `https://api.20i.com/reseller/${RESELLER_ID}`;

const AUTH_HEADER = {
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  }
};

export const createStackUserHandler = async (req, res) => {
  try {
    const {
      person_name,
      company_name,
      address,
      voice,
      email,
      cc,
      pc,
      sp,
      city,
      extension,
      nominet_contact_type,
      billing_ref
    } = req.body;

    const payload = {
      newUser: {
        person_name,
        company_name: company_name || "",
        address,
        voice,
        email,
        cc,
        pc,
        sp,
        city,
        extension: extension || null,
        nominet_contact_type: nominet_contact_type || "",
        billing_ref: billing_ref || ""
      }
    };

    const response = await axios.post(`${API_BASE}/susers`, payload, AUTH_HEADER);

    // Extract values from 20i response
    const ref = response?.data?.result?.ref;
    const password = response?.data?.result?.password;

    console.log("✅ StackCP response:", response.data);

    return res.status(200).json({
      message: "✅ StackCP User created successfully",
      userRef: ref,
      passwordStack: password,
      data: response.data,
    });

  } catch (error) {
    const conflict = error?.response?.data?.error?.data?.conflict;

    if (conflict) {
      return res.status(200).json({
        message: "ℹ️ StackCP user already exists",
        data: {
          result: {
            updated: 0,
            ref: null
          }
        }
      });
    }

    console.error("❌ Failed to create StackCP user:", error?.response?.data || error.message);

    return res.status(500).json({
      error: "❌ Failed to create StackCP user",
      details: error?.response?.data || error.message
    });
  }
};

export const checkStackUserExistsHandler = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const response = await axios.post(
      `${API_BASE}/explicitStackUserCheck`,
      { email },
      AUTH_HEADER
    );

    const result = response.data?.result || null;

    if (!result) {
      return res.status(200).json({
        message: "❌ StackCP user does not exist",
        exists: false
      });
    }

    res.status(200).json({
      message: "✅ StackCP user check completed",
      exists: result
    });

  } catch (error) {
    res.status(500).json({
      error: "❌ Failed to check StackCP user",
      details: error?.response?.data || error.message
    });
  }
};

