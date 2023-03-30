const express = require("express");
const subcription_route = express();
subcription_route.use(express.json());
subcription_route.use(express.urlencoded({ extended: false }));
const subcriptionController = require("../controller/subcriptionControler");

subcription_route.get("/prices", subcriptionController.getPrices);
subcription_route.post("/session", subcriptionController.setSessions);
module.exports = subcription_route;
subcription_route.post(
  "/checkSubcription",
  subcriptionController.checkSubcription
);
