import { Schema, model } from 'mongoose';
import type { SymptomAnalysis } from '../types/index.js';

export interface IQueryHistory {
  symptom: string;
  clarificationAnswers?: { question: string; answer: string }[];
  analysisResult?: SymptomAnalysis;
  isEmergency: boolean;
  ipAddress?: string;
  userAgent?: string;
}

const queryHistorySchema = new Schema<IQueryHistory>(
  {
    symptom: { type: String, required: true, trim: true },
    clarificationAnswers: [{ question: String, answer: String }],
    analysisResult: { type: Schema.Types.Mixed },
    isEmergency: { type: Boolean, default: false },
    ipAddress: String,
    userAgent: String,
  },
  { timestamps: true },
);

export const QueryHistory = model<IQueryHistory>('QueryHistory', queryHistorySchema);

export default QueryHistory;
