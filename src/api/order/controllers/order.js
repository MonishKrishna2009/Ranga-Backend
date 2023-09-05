const { createCoreController } = require("@strapi/strapi").factories;
const stripe = require("stripe")(process.env.STRIPE_KEY);

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const { products, orderid } = ctx.request.body;

    try {
      const lineItems = await Promise.all(
        products.map(async (product) => {
          const item = await strapi
            .service("api::product.product")
            .findOne(product.id);

          return {
            price_data: {
              currency: "inr",
              product_data: {
                name: item.name,
              },
              unit_amount: Math.round(
                (item.size.data.find((size) => size.size === product.selectedSize)?.price || item.price) * 100
              ),
            },
            quantity: product.quantity,
          };
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
