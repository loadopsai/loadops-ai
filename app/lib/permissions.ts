import { PLAN_LIMITS, PlanName } from "./planLimits";

export function getPlanLimits(plan: PlanName) {
  return PLAN_LIMITS[plan];
}

export function canUseAIAlerts(plan: PlanName) {
  return PLAN_LIMITS[plan].aiAlerts;
}

export function canUseRoutePlanner(plan: PlanName) {
  return PLAN_LIMITS[plan].routePlanner;
}

export function canUseEmailMatching(plan: PlanName) {
  return PLAN_LIMITS[plan].emailMatching;
}

export function getBrokerLoadLimit(plan: PlanName) {
  return PLAN_LIMITS[plan].brokerLoads;
}

export function getDispatcherLoadLimit(plan: PlanName) {
  return PLAN_LIMITS[plan].dispatcherLoads;
}

export function getBookingLimit(plan: PlanName) {
  return PLAN_LIMITS[plan].bookings;
}