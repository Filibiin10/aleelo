import express from 'express';
import axios from 'axios';
import cors from 'cors';
import db from "./db.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = 7000;

// Enable CORS for all origins
app.use(cors());

// JSON parsing middleware
app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);


const API_TOKEN = 'Bearer Y2FjOTY3N2IzYWY1MzEzNDk';  // Replace with your actual API token
const RESELLER_ID = '*';  // Replace with your actual reseller ID




// Function to transfer domain
const transferDomain = async (domainName, contactDetails, authCode) => {
  try {
    const response = await axios.post(`https://api.20i.com/reseller/${RESELLER_ID}/transferDomain`, {
      name: domainName,
      years: 1,
      contact: contactDetails,
      emulateYears: true,
      authcode: authCode,
      nameservers: ["ns1.stackdns.com", "ns2.stackdns.com"],
      privacyService: true,
      stackUser: null,
    }, {
      headers: {
        'Authorization': API_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    console.log('Domain Transfer Response:', response.data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error?.message || error.message || "Unknown error";
    
    console.error('Error transferring domain:', errorMessage);

    throw new Error(errorMessage);
  }
};

// Function to get account balance
const getAccountBalance = async () => {
  try {
    const response = await axios.get(`https://api.20i.com/reseller/${RESELLER_ID}/accountBalance`, {
      headers: {
        'Authorization': API_TOKEN,
      },
    });

    console.log('Account Balance:', response.data);
    return response.data;  // Returning the account balance to be sent in the response
  } catch (error) {
    console.error('Error fetching account balance:', error.response ? error.response.data : error.message);
    throw new Error('Error fetching account balance');
  }
};

// Function to add hosting package

const registerDomain = async (domainData) => {
  try {
    const response = await axios.post(`https://api.20i.com/reseller/${RESELLER_ID}/addDomain`, {
      name: domainData.name,
      years: domainData.years,
      caRegistryAgreement: domainData.caRegistryAgreement,
      contact: domainData.contact,
      limits: domainData.limits,
      otherContacts: domainData.otherContacts,
      nameservers: domainData.nameservers,
      privacyService: domainData.privacyService,
      stackUser: domainData.stackUser,
    }, {
      headers: {
        'Authorization': API_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    console.log('Domain Registration Response:', response.data);
    return response.data;  // Return the domain registration response
  } catch (error) {
    console.error('Error registering domain:', error.response ? error.response.data : error.message);
    throw new Error('Error registering domain');
  }
};

// API Endpoint to register domain
app.post('/register-domain', async (req, res) => {
  const { name, years, caRegistryAgreement, contact, limits, otherContacts, nameservers, privacyService, stackUser } = req.body;

  try {
    const domainData = {
      name,
      years,
      caRegistryAgreement,
      contact,
      limits,
      otherContacts,
      nameservers,
      privacyService,
      stackUser,
    };

    const registrationResponse = await registerDomain(domainData);
    res.status(200).json(registrationResponse);  // Send the domain registration response
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Transfer Domain
app.post('/transfer-domain', async (req, res) => {
  const { domainName, contactDetails, authCode } = req.body;
  try {
    const transferResponse = await transferDomain(domainName, contactDetails, authCode);
    res.status(200).json(transferResponse);  // Sending transfer domain response
  } catch (error) {
    res.status(500).json({ message: error.message});
  }
});

// Get Account Balance
app.get('/get-account-balance', async (req, res) => {
  try {
    const accountBalance = await getAccountBalance();
    res.status(200).json(accountBalance);  // Sending account balance in the response
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Call the function
const packageId = "254856";  // Replace with actual package ID
const token = 'YzE4ZjdiMjFjNGFiZjE3MTE';  // Replace with your actual API token
// getInstalledApplications(packageId, token);

app.get("/api/domain-search/:domain", async (req, res) => {
  const domain = req.params.domain;

  try {
    const response = await axios.get(`https://api.20i.com/domain-search/${domain}`, {
      headers: {
        Authorization: `Bearer YzE4ZjdiMjFjNGFiZjE3MTE`, // Store API token in .env
      },
    });

    res.json(response.data);
    console.log(response.data)
  } catch (error) {
    console.error("Error fetching domain data:", error);
    res.status(500).json({ message: "Failed to fetch domain data" });
  }
});

// fetchPackageTypes();
const resellerId = '*';  // Replace with your actual reseller ID  // Replace with your actual API token


const API_URL1 = `https://api.20i.com/reseller/${resellerId}/packageTypes`;
async function getFilteredPackageTypes() {
  try {
      const response = await axios.get(API_URL1, {
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
          },
      });

      // Extract and filter package types
      const filteredPackages = response.data
      .filter(pkg => ["Basic", "Professional", "Enterprise"].includes(pkg.label))
      .map(pkg => ({
          id: pkg.id,
          label: pkg.label,
          limits: {
              webspace: pkg.limits.webspace,
              mysqlDatabases: pkg.limits.mysqlDatabases,
              bandwidth: pkg.limits.bandwidth,
              mailboxes: pkg.limits.mailboxes,
              domains: pkg.limits.domains,
          }
      }));

      // const filteredPackages = response.data
      // .filter(pkg => ["Basic", "Professional", "Enterprise"].includes(pkg.label))
      // .map(pkg => ({
      //     id: pkg.id,
      //     label: pkg.label,
      //     limits: pkg.limits,
      // }));


      return filteredPackages;
  } catch (error) {
      console.error("Error fetching package types:", error.message);
      return { error: "Failed to fetch package types" };
  }
}

// API Route
app.get("/packageTypes", async (req, res) => {
  const data = await getFilteredPackageTypes();
  res.json(data);
});




const API_URL2 = "https://private-anon-dbd1050e12-20i.apiary-mock.com/reseller/1/addDomain";

// addind Domain account
app.post('/reseller/:resellerId/addDomain', async (req, res) => {
  const { resellerId } = req.params;
  const { domainName, fullName, email, phone, address, city, country } = req.body;

  // if (!domainName || !fullName || !email || !phone || !address || !city || !country) {
  //     return res.status(400).json({ error: 'All fields are required.' });
  // }

  // Prepare the payload to send to 20i API
  const body = {
      name: domainName,
      years: 1,
      caRegistryAgreement: true,
      contact: {
          organisation: 'Aleelo Solutions',
          name: fullName,
          address: address,
          telephone: phone,
          email: email,
          cc: country,
          pc: '000',
          sp: '',
          city: city,
          extension: {}
      },
      nameservers: [],
      privacyService: true,
      stackUser: ''
  };


  // Set up the API token
  const token = 'Bearer Y2FjOTY3N2IzYWY1MzEzNDk'; // Replace with your actual token

  try {
      // Send the request to 20i API
      const response = await axios.post(API_URL2, body, {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': token
          }
      });

      // If the domain is successfully added, send a success response
      if (response.data) {
          return res.status(200).json({ success: true, message: 'Domain added successfully.' });
      } else {
          throw new Error('Failed to add domain');
      }
  } catch (error) {
      console.error('Error registering domain:', error.response ? error.response.data : error.message);
      return res.status(500).json({ error: 'Failed to add domain.' });
  }
});

const RESELLER_API_URL = "https://api.20i.com/reseller";
const API_KEY = "YzA1NzllZjNmYjE1YzBmYjU";


// Middleware for Authorization Header
const AUTH_HEADER = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`, // Store API token in .env file
  },
};

// 📌 **Add Hosting Package API**


app.post("/api/add-hosting-package", async (req, res) => {
  try {
    const { type, domain_name,  label, documentRoots, stackUser } = req.body;

    console.log('body ',req.body)

    // Validate required fields
    if (!type || !domain_name || !label || !documentRoots || !stackUser) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // API Request Data
    const requestData = {
      type,
      domain_name,
      label,
      documentRoots,
      stackUser,
    };

    console.log(requestData)

    // Send Request to Reseller API
    const response = await axios.post(`${RESELLER_API_URL}/*/addWeb`, requestData, AUTH_HEADER);

    res.status(200).json(response.data);
    console.log("Success:", response.data);

  } catch (error) {
    // console.error("Error adding hosting package:", error);
    res.status(500).json({ error: "Failed to add hosting package." });
  }
});



const API_URL = `https://api.20i.com/reseller/*/susers`;
const API_URL3 = `https://api.20i.com/reseller/*/addStackUserPackageAllowance`;
const AUTH_HEADER2 = {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json'
};

// API endpoint to create a new StackCP user
app.post('/create-user', async (req, res) => {
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

    console.log(req.body)

    // ✅ Minimal required validation
    // if (!email || !person_name || !voice || !cc || !pc || !sp || !city || !address) {
    //   return res.status(400).json({
    //     error: 'Missing required fields. Please include all required user information.'
    //   });
    // }


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

    console.log(payload)

    console.log("📤 Sending to 20i:", JSON.stringify(payload, null, 2));

    const response = await axios.post(API_URL, payload, {
      headers: AUTH_HEADER2
    });

    console.log("✅ StackUser created:", response.data);

    res.json({
      message: "StackCP User created successfully",
      data: response.data
    });

  } catch (error) {
    console.error("❌ Error creating StackUser:", error?.response?.data || error.message);
    res.status(500).json({
      error: "Failed to create StackCP user",
      details: error?.response?.data || error.message
    });
  }
});

app.post('/add-hosting-package-allowance', async (req, res) => {
  const { packageBundleTypeId, allowance, stackUser } = req.body;

  if (!packageBundleTypeId || !allowance || !stackUser) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const type = `${packageBundleTypeId}-${allowance}`;

  try {
    const response = await axios.post(API_URL3, {
      type,
      stackUser
    }, {
      headers: AUTH_HEADER2
    });

    res.json({
      message: 'Hosting package allowance added successfully',
      data: response.data
    });

  } catch (error) {
    console.error('❌ Error adding allowance:', error?.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to add hosting package allowance',
      details: error?.response?.data || error.message
    });
  }
});











// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
