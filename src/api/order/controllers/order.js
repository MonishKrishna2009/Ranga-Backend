const { createCoreController } = require("@strapi/strapi").factories;
const stripe = require("stripe")(process.env.STRIPE_KEY);

// Import other necessary dependencies

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const { products, orderid } = ctx.request.body;

    try {
      const lineItems = await Promise.all(
        products.map(async (product) => {
          // Existing code...
        })
      );

      const session = await stripe.checkout.sessions.create({
        shipping_address_collection: { allowed_countries: ["IN"] },
        payment_method_types: ["card"],
        mode: "payment",
        success_url: process.env.CLIENT_URL + `/success?orderid=${orderid}`,
        cancel_url: process.env.CLIENT_URL + "/failed",
        line_items: lineItems,
      });

      return { stripeSession: session };
    } catch (error) {
      ctx.response.status = 500;
      return { error: "Payment failed" };
    }
  },
}));
