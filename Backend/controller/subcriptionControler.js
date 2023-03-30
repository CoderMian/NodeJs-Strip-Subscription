const User = require("../models/userModel");
const stripeKey =
  "sk_test_51MnglXL0GTUOyfP9Le7RdkzNl4cpZjOD6ZcV5Tm51B55HkCyy7D7v7j3HciW24ESlRsOv4tl3WlK5wvPNJeCPbSD00GKqmTfq5";
const stripe = require("stripe")(stripeKey);
exports.getPrices = async (req, res) => {
  const prices = await stripe.prices.list({
    apiKey: stripeKey,
  });
  console.log(prices);
  return res.status(200).json(prices);
};
//create customer session
exports.setSessions = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  //check if there is any current subcription..........
  const currentSubscription = await stripe.subscriptions.list(
    {
      customer: user.customerId,
      status: "all",
      expand: ["data.default_payment_method"],
    },
    {
      apiKey: stripeKey,
    }
  );

  if (currentSubscription) {
    deleteAllSubscriptions();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: req.body.priceid,
          quantity: 1,
        },
      ],
      success_url: "http://localhost:3000/showData",
      cancel_url: "http://localhost:3000/subcriptionPlan",
      customer: user.customerId,
    });
    console.log("New subscription plan created:", session.id);

    return res.status(200).json({ message: "update", data: session });
  }

  // create subcription............
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: req.body.priceid,
        quantity: 1,
      },
    ],
    success_url: "http://localhost:3000/showData",
    cancel_url: "http://localhost:3000/subcriptionPlan",
    customer: user.customerId,
  });

  console.log("New subscription plan created:", session.id);

  return res.status(200).json({ message: "created", data: session });
};

const deleteAllSubscriptions = async () => {
  const subscriptions = await stripe.subscriptions.list({ limit: 100 });

  for (const subscription of subscriptions.data) {
    await stripe.subscriptions.del(subscription.id);
  }
};

exports.checkSubcription = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const subscriptions = await stripe.subscriptions.list(
    {
      customer: user.customerId,
      status: "all",
      expand: ["data.default_payment_method"],
    },
    {
      apiKey: stripeKey,
    }
  );
  if (!subscriptions.data.length) {
    return res.json({
      subcription: "none",
    });
  }
  const plan = subscriptions.data[0].plan.interval;
  res.status(200).json(plan);
};
