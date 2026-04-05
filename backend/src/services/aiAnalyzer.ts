import OpenAI from 'openai';
import dotenv from 'dotenv';
import { scanEventEmitter } from '../utils/eventEmitter';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateAiInsights(stack: any, scanId: string) {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    scanEventEmitter.emit(`progress_${scanId}`, { status: 'AI Analysis skipped (No API key)', percent: 85 });
    return {
      summary: 'OpenAI API key not configured.',
      observations: ['Please configure OPENAI_API_KEY in backend/.env'],
      recommendations: [],
      techDebtWarnings: []
    };
  }

  scanEventEmitter.emit(`progress_${scanId}`, { status: 'Running AI analysis...', percent: 80 });

  const prompt = `Analyze this tech stack: ${JSON.stringify(stack)}
Provide insights about:
1. Architecture decisions
2. Scalability potential
3. Technical debt risks
4. Better alternatives
5. Interesting observations
Be conversational and interesting in your tone, like a senior engineer.
Format as JSON with keys: 'summary' (string), 'observations' (array of strings), 'recommendations' (array of strings), 'techDebtWarnings' (array of strings).`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0].message.content || '{}';
    return JSON.parse(content);
  } catch (error) {
    console.error('OpenAI Error (Insights):', error);
    return {
      summary: 'Failed to generate insights.',
      observations: [],
      recommendations: [],
      techDebtWarnings: []
    };
  }
}

export async function estimateCost(stack: any, scanId: string) {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    scanEventEmitter.emit(`progress_${scanId}`, { status: 'Calculating costs (skipped)...', percent: 95 });
    return {
      hosting: 0, cdn: 0, database: 0, analytics: 0, total: 0, currency: 'USD'
    };
  }

  scanEventEmitter.emit(`progress_${scanId}`, { status: 'Calculating estimated costs...', percent: 90 });

  const prompt = `Given this tech stack: ${JSON.stringify(stack)}
Estimate a realistic monthly infrastructure cost breakdown for a medium-scale application (~100k visits/month). Be specific with numbers.
Format as JSON with keys: 'hosting' (number), 'cdn' (number), 'database' (number), 'analytics' (number), 'total' (number), 'currency' (must be 'USD').`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0].message.content || '{}';
    return JSON.parse(content);
  } catch (error) {
    console.error('OpenAI Error (Cost):', error);
    return {
      hosting: 0, cdn: 0, database: 0, analytics: 0, total: 0, currency: 'USD'
    };
  }
}
