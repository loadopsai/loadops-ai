export const PLAN_LIMITS = {
    trial: {
    brokerLoads: Infinity,
    dispatcherLoads: Infinity,
    bookings: Infinity,
    aiAlerts: false,
    routePlanner: false,
    emailMatching: false,
  },

  free: {
    brokerLoads: 0,
    dispatcherLoads: 0,
    bookings: 0,
    aiAlerts: false,
    routePlanner: false,
    emailMatching: false,
  },

  basic: {
    brokerLoads: 1,
    dispatcherLoads: 1,
    bookings: 10,
    aiAlerts: false,
    routePlanner: false,
    emailMatching: false,
  },

  pro: {
    brokerLoads: 10,
    dispatcherLoads: 10,
    bookings: Infinity,
    aiAlerts: true,
    routePlanner: false,
    emailMatching: true,
  },

  enterprise: {
    brokerLoads: Infinity,
    dispatcherLoads: Infinity,
    bookings: Infinity,
    aiAlerts: true,
    routePlanner: true,
    emailMatching: true,
  },
} as const;

export type PlanName = keyof typeof PLAN_LIMITS;