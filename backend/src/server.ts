import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import scanRoutes from './routes/scan';
import compareRoutes from './routes/compare';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Main Routes
app.use('/api/scan', scanRoutes);
app.use('/api/compare', compareRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tech-stack-analyzer';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    console.warn('⚠️ MongoDB connection failed. Will run without persistent DB storage.', err.message);
  });

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
