
import { UserConstraints, ComparisonRow } from './types';
import { COMPARISON_FRAMEWORK } from './constants';

export const calculateDecisionTable = (constraints: UserConstraints): ComparisonRow[] => {
  const table: ComparisonRow[] = [];

  // 1. Cost Model Heuristic
  let costWinner: 'lambda' | 'ec2' | 'neutral' = 'neutral';
  let costReason = "";
  if (constraints.traffic === 'low' || constraints.traffic === 'unpredictable') {
    costWinner = 'lambda';
    costReason = "Lambda's pay-per-request model prevents waste during idle periods.";
  } else if (constraints.traffic === 'steady' || constraints.traffic === 'high') {
    costWinner = 'ec2';
    costReason = "EC2 reserved instances can be 70% cheaper for sustained 24/7 loads.";
  }
  table.push({
    feature: "Cost Efficiency",
    lambda: COMPARISON_FRAMEWORK.costModel.lambda,
    ec2: COMPARISON_FRAMEWORK.costModel.ec2,
    winner: costWinner,
    reason: costReason
  });

  // 2. Scalability Heuristic
  let scaleWinner: 'lambda' | 'ec2' | 'neutral' = 'neutral';
  let scaleReason = "";
  if (constraints.scalability === 'automatic') {
    scaleWinner = 'lambda';
    scaleReason = "Lambda handles rapid spikes instantly without warm-up config.";
  } else {
    scaleWinner = 'ec2';
    scaleReason = "EC2 offers fine-grained control over instance warm-up and cluster sizes.";
  }
  table.push({
    feature: "Scalability Speed",
    lambda: COMPARISON_FRAMEWORK.scalability.lambda,
    ec2: COMPARISON_FRAMEWORK.scalability.ec2,
    winner: scaleWinner,
    reason: scaleReason
  });

  // 3. Control Heuristic
  let controlWinner: 'lambda' | 'ec2' | 'neutral' = 'neutral';
  let controlReason = "";
  if (constraints.control === 'high') {
    controlWinner = 'ec2';
    controlReason = "EC2 provides full root access; Lambda restricts you to high-level runtimes.";
  } else {
    controlWinner = 'lambda';
    controlReason = "Low-control preference allows Lambda to handle the heavy lifting.";
  }
  table.push({
    feature: "Infra Control",
    lambda: COMPARISON_FRAMEWORK.infrastructureControl.lambda,
    ec2: COMPARISON_FRAMEWORK.infrastructureControl.ec2,
    winner: controlWinner,
    reason: controlReason
  });

  // 4. Ops Complexity
  let opsWinner: 'lambda' | 'ec2' | 'neutral' = 'neutral';
  let opsReason = "";
  if (constraints.devSpeed === 'high') {
    opsWinner = 'lambda';
    opsReason = "Lambda removes the need to manage OS patches or networking layers.";
  } else {
    opsWinner = 'neutral';
    opsReason = "EC2 requires dedicated DevOps resources but offers more visibility.";
  }
  table.push({
    feature: "Operational Overhead",
    lambda: COMPARISON_FRAMEWORK.operationalComplexity.lambda,
    ec2: COMPARISON_FRAMEWORK.operationalComplexity.ec2,
    winner: opsWinner,
    reason: opsReason
  });

  return table;
};
