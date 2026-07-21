import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

type Plan = "trial" | "free" | "basic" | "pro" | "enterprise";

export function usePlan() {
  const [plan, setPlan] = useState<Plan>("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
  .from("user_plans")
  .select("plan, expires_at")
  .eq("email", user.email)
  .single();

      if (data?.plan === "trial") {
  const now = new Date();
  const expiry = new Date(data.expires_at);

  if (expiry > now) {
    setPlan("trial");
  } else {
    // Trial expired → update database
    const { error } = await supabase
  .from("user_plans")
  .update({
    plan: "free",
    expires_at: null,
  })
  .eq("email", user.email);

if (!error) {
  setPlan("free");
} else {
  console.error(error);
}
  }
} else {
  setPlan((data?.plan as Plan) || "free");
}
      setLoading(false);
    };

    fetchPlan();
  }, []);

  return {
  plan,
  loading,
 isTrial: plan === "trial",
 isFree: plan === "free",
  isBasic:
  plan === "basic" ||
  plan === "pro" ||
  plan === "enterprise",

isPro:
  plan === "pro" ||
  plan === "enterprise",

isEnterprise:
  plan === "enterprise",

canUseRoutePlanner:
  plan === "enterprise",
};
}