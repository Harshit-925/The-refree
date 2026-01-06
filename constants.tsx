
export const COMPARISON_FRAMEWORK = {
  costModel: {
    lambda: "Pay-per-execution (millis). Scalable to zero.",
    ec2: "Pay-per-instance-hour (fixed). No zero-scale.",
  },
  scalability: {
    lambda: "Native auto-scaling per request.",
    ec2: "Auto Scaling Groups (warm-up time required).",
  },
  performance: {
    lambda: "Cold starts possible; 15-min limit.",
    ec2: "Consistent latency; no execution limit.",
  },
  infrastructureControl: {
    lambda: "No OS access. Fully managed abstraction.",
    ec2: "Full root access. Customizable OS/stack.",
  },
  operationalComplexity: {
    lambda: "Low (Serverless, no patching).",
    ec2: "Medium/High (Patching, networking, maintenance).",
  },
};
