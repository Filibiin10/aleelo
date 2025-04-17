// controllers/hostingController.js
import axios from 'axios';

const API_KEY = 'YzA1NzllZjNmYjE1YzBmYjU';
const RESELLER_API_URL = "https://api.20i.com/reseller/*";

const AUTH_HEADER = {
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  }
};

export const addHostingPackageHandler = async (req, res) => {
  try {
    const { type, domain_name, label, documentRoots, stackUser } = req.body;

    if (!type || !domain_name || !label || !documentRoots || !stackUser) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const payload = { type, domain_name, label, documentRoots, stackUser };

    const response = await axios.post(`${RESELLER_API_URL}/addWeb`, payload, AUTH_HEADER);
    res.status(200).json({ message: "✅ Hosting package added", data: response.data });

  } catch (error) {
    res.status(500).json({ error: "❌ Failed to add hosting package", details: error?.response?.data || error.message });
  }
};

// export const addHostingPackageHandler = async (req, res) => {
//   try {
//     const { type, domain_name, label, documentRoots, stackUser } = req.body;

//     if (!type || !domain_name || !label || !documentRoots || !stackUser) {
//       return res.status(400).json({ error: "Missing required fields." });
//     }

//     const payload = { type, domain_name, label, documentRoots, stackUser };

//     const response = await axios.post(`${RESELLER_API_URL}/addWeb`, payload, AUTH_HEADER);

//     return res.status(200).json({ message: "✅ Hosting package added", data: response.data });

//   } catch (error) {
//     const responseData = error?.response?.data;
//     const statusCode = error?.response?.status;
//     const message = responseData?.error?.message || responseData?.message || error.message;

//     // ❗ Handle hosting limit reached
//     if (statusCode === 403 && responseData?.limit === "reseller-max25") {
//       return res.status(403).json({
//         error: "❌ Hosting limit reached. You can only create 25 hosting packages for your reseller account."
//       });
//     }

//     // ❗ Handle already hosted domain
//     if (message?.toLowerCase().includes("conflict") || message?.toLowerCase().includes("already hosted")) {
//       return res.status(409).json({
//         error: "❌ This domain is already hosted.",
//         code: "HOSTING_EXISTS"
//       });
//     }

//     // ❗ Fallback for any other errors
//     return res.status(500).json({
//       error: "❌ Failed to add hosting package",
//       details: message
//     });
//   }
// };




export const addHostingAllowanceHandler = async (req, res) => {
  const { packageBundleTypeId, allowance, stackUser } = req.body;

  if (!packageBundleTypeId || !allowance || !stackUser) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const type = `${packageBundleTypeId}-${allowance}`;
  const API_URL = `${RESELLER_API_URL}/addStackUserPackageAllowance`;

  try {
    const response = await axios.post(API_URL, { type, stackUser }, AUTH_HEADER);

    res.status(200).json({
      message: '✅ Hosting package allowance added successfully',
      data: response.data
    });

  } catch (error) {
    res.status(500).json({
      error: '❌ Failed to add hosting package allowance',
      details: error?.response?.data || error.message
    });
  }
};

export const getHostingPackageDetailsHandler = async (req, res) => {
  const { packageId } = req.params;

  if (!packageId) {
    return res.status(400).json({ error: 'Missing package ID' });
  }

  try {
    const response = await axios.get(`https://api.20i.com/package/${packageId}`, AUTH_HEADER);
    const data = response.data;

    // Extract required details
    const domainName = data?.web?.name || data?.names?.[0] || null;
    const packageName = data?.web?.packageTypeName || null;
    const expirationDate = data?.web?.expiry || data?.created || null;
    const whoisPrivacy = data?.limits?.domainPrivacy === true;
    console.log(data?.limits?.domainPrivacy)

    res.status(200).json({
      domainName,
      packageName,
      expirationDate,
      whoisPrivacy
    });

  } catch (error) {
    console.error('Error fetching package details:', error?.response?.data || error.message);
    res.status(500).json({
      error: '❌ Failed to fetch package details',
      details: error?.response?.data || error.message
    });
  }
};


export const getStackUserHostingDetailsHandler = async (req, res) => {
  const { stackUserId } = req.params;

  if (!stackUserId) {
    return res.status(400).json({ error: 'Missing stack user ID' });
  }

  try {
    const grantsRes = await axios.get(
      `${RESELLER_API_URL}/stackUser/${stackUserId}/grants`,
      AUTH_HEADER
    );

    const packageRefs = grantsRes.data.filter(ref => ref.startsWith('package:'));

    // 📦 Get all domain info (for expiryDate)
    const allDomainsRes = await axios.get(`https://api.20i.com/domain`, AUTH_HEADER);
    const allDomains = allDomainsRes.data;

    const packageDetails = await Promise.all(
      packageRefs.map(async (pkgRef) => {
        const packageId = pkgRef.split(':')[1];
        try {
          const pkgRes = await axios.get(`https://api.20i.com/package/${packageId}`, AUTH_HEADER);
          const data = pkgRes.data;

          const domainName = data?.web?.name || data?.names?.[0] || null;

          const matchedDomain = allDomains.find(dom => dom.name === domainName);

          return {
            id: packageId,
            domainName,
            packageName: data?.web?.packageTypeName || null,
            expirationDate: matchedDomain?.expiryDate || data?.web?.expiry || data?.created || null,
            whoisPrivacy: data?.limits?.domainPrivacy === true
          };
        } catch (err) {
          return {
            id: packageId,
            error: `Failed to fetch package ${packageId}`,
            details: err?.response?.data || err.message
          };
        }
      })
    );

    res.status(200).json(packageDetails);

  } catch (error) {
    console.error('Error loading stack user hosting packages:', error?.response?.data || error.message);
    res.status(500).json({ error: '❌ Failed to load hosting packages', details: error?.response?.data || error.message });
  }
};
