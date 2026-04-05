import mongoose, { Schema, Document } from 'mongoose';

export interface IScan extends Document {
  scanId: string;
  url: string;
  timestamp: Date;
  status: 'scanning' | 'complete' | 'failed';
  techStack: Record<string, any[]>;
  scores: {
    performance: number;
    seo: number;
    security: number;
    mobile: number;
    overall: number;
  };
  cost: {
    hosting: number;
    cdn: number;
    database: number;
    analytics: number;
    total: number;
    currency: string;
  };
  aiInsights: {
    summary: string;
    observations: string[];
    recommendations: string[];
    techDebtWarnings: string[];
  };
}

const ScanSchema: Schema = new Schema({
  scanId: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['scanning', 'complete', 'failed'], default: 'scanning' },
  techStack: { type: Object, default: {} },
  scores: {
    performance: { type: Number, default: 0 },
    seo: { type: Number, default: 0 },
    security: { type: Number, default: 0 },
    mobile: { type: Number, default: 0 },
    overall: { type: Number, default: 0 },
  },
  cost: {
    hosting: { type: Number, default: 0 },
    cdn: { type: Number, default: 0 },
    database: { type: Number, default: 0 },
    analytics: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
  },
  aiInsights: {
    summary: { type: String, default: '' },
    observations: { type: [String], default: [] },
    recommendations: { type: [String], default: [] },
    techDebtWarnings: { type: [String], default: [] },
  }
});

export default mongoose.model<IScan>('Scan', ScanSchema);
