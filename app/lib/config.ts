export const APP_CONFIG = {
  trialDays: 7,

  gumroad: {
    basic: "https://app.loadopsai.co/l/xobcwo",
    pro: "https://app.loadopsai.co/l/hladv",
    enterprise: "https://app.loadopsai.co/l/thxap",
  },
};

export function getUpgradeLink(
  plan: "free" | "trial" | "basic" | "pro" | "enterprise"
) {
  switch (plan) {
    case "basic":
      return APP_CONFIG.gumroad.pro;

    case "pro":
      return APP_CONFIG.gumroad.enterprise;

    default:
      return APP_CONFIG.gumroad.basic;
  }
}

export function getRecommendedPlan(
  plan: "free" | "trial" | "basic" | "pro" | "enterprise"
) {
  switch (plan) {
    case "basic":
      return "Pro";

    case "pro":
      return "Enterprise";

    default:
      return "Basic";
  }
}