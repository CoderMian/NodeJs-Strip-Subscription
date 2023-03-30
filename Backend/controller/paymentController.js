const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const { v4: uuidv4 } = require("uuid");
const stripeKey =
  "sk_test_51MnglXL0GTUOyfP9Le7RdkzNl4cpZjOD6ZcV5Tm51B55HkCyy7D7v7j3HciW24ESlRsOv4tl3WlK5wvPNJeCPbSD00GKqmTfq5";
const stripe = require("stripe")(stripeKey);
exports.setStripePayment = async (req, res) => {
  const idempotencyKey = uuidv4();
  //check customer in stripe
  const customer = await stripe.customers.list({ email: req.body.email });
  if (customer.data.length > 0) {
    const customerObj = customer.data[0];
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerObj.id,
      type: "card",
    });
    console.log("charges", paymentMethods.data[0].id);
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: req.body.product.quantity * 100,
        currency: "usd",
        customer: customerObj.id,
        receipt_email: req.body.token.email,
        description: req.body.product.name,
        shipping: {
          name: req.body.token.card.name,
          address: { country: req.body.token.card.address_country },
        },
        payment_method: paymentMethods.data[0].id,
        off_session: true,
        confirm: true,
      },
      { idempotencyKey: idempotencyKey }
    );
    res.json(paymentMethods.data[0].id);
  } else {
    res.status(401).json({ message: "user not register with stripe account" });
  }
};
