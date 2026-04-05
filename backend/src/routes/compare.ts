import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Scan from '../models/Scan';
import { scrapeWebsite } from '../services/scraper';
import { detectTechnologies } from '../services/detector';

const router = express.Router();

router.post('/', async (req, res) => {
  const { url1, url2 } = req.body;
  if (!url1 || !url2) {
    return res.status(400).json({ error: 'Two URLs are required' });
  }

  // Helper function to normalize URL
  const normalize = (u: string) => u.startsWith('http') ? u : `https://${u}`;
  const u1 = normalize(url1);
  const u2 = normalize(url2);

  try {
    // Attempt parallel scans
    // In a real production app, you might want to check if these are already scanned and cached.
    // For simplicity, we'll run them through the main detection logic if we have results, 
    // otherwise just mock some quick data or trigger a background scan.
    
    // For this build, we'll try to find existing scans or trigger fresh ones.
    const [scan1, scan2] = await Promise.all([
       Scan.findOne({ url: u1 }).sort({ timestamp: -1 }),
       Scan.findOne({ url: u2 }).sort({ timestamp: -1 })
    ]);

    if (scan1 && scan2) {
        return res.json({ url1: scan1, url2: scan2 });
    }

    // If one or both are missing, we'll just return a message saying to scan them individually first 
    // OR we trigger a quick analysis (for now we'll throw an error to keep the logic simple)
    if (!scan1 || !scan2) {
        return res.status(400).json({ 
            error: 'One or both websites haven\'t been scanned yet.',
            missing: [!scan1 && url1, !scan2 && url2].filter(Boolean)
        });
    }

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
