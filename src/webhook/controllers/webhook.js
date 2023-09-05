module.exports = {
  webhook: async (ctx) => {
    try {
      const event = ctx.request.body;

      // Handle the event based on its type
      switch (event.type) {
        case "checkout.session.completed":
          // Extract orderid from the event data
          const orderid = event.data.object.metadata.orderid;

          // Update your database with the order status
          // You can use strapi queries to update the order status
          // Example:
          // const updatedOrder = await strapi.query('order').update({ orderid }, { status: 'completed' });

          // Log the successful payment event
          console.log("Payment succeeded:", orderid);
          break;

        default:
          // Handle other event types or ignore them
          break;
      }

      ctx.send("Webhook Received"); // Respond to Stripe to acknowledge receipt
    } catch (error) {
      console.error("Webhook Error:", error);
      ctx.response.status = 500;
      ctx.send("Webhook Error");
    }
  },
};