export const UPGRADE_LINKS = {
  basic: "https://app.loadopsai.co/l/xobcwo",
  pro: "https://app.loadopsai.co/l/hladv",
  enterprise: "https://app.loadopsai.co/l/thxap",
};

export function getUpgradeLink(
  plan: "free" | "trial" | "basic" | "pro" | "enterprise"
) {
  switch (plan) {
    case "basic":
      return UPGRADE_LINKS.pro;

    case "pro":
      return UPGRADE_LINKS.enterprise;

    case "trial":
    case "free":
    default:
      return UPGRADE_LINKS.basic;
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

    case "trial":
    case "free":
    default:
      return "Basic";
  }
}