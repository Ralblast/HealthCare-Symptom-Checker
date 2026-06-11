import { Schema, model } from 'mongoose';
import type { Severity } from '../types/index.js';

export interface IMedicalCondition {
  condition: string;
  symptoms: string[];
  description: string;
  recommendations: string[];
  source: string;
  severity: Severity;
}

const medicalConditionSchema = new Schema<IMedicalCondition>(
  {
    condition: { type: String, required: true, unique: true, trim: true },
    symptoms: [{ type: String, required: true, lowercase: true, trim: true }],
    description: { type: String, required: true },
    recommendations: [{ type: String, required: true }],
    source: { type: String, required: true },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'emergency'],
      default: 'medium',
    },
  },
  { timestamps: true },
);

// Full-text index drives the primary symptom -> condition lookup.
medicalConditionSchema.index({ condition: 'text', symptoms: 'text', description: 'text' });

export const MedicalCondition = model<IMedicalCondition>(
  'MedicalCondition',
  medicalConditionSchema,
);

export default MedicalCondition;
