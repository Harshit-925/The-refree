
export type Budget = 'low' | 'medium' | 'high';
export type TrafficPattern = 'low' | 'steady' | 'unpredictable' | 'high';
export type Scalability = 'manual' | 'automatic';
export type Control = 'low' | 'medium' | 'high';
export type DevSpeed = 'low' | 'high';

export interface UserConstraints {
  budget: Budget;
  traffic: TrafficPattern;
  scalability: Scalability;
  control: Control;
  devSpeed: DevSpeed;
}

export interface ComparisonRow {
  feature: string;
  lambda: string;
  ec2: string;
  winner: 'lambda' | 'ec2' | 'neutral';
  reason: string;
}

export interface DecisionResult {
  comparisonTable: ComparisonRow[];
  prosCons: {
    lambda: { pros: string[]; cons: string[] };
    ec2: { pros: string[]; cons: string[] };
  };
  tradeoffExplanation: string;
}
