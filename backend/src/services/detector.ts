import * as cheerio from 'cheerio';
import { ScrapeResult } from './scraper';

export interface TechItem {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'cloud' | 'cdn' | 'analytics' | 'payments' | 'security' | 'other';
  confidence: number;
  icon?: string;
}

export function detectTechnologies(data: ScrapeResult): Record<string, TechItem[]> {
  const detected: TechItem[] = [];
  const $ = cheerio.load(data.html);
  
  const headers = data.headers || {};
  const lowerHeaders = Object.keys(headers).reduce((acc, key) => {
    acc[key.toLowerCase()] = headers[key]!.toLowerCase();
    return acc;
  }, {} as Record<string, string>);

  const html = data.html.toLowerCase();
  
  // Helpers
  const addTech = (name: string, category: TechItem['category'], confidence: number, icon: string = '') => {
    if (!detected.find(t => t.name === name)) {
      detected.push({ name, category, confidence, icon });
    }
  };

  const hasHeaderValue = (headerKey: string, partialValue: string) => {
    return lowerHeaders[headerKey] && lowerHeaders[headerKey].includes(partialValue);
  };

  /* ------------------- FRONTEND FRAMEWORKS ------------------- */
  if (data.windowVariables.hasNext || html.includes('__next_data__')) {
    addTech('Next.js', 'frontend', 99, 'devicon-nextjs-plain');
    addTech('React', 'frontend', 99, 'devicon-react-original');
  } else if (data.windowVariables.hasReact || html.includes('react.development.js') || html.includes('react.production.min.js')) {
    addTech('React', 'frontend', 95, 'devicon-react-original');
  }

  if (data.windowVariables.hasVue) {
    addTech('Vue.js', 'frontend', 95, 'devicon-vuejs-plain');
  }
  if (data.windowVariables.hasNuxt) {
    addTech('Nuxt.js', 'frontend', 99, 'devicon-nuxtjs-plain');
    addTech('Vue.js', 'frontend', 99, 'devicon-vuejs-plain');
  }

  if (data.windowVariables.hasAngular) {
    addTech('Angular', 'frontend', 95, 'devicon-angularjs-plain');
  }
  if (data.windowVariables.hasSvelte || html.includes('svelte')) {
    addTech('Svelte', 'frontend', 95, 'devicon-svelte-plain');
  }

  // CSS Frameworks
  if (html.includes('tailwindcss') || html.includes('tailwind.css') || html.includes('text-white bg-')) {
     addTech('TailwindCSS', 'frontend', 80, 'devicon-tailwindcss-plain');
  }
  if (html.includes('bootstrap') || html.includes('bootstrap.min.css')) {
     addTech('Bootstrap', 'frontend', 90, 'devicon-bootstrap-plain');
  }

  /* ------------------- BACKEND ------------------- */
  if (hasHeaderValue('x-powered-by', 'express')) {
    addTech('Express.js', 'backend', 95, 'devicon-express-original');
    addTech('Node.js', 'backend', 95, 'devicon-nodejs-plain');
  }
  if (hasHeaderValue('server', 'nginx')) {
    addTech('Nginx', 'backend', 90, 'devicon-nginx-original');
  }
  if (hasHeaderValue('server', 'apache')) {
    addTech('Apache', 'backend', 90, 'devicon-apache-plain');
  }
  if (html.includes('csrfmiddlewaretoken') || data.cookies.some(c => c.name === 'csrftoken')) {
    addTech('Django', 'backend', 95, 'devicon-django-plain');
    addTech('Python', 'backend', 90, 'devicon-python-plain');
  }
  if (hasHeaderValue('x-runtime', 'ruby') || data.cookies.some(c => c.name.includes('_session_id'))) {
     // A bit generalized, but typical for Rails
     if (html.includes('data-turbolinks-track') || html.includes('data-turbo-track')) {
       addTech('Ruby on Rails', 'backend', 90, 'devicon-rails-plain');
       addTech('Ruby', 'backend', 90, 'devicon-ruby-plain');
     }
  }
  if (data.cookies.some(c => c.name === 'laravel_session')) {
    addTech('Laravel', 'backend', 99, 'devicon-laravel-plain');
    addTech('PHP', 'backend', 99, 'devicon-php-plain');
  }
  if (hasHeaderValue('x-powered-by', 'php') || data.url.endsWith('.php')) {
    addTech('PHP', 'backend', 99, 'devicon-php-plain');
  }
  // Java / Spring
  if (data.cookies.some(c => c.name === 'JSESSIONID')) {
    addTech('Java', 'backend', 80, 'devicon-java-plain');
  }


  /* ------------------- DATABASES (Indirect) ------------------- */
  const scriptsStr = data.scriptUrls.join(' ');
  if (scriptsStr.includes('firebaseapp.com') || scriptsStr.includes('firebase-')) {
    addTech('Firebase', 'database', 95, 'devicon-firebase-plain');
  }
  if (scriptsStr.includes('supabase.co')) {
    addTech('Supabase', 'database', 95, 'devicon-supabase-plain');
  }


  /* ------------------- CLOUD PROVIDERS ------------------- */
  if (hasHeaderValue('server', 'cloudflare') || hasHeaderValue('expect-ct', 'cloudflare') || data.cookies.some(c => c.name === '__cfduid' || c.name === '__cf_bm')) {
    addTech('Cloudflare', 'cdn', 99, 'cloudflare');
    addTech('Cloudflare WAF', 'security', 90, '');
  }
  if (hasHeaderValue('server', 'vercel') || hasHeaderValue('x-vercel-id', '')) {
    addTech('Vercel', 'cloud', 99, '');
  }
  if (hasHeaderValue('server', 'netlify') || hasHeaderValue('x-nf-request-id', '')) {
    addTech('Netlify', 'cloud', 99, '');
  }
  if (hasHeaderValue('x-amz-cf-id', '') || data.networkRequests.some(r => r.url.includes('cloudfront.net'))) {
    addTech('AWS CloudFront', 'cdn', 95, 'devicon-amazonwebservices-original');
    addTech('AWS', 'cloud', 95, 'devicon-amazonwebservices-original');
  }
  if (data.networkRequests.some(r => r.url.includes('amazonaws.com'))) {
    addTech('AWS', 'cloud', 90, 'devicon-amazonwebservices-original');
  }
  if (data.networkRequests.some(r => r.url.includes('googleapis.com'))) {
    addTech('Google Cloud', 'cloud', 80, 'devicon-googlecloud-plain');
  }
  if (hasHeaderValue('server', 'heroku') || html.includes('herokuapp.com')) {
    addTech('Heroku', 'cloud', 95, 'devicon-heroku-original');
  }


  /* ------------------- ANALYTICS ------------------- */
  if (html.includes('google-analytics.com') || html.includes('gtag') || html.includes('ga.js')) {
    addTech('Google Analytics', 'analytics', 95, '');
  }
  if (data.windowVariables.hasMixpanel || scriptsStr.includes('mixpanel.com')) {
    addTech('Mixpanel', 'analytics', 95, '');
  }
  if (data.windowVariables.hasSegment || scriptsStr.includes('segment.com') || scriptsStr.includes('segment.io')) {
    addTech('Segment', 'analytics', 95, '');
  }
  if (scriptsStr.includes('hotjar.com') || html.includes('hj(')) {
    addTech('Hotjar', 'analytics', 95, '');
  }
  if (scriptsStr.includes('amplitude.com')) {
    addTech('Amplitude', 'analytics', 95, '');
  }


  /* ------------------- PAYMENTS ------------------- */
  if (data.windowVariables.hasStripe || scriptsStr.includes('stripe.com/v3') || scriptsStr.includes('js.stripe.com')) {
    addTech('Stripe', 'payments', 95, '');
  }
  if (scriptsStr.includes('razorpay.com/v1')) {
    addTech('Razorpay', 'payments', 95, '');
  }
  if (scriptsStr.includes('paypal.com/sdk') || scriptsStr.includes('paypalobjects')) {
    addTech('PayPal', 'payments', 95, '');
  }

  // Security
  if (html.includes('google.com/recaptcha') || html.includes('gstatic.com/recaptcha')) {
    addTech('reCAPTCHA', 'security', 99, '');
  }
  if (hasHeaderValue('x-xss-protection', '') && hasHeaderValue('x-frame-options', '')) {
    addTech('Security Headers (Helmet/Custom)', 'security', 80, '');
  }

  // Group by category
  const grouped: Record<string, TechItem[]> = {
    frontend: [],
    backend: [],
    database: [],
    cloud: [],
    cdn: [],
    analytics: [],
    payments: [],
    security: [],
    other: []
  };

  detected.forEach(tech => {
    grouped[tech.category].push(tech);
  });

  return grouped;
}
