import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = 7000;

// Enable CORS for all origins
app.use(cors());


app.get('/', (req, res) => {
  res.send('Welcome to the API!');
})

// Create a route to handle domain search
app.get('/api/domain-search', async (req, res) => {
  const { domain } = req.query;
  if (!domain) {
    return res.status(400).json({ error: 'Domain is required' });
  }

  try {
    const response = await axios.get(`https://api.20i.com/domain-search/${domain}`, {
      headers: {
        'Authorization': `Bearer Y2U0NGRiOTJkNTc0N2JiZmI`, // Make sure to store token securely
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching domain info:', error.message);
    res.status(500).json({ error: 'Failed to fetch domain information' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
