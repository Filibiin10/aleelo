// controllers/domainController.js
import axios from 'axios';
import db from '../db.js';

const API_TOKEN = 'Bearer Y2FjOTY3N2IzYWY1MzEzNDk';
const API_KEY = 'YzA1NzllZjNmYjE1YzBmYjU';
const RESELLER_ID = '*';
const RESELLER_API_URL = `https://api.20i.com/reseller/${RESELLER_ID}`;
const DOMAIN_SEARCH_URL = 'https://api.20i.com/domain-search';
const MOCK_DOMAIN_URL = 'https://private-anon-dbd1050e12-20i.apiary-mock.com/reseller/1';
const MOCK_TRANSFER_URL = 'https://private-anon-f92285cc66-20i.apiary-mock.com/reseller/1/transferDomain';
const TRANSFER_URL = 'https://api.20i.com/reseller/*/transferDomain';

export const registerDomainHandler = async (req, res) => {
  try {
    const response = await axios.post(`${RESELLER_API_URL}/addDomain`, req.body, {
      headers: {
        Authorization: API_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error registering domain', error: error.message });
  }
};

export const transferDomainHandler = async (req, res) => {
  const { domainName, contactDetails, authCode } = req.body;
  try {
    const response = await axios.post(`${MOCK_TRANSFER_URL}`, {
      name: domainName,
      years: 1,
      contact: contactDetails,
      emulateYears: true,
      authcode: authCode,
      nameservers: ["ns1.stackdns.com", "ns2.stackdns.com"],
      privacyService: true,
      stackUser: null
    }, {
      headers: {
        Authorization: API_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error transferring domain', error: error.message });
    console.log(error);
  }
};

export const getAccountBalanceHandler = async (req, res) => {
  try {
    const response = await axios.get(`${RESELLER_API_URL}/accountBalance`, {
      headers: { Authorization: API_TOKEN }
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching account balance' });
  }
};

export const searchDomainHandler = async (req, res) => {
  const { domain } = req.params;
  try {
    const response = await axios.get(`${DOMAIN_SEARCH_URL}/${domain}`, {
      headers: { Authorization: `Bearer ${API_KEY}` }
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch domain data' });
  }
};

export const getPackageTypesHandler = async (req, res) => {
  try {
    const response = await axios.get(`${RESELLER_API_URL}/packageTypes`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    const filtered = response.data.filter(pkg => ["Basic", "Professional", "Enterprise"].includes(pkg.label));
    res.status(200).json(filtered);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch package types' });
  }
};

export const mockAddDomainHandler = async (req, res) => {
  const { domainName, fullName, email, phone, address, city, country ,userRef } = req.body;
  const payload = {
    name: domainName,
    years: 1,
    caRegistryAgreement: true,
    contact: {
      organisation: 'Aleelo Solutions',
      name: fullName,
      address,
      telephone: phone,
      email,
      cc: country,
      pc: '000',
      sp: '',
      city,
      extension: {}
    },
    nameservers: [],
    privacyService: true,
    stackUser: userRef
  };
  try {
    const response = await axios.post(`${MOCK_DOMAIN_URL}/addDomain`, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: API_TOKEN
      }
    });
    res.status(200).json({ success: true, message: 'Domain added successfully', data: response.data });
    console.log(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add domain', details: error.message });
    console.log(error);
  }
};

export const renewDomainHandler = async (req, res) => {
  const { name, years, renewPrivacy } = req.body;
  console.log(req.body);
  try {
    const response = await axios.post(
      `${RESELLER_API_URL}/renewDomain`,
      { name, years, renewPrivacy },
      {
        headers: {
          Authorization: API_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Renewal error:', error?.response?.data);

    const message = error?.response?.data?.error?.message || 'Unknown error during renewal';

    res.status(500).json({ message });
  }
};

// Save a new domain and its hosting package info
export const saveDomain = async (req, res) => {
  const { domain_name, package_id, user_ref, email } = req.body;

  if (!domain_name || !package_id) {
    return res.status(400).json({ success: false, message: "Domain name and package ID are required." });
  }

  try {
    await db.execute(
      `INSERT INTO domains (domain_name, package_id, user_ref, email) VALUES (?, ?, ?, ?)`,
      [domain_name, package_id, user_ref || null, email || null]
    );

    res.status(200).json({ success: true, message: "Domain saved successfully." });
  } catch (err) {
    console.error("Error saving domain:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Retrieve domain details by domain name
export const getDomainByName = async (req, res) => {
  const { domain_name } = req.params;

  if (!domain_name) {
    return res.status(400).json({ success: false, message: "Domain name is required." });
  }

  try {
    const [rows] = await db.execute(`SELECT * FROM domains WHERE domain_name = ?`, [domain_name]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Domain not found." });
    }

    res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("Error retrieving domain:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
