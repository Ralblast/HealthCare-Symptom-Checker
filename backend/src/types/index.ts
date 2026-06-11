// Shared types used across services, controllers and models.

export type UrgencyLevel = 'low' | 'medium' | 'high';
export type Severity = UrgencyLevel | 'emergency';

export interface PotentialCondition {
  conditionName: string;
  matchPercentage: number;
  reasoning: string;
  recommendations: string[];
  source: string;
}

export interface SymptomAnalysis {
  potentialConditions: PotentialCondition[];
  summary: string;
  urgencyLevel: UrgencyLevel;
  disclaimer?: string;
}
