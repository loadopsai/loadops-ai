import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { loadId } = await req.json();

    // Get load
    const { data: load } = await supabase
      .from("loads")
      .select("*")
      .eq("id", loadId)
      .single();

    if (!load) {
      return NextResponse.json({
        success: false,
        error: "Load not found",
      });
    }

    // Get active subscribers
    const { data: subscribers } = await supabase
      .from("ai_alert_subscribers")
      .select("*")
      .eq("active", true);

    const matches = [];

    for (const subscriber of subscribers || []) {

      const equipmentMatch =
        subscriber.equipment
          ?.toLowerCase()
          .includes(load.equipment?.toLowerCase());

      const pickupMatch =
        !subscriber.location ||
        load.pickup_city
          ?.toLowerCase()
          .includes(subscriber.location.toLowerCase());

      const deliveryMatch =
        !subscriber.delivery ||
        load.delivery_city
          ?.toLowerCase()
          .includes(subscriber.delivery.toLowerCase());

      const rateMatch =
        !subscriber.min_rate ||
        Number(load.total_rate || load.rate || 0) >=
        Number(subscriber.min_rate);

      if (
        equipmentMatch &&
        pickupMatch &&
        deliveryMatch &&
        rateMatch
      ) {
        matches.push({
          email: subscriber.email,
          company: subscriber.company_name,
        });
      }
    }

    return NextResponse.json({
      success: true,
      load,
      matches,
      totalMatches: matches.length,
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error,
    });
  }
}