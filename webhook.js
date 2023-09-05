// webhook.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = {
  webhook: async (ctx) => {
    const sig = ctx.request.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        ctx.request.rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return ctx.badRequest("Webhook Error");
    }

    // Handle the Stripe event (e.g., update your database based on the event type)
    switch (event.type) {
      case "payment_intent.succeeded":
        // Payment succeeded, update your database or perform other actions
        break;
      case "payment_intent.payment_failed":
        // Payment failed, handle as needed
        break;
      // Handle other event types as needed
    }

    ctx.send({ received: true });
  },
};
