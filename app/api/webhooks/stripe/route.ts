
import { NextRequest, NextResponse } from "next/server.js";
import { headers } from "next/headers.js";
import { waitUntil } from "@vercel/functions";
import Stripe from "stripe";

import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"
import { syncStripeDataToDB } from "@/lib/stripe-sync";
import { getCreditsForPrice } from "@/config/payments";

const tryCatch = async <T>(p: Promise<T>) => {
  try {
    const data = await p;
    return { data, error: null };
  } catch (error) {
    return { error, data: null };
  }
};

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature");
 
  if (!signature || !body) return NextResponse.json({}, { status: 400 });
 
  async function doEventProcessing() {
    if (typeof signature !== "string") {
      throw new Error("[STRIPE HOOK] Header isn't a string???");
    }
 
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
 
    waitUntil(processEvent(event));
  }
 
  const { error } = await tryCatch(doEventProcessing());
 
  if (error) {
    console.error("[STRIPE HOOK] Error processing event", error);
  }
 
  return NextResponse.json({ received: true });
}

const subscriptionEvents : Stripe.Event.Type[] = [
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.paused",
  "customer.subscription.resumed",
  "customer.subscription.pending_update_applied",
  "customer.subscription.pending_update_expired",
  "customer.subscription.trial_will_end",
  "invoice.upcoming",
]

// purchase 依赖事件即可，subscription 依赖stripe最新状态
const paymentEvents : Stripe.Event.Type[] = [
  // "payment_intent.succeeded", // 这个不必要，会与checkout.session.completed重复
  // "payment_intent.canceled", // 这个也不必要关心
  "payment_intent.payment_failed",
  "charge.refunded",
]

const bothEvents : Stripe.Event.Type[] = [
  "checkout.session.completed",
  "invoice.paid",
  "invoice.payment_failed",
  "invoice.payment_action_required",
  "invoice.marked_uncollectible",
  "invoice.payment_succeeded",
]

const allowedEvents: Stripe.Event.Type[] = [
  ...bothEvents,
  ...subscriptionEvents,
  ...paymentEvents,
];

async function processEvent(event: Stripe.Event) {
  // Skip processing if the event isn't one I'm tracking (list of all events below)
  if (!allowedEvents.includes(event.type)) return;

  if (paymentEvents.includes(event.type)) {
    return processPurchaseEvent(event);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.mode === 'payment') {
      return processPurchaseEvent(event);
    }
  }
 
  let isSubscriptionEvent = false;
  // Deal with purchase related events
  if (subscriptionEvents.includes(event.type)) {
    isSubscriptionEvent = true;
  }
  if (bothEvents.includes(event.type)) {
    const object = event.data.object as { subscription?: string };
    if (Boolean(object.subscription)) {
      isSubscriptionEvent = true;
    }
  }

  if (!isSubscriptionEvent) return;

  // Deal with subscription related events
  const { customer: customerId } = event?.data?.object as { customer?: string };
  if (customerId) {
    return syncStripeDataToDB(customerId, event.type);
  }
}

async function processPurchaseEvent(event: Stripe.Event) {
  let session: Stripe.Checkout.Session | null = null;
  let paymentIntent: Stripe.PaymentIntent | null = null;

  // Get related data based on event type
  if (event.type === 'checkout.session.completed') {
    session = event.data.object as Stripe.Checkout.Session;
    paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string);
  } 
  if (!session || !paymentIntent) return;

  const purchaseId = session.metadata?.purchaseId;
  if (!purchaseId) return;

  // Get purchase item information
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
  const priceId = lineItems.data[0]?.price?.id;
  const creditsToAdd = priceId ? getCreditsForPrice(priceId, false) : 0;

  // Update purchase record based on payment status
  let status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' = 'PENDING';
  
  if (event.type === 'checkout.session.completed') {
    status = 'COMPLETED';
  } else if (event.type === 'payment_intent.payment_failed') {
    status = 'FAILED';
  } else if (event.type === 'charge.refunded') {
    status = 'REFUNDED';
  }

  // Get or create purchase record
  const existingPurchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
    select: { 
      status: true,
      stripePaymentIntentId: true,
      userId: true
    }
  });

  if (!existingPurchase) {
    console.error(`Purchase not found: ${purchaseId}`);
    return;
  }

  // Check if the purchase has already been processed
  if (status === 'COMPLETED' && existingPurchase.status === 'COMPLETED') {
    return;
  }

  // Use transaction to ensure data consistency
  await prisma.$transaction(async (tx) => {
    // Update purchase record
    const updatedPurchase = await tx.purchase.update({
      where: { id: purchaseId },
      data: {
        status,
        stripePaymentIntentId: paymentIntent.id,
        completedAt: status === 'COMPLETED' ? new Date() : undefined,
      }
    });

    // Only update user credits when status changes to COMPLETED and creditsToAdd is greater than 0
    if (status === 'COMPLETED' && creditsToAdd > 0) {
      // Recheck status to avoid concurrent issues
      if (existingPurchase.status !== 'COMPLETED') {
        await tx.user.update({
          where: { id: updatedPurchase.userId },
          data: { 
            credits: { 
              increment: creditsToAdd 
            } 
          }
        });
      }
    }

    // Handle refund
    if (status === 'REFUNDED' && creditsToAdd > 0) {
      // Only deduct credits if the purchase was previously completed
      if (existingPurchase.status === 'COMPLETED') {
        await tx.user.update({
          where: { id: updatedPurchase.userId },
          data: { 
            credits: { 
              decrement: creditsToAdd 
            } 
          }
        });
      }
    }
  });
}