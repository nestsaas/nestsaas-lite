import { stripe } from "@/lib/stripe"
import {prisma} from "@/lib/prisma"
import { getCreditsForPrice } from "@/config/payments";

export async function syncStripeDataToDB(customerId: string, eventType?: string) {
  // 1. Get user and current subscription info
  const user = await prisma.user.findUnique({
    where: { stripeCustomerId: customerId },
    include: { subscription: true }
  });

  if (!user) {
    console.error(`User not found for customer ID: ${customerId}`);
    return;
  }

  // 2. Get latest subscription data from Stripe
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    limit: 1,
    status: "all",
    expand: ["data.default_payment_method", "data.items.data.price"],
  });
 
  // 3. If no subscription, update status and return
  if (subscriptions.data.length === 0) {
    const subData = { status: "none" };
    await prisma.subscription.update({
      where: { stripeCustomerId: customerId },
      data: { status: "none" }
    })
    return subData;
  }
 
  // If a user can have multiple subscriptions, that's your problem
  const subscription = subscriptions.data[0];
  const priceId = subscription.items.data[0].price.id
  const currentPriceId = user.subscription?.stripePriceId;
  const currentStatus = user.subscription?.status;
  const newStatus = subscription.status;

  // 4. Prepare update data
  const subData = {
    stripeSubscriptionId: subscription.id,
    stripePriceId: priceId,
    interval: subscription.items.data[0].price.recurring?.interval || "",
    status: newStatus,
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    extra: subscription.default_payment_method && 
          typeof subscription.default_payment_method !== "string"
      ? {
          brand: subscription.default_payment_method.card?.brand ?? null,
          last4: subscription.default_payment_method.card?.last4 ?? null,
        }
      : null,
  };

 
  // 5. Calculate credits change
  let creditsToAdd = 0;
  const creditsForNewPrice = getCreditsForPrice(priceId, true);
  const creditsForCurrentPrice = currentPriceId ? getCreditsForPrice(currentPriceId, true) : 0;

  // Only update credits on specific events or status changes
  const shouldUpdateCredits = 
    // New subscription
    (!user.subscription && newStatus === 'active') ||
    // Price change
    (priceId !== currentPriceId && newStatus === 'active') ||
    // Renewal (monthly/annual)
    (eventType === 'invoice.payment_succeeded' && 
     newStatus === 'active' && 
     priceId === currentPriceId);

  if (shouldUpdateCredits) {
    if (priceId !== currentPriceId) {
      // Price change: calculate difference
      creditsToAdd = Math.max(0, creditsForNewPrice - creditsForCurrentPrice);
    } else {
      // New subscription or renewal: add full credits
      creditsToAdd = creditsForNewPrice;
    }
  }

 
  // 6. Update subscription and increment user credits
  await prisma.$transaction(async (tx) => {
    // Update subscription info
    if (user.subscription) {
      await tx.subscription.update({
        where: { stripeCustomerId: customerId },
        data: {
          ...subData,
          extra: subData.extra ? subData.extra : undefined
        }
      });
    } else {
      await tx.subscription.create({
        data: {
          ...subData,
          extra: subData.extra ? subData.extra : undefined,
          user: { connect: { id: user.id } },
          stripeCustomerId: customerId
        }
      });
    }

    // Update credits
    if (creditsToAdd > 0) {
      await tx.user.update({
        where: { id: user.id },
        data: { credits: { increment: creditsToAdd } }
      });
    }
  })

  return subData;
}