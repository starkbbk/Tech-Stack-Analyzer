# 🚀 Tech Stack Analyzer: "Website Ka X-Ray Machine"

**Tech Stack Analyzer** is a powerful, production-ready full-stack application designed to deconstruct any website's architecture. It scans a URL to identify its frontend frameworks, backend technologies, cloud infrastructure, analytics tools, and more.

![Project Preview](https://via.placeholder.com/1200x600/0a0a0a/00ff41?text=TECH+STACK+ANALYZER+V1.0)

---

## 🎯 Core Concept
- **URL Scanning**: Enter any website URL to begin a deep-dive analysis.
- **Technology Detection**: Identifies 50+ signatures including React, Next.js, AWS, Cloudflare, Stripe, etc.
- **Cost Estimation**: Provides a realistic monthly infrastructure cost breakdown based on detected tools.
- **AI-Driven Insights**: Uses OpenAI GPT-4 to provide architectural observations and recommendations.
- **Performance Scoring**: Generates scores for performance, security, and SEO.
- **Comparative Analysis**: Compare two websites side-by-side to see who has the superior stack.

---

## 🖥️ Tech Stack

### Frontend (Next.js 14)
- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Visuals**: Recharts (Graphs), Lucide Icons
- **Theme**: Dark Hacker Terminal Aesthetic

### Backend (Node.js & Express)
- **Scraper**: Puppeteer (with Stealth Plugin) & Cheerio
- **Detection**: Custom signature-based engine
- **Real-time**: Server-Sent Events (SSE) for live scan progress
- **Database**: MongoDB (Scan history)
- **Caching**: Redis (24-hour result caching)

### AI Integration
- **OpenRouter**: Uses the `qwen/qwen-2.5-72b-instruct:free` model for intelligent cost estimation and senior engineer-level insights.

---

## 📁 Folder Structure

```
tech-stack-analyzer/
├── frontend/ (Next.js App)
│   ├── src/app/             # Pages (Home, Scan, Result, Compare)
│   ├── src/components/      # UI components (MatrixBG, TechCard, etc.)
│   └── tailwind.config.ts   # Custom Hacker Theme
├── backend/ (Express App)
│   ├── src/routes/          # API Endpoints
│   ├── src/services/        # Scraper, Detector, AI Logic
│   ├── src/models/          # MongoDB Schemas
│   └── src/server.ts        # Entry point
└── docker-compose.yml       # Infrastructure (Redis, MongoDB)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Docker (for Redis/MongoDB)
- OpenAI API Key (for insights and cost estimation)

### 1. Infrastructure Setup
Run the following to start Redis and MongoDB:
```bash
docker-compose up -d
```

### 2. Backend Configuration
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create or edit `.env`:
   ```env
   PORT=5000
   REDIS_URL=redis://localhost:6379
   MONGO_URI=mongodb://localhost:27017/tech-stack-analyzer
   OPENAI_API_KEY=your_openai_api_key_here
   ```
3. Install and run:
   ```bash
   npm install
   npm run dev
   ```

### 3. Frontend Configuration
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Create or edit `.env.local`:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
   ```
3. Install and run:
   ```bash
   npm install
   npm run dev
   ```

---

## 🔍 Detection Engine Signatures
The application detects technologies across multiple categories:
- **Frontend**: React, Next.js, Vue, Nuxt, Angular, Svelte, Tailwind, Bootstrap.
- **Backend**: Node.js (Express), Django, Ruby on Rails, Laravel, PHP.
- **Cloud/CDN**: AWS (CloudFront), Vercel, Netlify, Cloudflare, Heroku, GCP.
- **Analytics**: Google Analytics, Mixpanel, Hotjar, Segment, Amplitude.
- **Payments**: Stripe, Razorpay, PayPal.
- **Security**: Cloudflare WAF, reCAPTCHA, HSTS Headers.

---

## 🌟 Features Breakdown

### Real-time Scanning
The scan page uses **Server-Sent Events (SSE)** to provide a live terminal experience. You'll see the analyzer progress through connection, header reading, and AI processing in real-time.

### Comparison Mode
Access `/compare` to input two different domains. The system will pull cached results or run fresh scans to provide a side-by-side winning verdict based on performance and modern stack adoption.

### Shareable "Wrapped" Cards
Every scan generates a beautiful, animated "Share Card" inspired by Spotify Wrapped, summarizing the website's technical fingerprint for easy sharing on Twitter or LinkedIn.

---

## ⚠️ Important Notes
- **Rate Limiting**: Ensure you don't exceed OpenAI limits with frequent scans.
- **Puppeteer Headless**: Some websites use heavy anti-bot protections; `puppeteer-extra-plugin-stealth` is used to mitigate this.
- **Caching**: Results are cached in Redis for 24 hours to ensure speed and cost-efficiency.

---

## 🤝 Contributing
Contributions are welcome! Please open an issue or submit a pull request for new signatures or performance improvements.

**Maintained by [Stark](https://github.com/starkbbk)** 🚀
