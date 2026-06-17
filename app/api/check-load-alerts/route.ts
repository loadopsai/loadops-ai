import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Get all active subscribers
    const { data: subscribers } = await supabase
      .from("ai_alert_subscribers")
      .select("*")
      .eq("active", true);

    // Get latest loads
    const { data: loads } = await supabase
      .from("loads")
      .select("*");

    if (!subscribers || !loads) {
      return Response.json({ success: false });
    }

    for (const sub of subscribers) {
      for (const load of loads) {

        const equipmentMatch =
          sub.equipment &&
          sub.equipment.toLowerCase().includes(
            load.equipment?.toLowerCase()
          );

        if (!equipmentMatch) continue;

        await resend.emails.send({
          from: "alerts@yourdomain.com",
          to: sub.email,
          subject: `🚛 New Matching Load Found`,
          html: `
            <h2>LoadOps AI Alert</h2>

            <p><strong>Equipment:</strong> ${load.equipment}</p>
            <p><strong>Pickup:</strong> ${load.pickup_city}</p>
            <p><strong>Delivery:</strong> ${load.delivery_city}</p>
            <p><strong>Rate:</strong> $${load.rate}</p>

            <br/>
            <p>Posted on LoadOps AI</p>
          `,
        });
      }
    }

    return Response.json({
      success: true,
      subscribers: subscribers.length,
      loads: loads.length,
    });
  } catch (err) {
    console.log(err);

    return Response.json({
      success: false,
    });
  }
}