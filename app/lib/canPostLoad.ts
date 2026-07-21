import { supabase } from "@/app/lib/supabase";
import {
  getBrokerLoadLimit,
  getDispatcherLoadLimit,
} from "@/app/lib/permissions";

type Plan = "trial" | "free" | "basic" | "pro" | "enterprise";

export async function canPostBrokerLoad(
  userId: string,
  plan: Plan
) {
  const limit = getBrokerLoadLimit(plan);

  if (limit === Infinity) {
    return { allowed: true };
  }

  const { count, error } = await supabase
    .from("loads")
    .select("*", { count: "exact", head: true })
    .eq("broker_id", userId);

  if (error) {
    return {
      allowed: false,
      message: error.message,
    };
  }

  if ((count ?? 0) >= limit) {
    return {
      allowed: false,
      message: `You've reached your ${plan} plan limit of ${limit} active load(s). Please upgrade your plan.`,
    };
  }

  return { allowed: true };
}

export async function canPostDispatcherLoad(
  userId: string,
  plan: Plan
) {
  const limit = getDispatcherLoadLimit(plan);

  if (limit === Infinity) {
    return { allowed: true };
  }

  const { count, error } = await supabase
    .from("dispatcher_loads")
    .select("*", { count: "exact", head: true })
    .eq("dispatcher_id", userId);

  if (error) {
    return {
      allowed: false,
      message: error.message,
    };
  }

  if ((count ?? 0) >= limit) {
    return {
      allowed: false,
      message: `You've reached your ${plan} plan limit of ${limit} active load(s). Please upgrade your plan.`,
    };
  }

  return { allowed: true };
}