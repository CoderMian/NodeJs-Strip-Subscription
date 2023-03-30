const express = require("express");
const payment_router = express();
const bodyParser = require("body-parser");
payment_router.use(bodyParser.json());
payment_router.use(bodyParser.urlencoded({ extended: false }));
const paymentController = require("../controller/paymentController");
//stripe route
payment_router.post("/payment", paymentController.setStripePayment);
module.exports = payment_router;
