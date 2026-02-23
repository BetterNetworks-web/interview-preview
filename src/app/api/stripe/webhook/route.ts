import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      if (userId) {
        await supabase.from("subscriptions").upsert(
          {
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            plan: "pro",
            status: "active",
          },
          { onConflict: "user_id" }
        );
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const status = subscription.status;

      await supabase
        .from("subscriptions")
        .update({
          status: status === "active" ? "active" : "cancelled",
          plan: status === "active" ? "pro" : "free",
        })
        .eq("stripe_subscription_id", subscription.id);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;

      await supabase
        .from("subscriptions")
        .update({ status: "cancelled", plan: "free" })
        .eq("stripe_subscription_id", subscription.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
