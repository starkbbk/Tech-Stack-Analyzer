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
  revenue: {
    ads: number;
    subscriptions: number;
    sales: number;
    total: number;
    currency: string;
  };
  securityScore: number;
  trustScore: number;
  securityAudit: {
    trustLevel: 'Real' | 'Likely Real' | 'Suspicious' | 'Likely Fake';
    trustReason: string;
    vulnerabilities: string[];
    securityFeatures: string[];
  };
  aiInsights: {
    summary: string;
    observations: string[];
    recommendations: string[];
    techDebtWarnings: string[];
  };
  businessPurpose: {
    summary: string;
    targetAudience: string;
    monetizationModel: string;
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
  revenue: {
    ads: { type: Number, default: 0 },
    subscriptions: { type: Number, default: 0 },
    sales: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
  },
  securityScore: { type: Number, default: 0 },
  trustScore: { type: Number, default: 0 },
  securityAudit: {
    trustLevel: { type: String, enum: ['Real', 'Likely Real', 'Suspicious', 'Likely Fake'], default: 'Likely Real' },
    trustReason: { type: String, default: '' },
    vulnerabilities: { type: [String], default: [] },
    securityFeatures: { type: [String], default: [] },
  },
  aiInsights: {
    summary: { type: String, default: '' },
    observations: { type: [String], default: [] },
    recommendations: { type: [String], default: [] },
    techDebtWarnings: { type: [String], default: [] },
  },
  businessPurpose: {
    summary: { type: String, default: '' },
    targetAudience: { type: String, default: '' },
    monetizationModel: { type: String, default: '' },
  }
});

export default mongoose.model<IScan>('Scan', ScanSchema);
