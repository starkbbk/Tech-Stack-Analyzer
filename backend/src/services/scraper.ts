import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { scanEventEmitter } from '../utils/eventEmitter';

// Add stealth plugin to bypass simple bot protection
puppeteer.use(StealthPlugin());

export interface ScrapeResult {
  url: string;
  html: string;
  headers: Record<string, string>;
  cookies: any[];
  scriptUrls: string[];
  consoleMessages: string[];
  windowVariables: Record<string, any>;
  networkRequests: { url: string; method: string }[];
}

export async function scrapeWebsite(url: string, scanId: string): Promise<ScrapeResult> {
  const result: ScrapeResult = {
    url,
    html: '',
    headers: {},
    cookies: [],
    scriptUrls: [],
    consoleMessages: [],
    windowVariables: {},
    networkRequests: [],
  };

  scanEventEmitter.emit(`progress_${scanId}`, { status: 'Connecting to website...', percent: 10 });

  const browser = await puppeteer.launch({
    headless: true, // true in puppeteer 22+ uses the new headless by default or 'new'. Use true.
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
  });

  try {
    const page = await browser.newPage();
    
    // Set a realistic user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Track network requests
    page.on('request', request => {
      const method = request.method();
      const reqUrl = request.url();
      // Keep first 100 to avoid bloat
      if (result.networkRequests.length < 100) {
        result.networkRequests.push({ url: reqUrl, method });
      }
    });

    // Track console messages for interesting logs
    page.on('console', msg => {
      if (result.consoleMessages.length < 50) {
        result.consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
      }
    });

    scanEventEmitter.emit(`progress_${scanId}`, { status: 'Analyzing network requests...', percent: 30 });

    const response = await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    if (response) {
      result.headers = response.headers();
    }

    scanEventEmitter.emit(`progress_${scanId}`, { status: 'Reading HTML structure...', percent: 50 });

    result.html = await page.content();
    result.cookies = await page.cookies();

    scanEventEmitter.emit(`progress_${scanId}`, { status: 'Detecting JavaScript & Environment...', percent: 70 });

    // Extract interesting script tags
    result.scriptUrls = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script'));
      return scripts.map(s => s.src).filter(Boolean);
    });

    // Extract global variables for framework detection
    result.windowVariables = await page.evaluate(() => {
      const win = window as any;
      return {
        hasReact: !!win.__REACT_DEVTOOLS_GLOBAL_HOOK__,
        hasNext: !!win.__NEXT_DATA__,
        hasNuxt: !!win.__nuxt,
        hasVue: !!win.__VUE__ || !!win.Vue,
        hasAngular: !!win.ng || !!document.querySelector('[ng-version]'),
        hasSvelte: !!win.__SVELTE__,
        hasRemix: !!win.__remixContext,
        hasMixpanel: !!win.mixpanel,
        hasSegment: !!win.analytics,
        hasStripe: !!win.Stripe,
      };
    });

  } catch (error: any) {
    console.error(`Error scraping ${url}:`, error.message);
    scanEventEmitter.emit(`progress_${scanId}`, { status: 'Error during scraping: ' + error.message, error: true });
    throw error;
  } finally {
    await browser.close();
  }

  return result;
}
