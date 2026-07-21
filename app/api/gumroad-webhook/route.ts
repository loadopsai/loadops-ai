import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ── Config ────────────────────────────────────────────────────────────────────

const PRODUCT_PLAN_MAP: Record<string, string> = {
  xobcwo: "basic",      // $19
  hladv:  "pro",        // $49
  thxap:  "enterprise", // $99
};

const GUMROAD_SALE_URL = "https://api.gumroad.com/v2/sales";
const FETCH_TIMEOUT_MS = 10_000;

class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new HttpError(500, "Server misconfiguration: Supabase credentials missing");
  }
  // Service role key — never expose this client to the browser.
  return createClient(url, serviceKey);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function fetchWithTimeout(url: string, timeoutMs = FETCH_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Gumroad's webhook "ping" is not cryptographically signed, so the payload
 * alone can't be trusted — anyone who knows the endpoint URL could forge a
 * POST claiming any email/product/sale_id. To actually verify the sale is
 * real, we call back to Gumroad's Sales API with your access token and
 * confirm the sale_id exists, belongs to your account, and matches the
 * email + product the ping claims.
 */
async function verifySaleWithGumroad(
  saleId: string,
  expectedEmail: string,
  expectedPermalink: string
): Promise<void> {
  const accessToken = process.env.GUMROAD_ACCESS_TOKEN;
  if (!accessToken) {
    // Fail closed: without a way to verify, we should not trust the payload.
    throw new HttpError(500, "Server misconfiguration: Gumroad verification not configured");
  }

  const url = `${GUMROAD_SALE_URL}/${encodeURIComponent(saleId)}?access_token=${encodeURIComponent(accessToken)}`;
  const res = await fetchWithTimeout(url);

  if (!res.ok) {
    throw new HttpError(502, "Could not verify sale with Gumroad");
  }

  const data = await res.json().catch(() => null);

  if (!data?.success || !data?.sale) {
    throw new HttpError(403, "Gumroad could not confirm this sale");
  }

  const sale = data.sale;
  const saleEmail = String(sale.email ?? "").toLowerCase().trim();
  const salePermalink = String(sale.product_permalink ?? sale.permalink ?? "");

  if (saleEmail !== expectedEmail) {
    throw new HttpError(403, "Sale email does not match the claimed purchaser");
  }
  if (salePermalink !== expectedPermalink) {
    throw new HttpError(403, "Sale product does not match the claimed product");
  }
  if (sale.refunded || sale.chargebacked) {
    throw new HttpError(409, "This sale has been refunded or charged back");
  }
}

// ── Route ─────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, error: "Invalid form data" }, { status: 400 });
    }

    const emailRaw     = body.get("email");
    const permalink     = body.get("permalink");
    const saleId        = body.get("sale_id");
    const refunded       = body.get("refunded");   // Gumroad sends "true"/"false" strings
    const chargebacked   = body.get("chargebacked");

    if (typeof emailRaw !== "string" || typeof permalink !== "string" || typeof saleId !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing required fields: email, permalink, sale_id" },
        { status: 400 }
      );
    }

    const email = emailRaw.toLowerCase().trim();
    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, error: "Invalid email" }, { status: 400 });
    }

    const plan = PRODUCT_PLAN_MAP[permalink];
    if (!plan) {
      // Previously this silently defaulted to "basic" for ANY unrecognized
      // permalink — including typos or products you don't sell — granting
      // paid access for free. Now it's rejected outright.
      console.warn(`Gumroad webhook: unrecognized permalink "${permalink}" for sale ${saleId}`);
      return NextResponse.json(
        { success: false, error: "Unrecognized product" },
        { status: 400 }
      );
    }

    // ── Verify the sale is real before granting anything ─────────────────────
    await verifySaleWithGumroad(saleId, email, permalink);

    const supabase = getSupabase();
    const isRefundEvent = refunded === "true" || chargebacked === "true";

    if (isRefundEvent) {
      const { error } = await supabase
        .from("user_plans")
        .update({ plan: "free", expires_at: new Date().toISOString() })
        .eq("email", email)
        .eq("gumroad_sale_id", saleId);

      if (error) {
        console.error("Supabase refund downgrade error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, action: "downgraded" });
    }

    const { error } = await supabase
      .from("user_plans")
      .upsert(
        {
          email,
          plan,
          expires_at: null,
          gumroad_sale_id: saleId,
        },
        { onConflict: "email" }
      );

    if (error) {
      console.error("Supabase upsert error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, action: "granted", plan });

  } catch (err: unknown) {
    if (err instanceof HttpError) {
      console.error(`GUMROAD WEBHOOK ERROR [${err.status}]:`, err.message);
      return NextResponse.json({ success: false, error: err.message }, { status: err.status });
    }
    if (err instanceof Error && err.name === "AbortError") {
      console.error("GUMROAD WEBHOOK ERROR: Gumroad verification timed out");
      return NextResponse.json({ success: false, error: "Verification timed out" }, { status: 504 });
    }
    console.error("GUMROAD WEBHOOK ERROR:", err);
    return NextResponse.json({ success: false, error: "Unexpected server error" }, { status: 500 });
  }
}