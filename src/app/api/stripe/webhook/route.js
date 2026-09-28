import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

/**
 * Stripe Webhook Handler
 *
 * This is the ONLY trusted way to mark a booking as "paid".
 * It verifies the stripe-signature header to confirm the event
 * came from Stripe, not from a forged client request.
 *
 * Required env var: STRIPE_WEBHOOK_SECRET
 * Get this from: https://dashboard.stripe.com/webhooks → "Signing secret"
 * For local testing: stripe listen --forward-to localhost:3000/api/stripe/webhook
 */
export async function POST(request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[Stripe Webhook] STRIPE_WEBHOOK_SECRET is not set in .env");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error(`[Stripe Webhook] Signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook signature error: ${err.message}` }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const bookingId = session.metadata?.bookingId;

    if (!bookingId) {
      console.warn("[Stripe Webhook] checkout.session.completed received but no bookingId in metadata");
      return NextResponse.json({ received: true });
    }

    try {
      // Fetch a server-side token to authenticate with our Express server
      // (uses internal server-to-server call — no user JWT needed)
      const payRes = await fetch(`${BASE_URL}/api/bookings/${bookingId}/pay/webhook`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-webhook-secret": process.env.STRIPE_WEBHOOK_SECRET,
        },
        body: JSON.stringify({
          stripeSessionId: session.id,
          amountPaid: session.amount_total, // in cents
          currency: session.currency,
        }),
      });

      if (!payRes.ok) {
        const errData = await payRes.json().catch(() => ({}));
        console.error(`[Stripe Webhook] Failed to confirm booking ${bookingId}:`, errData);
        // Return 200 to Stripe anyway so it doesn't keep retrying
        return NextResponse.json({ received: true, warning: "Booking update failed" });
      }

      console.log(`[Stripe Webhook] ✅ Booking ${bookingId} marked as paid via Stripe webhook`);
    } catch (err) {
      console.error(`[Stripe Webhook] Error calling backend pay endpoint:`, err);
    }
  }

  return NextResponse.json({ received: true });
}
