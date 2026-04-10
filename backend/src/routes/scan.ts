import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { scanEventEmitter } from '../utils/eventEmitter';
import { scrapeWebsite } from '../services/scraper';
import { detectTechnologies } from '../services/detector';
import { generateAiInsights, estimateCost, estimateRevenue } from '../services/aiAnalyzer';
import { setCache, getCache } from '../services/cacheService';
import Scan from '../models/Scan';

const router = express.Router();

router.post('/', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // Normalize URL
  let targetUrl = url;
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = 'https://' + targetUrl;
  }

  const scanId = uuidv4();
  
  // Create Initial DB entry
  try {
    await Scan.create({
      scanId,
      url: targetUrl,
      status: 'scanning'
    });
  } catch (e: any) {
    console.error('MongoDB error, proceeding anyway', e.message);
  }

  // Slight delay so SSE client can connect before events start firing
  setTimeout(() => {
    runScanJob(scanId, targetUrl).catch(console.error);
  }, 500);

  res.json({ scanId });
});

router.get('/:id/status', (req, res) => {
  const { id } = req.params;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  // Add CORS headers to SSE response just in case
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.write(`data: ${JSON.stringify({ status: 'Initializing scan...', percent: 5 })}\n\n`);

  const onProgress = (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
    if (data.status === 'Scan complete!' || data.error) {
      scanEventEmitter.removeListener(`progress_${id}`, onProgress);
      res.end();
    }
  };

  scanEventEmitter.on(`progress_${id}`, onProgress);

  // Client closes connection
  req.on('close', () => {
    scanEventEmitter.removeListener(`progress_${id}`, onProgress);
  });
});

router.get('/:id/result', async (req, res) => {
  const { id } = req.params;
  
  // Check cache
  const cached = await getCache(`scan_${id}`);
  if (cached) return res.json(cached);

  // Check DB
  try {
    const scan = await Scan.findOne({ scanId: id });
    if (scan) {
      await setCache(`scan_${id}`, scan, 86400); // cache for 24h
      return res.json(scan);
    }
  } catch (e) {
    // Ignore db err
  }

  res.status(404).json({ error: 'Scan not found' });
});

router.get('/recent/all', async (req, res) => {
  try {
    const scans = await Scan.find({ status: 'complete' })
      .sort({ timestamp: -1 })
      .limit(10)
      .select('scanId url timestamp scores');
    res.json(scans);
  } catch (e) {
    res.json([]);
  }
});

// Background job processor
async function runScanJob(scanId: string, url: string) {
  try {
    // 1. Scrape
    const scrapeData = await scrapeWebsite(url, scanId);

    // 2. Detect
    scanEventEmitter.emit(`progress_${scanId}`, { status: 'Running Tech Detection Engine...', percent: 75 });
    const techStack = detectTechnologies(scrapeData);

    // 3. AI Insights
    const [aiInsights, cost, revenue] = await Promise.all([
      generateAiInsights(techStack, scanId),
      estimateCost(techStack, scanId),
      estimateRevenue(techStack, scanId)
    ]);

    // Calculate dummy scores (in a real app, use lighthouse API)
    const confidencePenalty = Math.max(0, 100 - (Object.values(techStack).flat().length * 10));
    const scores = {
      performance: Math.floor(Math.random() * 20) + 80,
      seo: Math.floor(Math.random() * 15) + 80,
      security: Math.floor(Math.random() * 10) + 85,
      mobile: Math.floor(Math.random() * 20) + 75,
      overall: 0
    };
    scores.overall = Math.round((scores.performance + scores.seo + scores.security + scores.mobile) / 4);

    const result = {
      status: 'complete',
      techStack,
      aiInsights,
      cost,
      revenue,
      scores,
      url,
      timestamp: new Date()
    };

    // Update DB
    try {
      await Scan.findOneAndUpdate({ scanId }, result);
    } catch (e) {
      console.warn("DB update failed, using cache only");
    }

    // Update Cache
    await setCache(`scan_${scanId}`, { scanId, ...result }, 86400);

    scanEventEmitter.emit(`progress_${scanId}`, { status: 'Scan complete!', percent: 100, done: true });
    
  } catch (error: any) {
    console.error(`Scan Job Error [${scanId}]:`, error);
    try {
      await Scan.findOneAndUpdate({ scanId }, { status: 'failed' });
    } catch (e) {}
    scanEventEmitter.emit(`progress_${scanId}`, { status: 'Failed to complete scan', error: true, message: error.message });
  }
}

export default router;
