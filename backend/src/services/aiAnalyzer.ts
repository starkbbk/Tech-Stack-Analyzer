import OpenAI from 'openai';
import dotenv from 'dotenv';
import { scanEventEmitter } from '../utils/eventEmitter';

dotenv.config();

// OpenRouter is OpenAI-compatible, so we can reuse the SDK with a different base URL
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || '',
  defaultHeaders: {
    "HTTP-Referer": "https://github.com/starkbbk/Tech-Stack-Analyzer", // Optional, for OpenRouter rankings
    "X-Title": "Tech Stack Analyzer", // Optional, for OpenRouter rankings
  }
});

const AI_MODEL = "qwen/qwen-2.5-72b-instruct:free"; // Using the free Qwen model as requested (updated to a verified slug)

export async function generateAiInsights(stack: any, scanId: string) {
  if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
    scanEventEmitter.emit(`progress_${scanId}`, { status: 'AI Analysis skipped (No API key)', percent: 85 });
    return {
      summary: 'OpenRouter API key not configured.',
      observations: ['Please configure OPENROUTER_API_KEY in backend/.env'],
      recommendations: [],
      techDebtWarnings: []
    };
  }

  scanEventEmitter.emit(`progress_${scanId}`, { status: 'Running AI analysis (Qwen)...', percent: 80 });

  const prompt = `Analyze this tech stack: ${JSON.stringify(stack)}
Provide insights about:
1. Architecture decisions
2. Scalability potential
3. Technical debt risks
4. Better alternatives
5. Interesting observations
Be conversational and interesting in your tone, like a senior engineer.
Format ONLY as a valid JSON object with keys: 'summary' (string), 'observations' (array of strings), 'recommendations' (array of strings), 'techDebtWarnings' (array of strings).`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: AI_MODEL,
    });

    const content = completion.choices[0].message.content || '{}';
    // Deepseek/Qwen sometimes wrapps JSON in code blocks, let's clean it if so
    const cleanedContent = content.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanedContent);
  } catch (error: any) {
    console.error('OpenRouter Error (Insights):', error.message);
    return {
      summary: 'Failed to generate insights via OpenRouter.',
      observations: [error.message],
      recommendations: [],
      techDebtWarnings: []
    };
  }
}

export async function estimateCost(stack: any, scanId: string) {
  if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
    scanEventEmitter.emit(`progress_${scanId}`, { status: 'Calculating costs (skipped)...', percent: 95 });
    return {
      hosting: 0, cdn: 0, database: 0, analytics: 0, total: 0, currency: 'USD'
    };
  }

  scanEventEmitter.emit(`progress_${scanId}`, { status: 'Calculating estimated costs (Qwen)...', percent: 90 });

  const prompt = `Given this tech stack: ${JSON.stringify(stack)}
Estimate a realistic monthly infrastructure cost breakdown for a medium-scale application (~100k visits/month). Be specific with numbers.
Format ONLY as a valid JSON object with keys: 'hosting' (number), 'cdn' (number), 'database' (number), 'analytics' (number), 'total' (number), 'currency' (must be 'USD').`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: AI_MODEL,
    });

    const content = completion.choices[0].message.content || '{}';
    const cleanedContent = content.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanedContent);
  } catch (error: any) {
    console.error('OpenRouter Error (Cost):', error.message);
    return {
      hosting: 0, cdn: 0, database: 0, analytics: 0, total: 0, currency: 'USD'
    };
  }
}
export async function estimateRevenue(stack: any, scanId: string) {
  if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
    scanEventEmitter.emit(`progress_${scanId}`, { status: 'Calculating revenue (skipped)...', percent: 98 });
    return {
      ads: 0, subscriptions: 0, sales: 0, total: 0, currency: 'USD'
    };
  }

  scanEventEmitter.emit(`progress_${scanId}`, { status: 'Estimating potential revenue (Qwen)...', percent: 95 });

  const prompt = `Given this tech stack: ${JSON.stringify(stack)}
Estimate a realistic monthly revenue breakdown for a medium-scale application (~100k visits/month). 
Consider: 
- Ads revenue (if Ad tools detected)
- Subscription revenue (if SaaS patterns detected)
- Sales revenue (if E-commerce tools detected)
Format ONLY as a valid JSON object with keys: 'ads' (number), 'subscriptions' (number), 'sales' (number), 'total' (number), 'currency' (must be 'USD').`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: AI_MODEL,
    });

    const content = completion.choices[0].message.content || '{}';
    const cleanedContent = content.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanedContent);
  } catch (error: any) {
    console.error('OpenRouter Error (Revenue):', error.message);
    return {
      ads: 0, subscriptions: 0, sales: 0, total: 0, currency: 'USD'
    };
  }
}
export async function generateSecurityAudit(stack: any, headers: any, scanId: string) {
  if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
    scanEventEmitter.emit(`progress_${scanId}`, { status: 'Security audit skipped', percent: 99 });
    return {
      trustLevel: 'Likely Real',
      trustReason: 'API Key missing for deep analysis',
      vulnerabilities: [],
      securityFeatures: []
    };
  }

  scanEventEmitter.emit(`progress_${scanId}`, { status: 'Analyzing website security & legitimacy...', percent: 97 });

  const prompt = `Given this tech stack: ${JSON.stringify(stack)}
  And these HTTP headers: ${JSON.stringify(headers)}
  
  Perform a security and trust audit of this website.
  1. Determine if it is likely 'Real', 'Likely Real', 'Suspicious', or 'Likely Fake'.
  2. Identify security features present (e.g., SSL, CSP, HSTS).
  3. Identify potential vulnerabilities or trust issues (e.g., missing headers, obscure tech, inconsistent stack).
  4. Provide a 1-sentence reason for the trust level.
  
  Format ONLY as a valid JSON object with keys: 
  'trustLevel' (string), 
  'trustReason' (string), 
  'vulnerabilities' (array of strings), 
  'securityFeatures' (array of strings),
  'securityScore' (number 0-100),
  'trustScore' (number 0-100).`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: AI_MODEL,
    });

    const content = completion.choices[0].message.content || '{}';
    const cleanedContent = content.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanedContent);
  } catch (error: any) {
    console.error('OpenRouter Error (Security):', error.message);
    return {
      trustLevel: 'Likely Real',
      trustReason: 'AI analysis failed',
      vulnerabilities: [],
      securityFeatures: []
    };
  }
}
