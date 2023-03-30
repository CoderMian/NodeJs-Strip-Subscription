const port = 4000;
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const cors = require("cors");
app.set("view engine", "ejs");

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

//adding routes
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const payment_router = require("./routes/paymentRoute");
const subcriptionRoute = require("./routes/subcriptionRouter");
app.use("/subcription", subcriptionRoute);
app.use("/api", productRoute);
app.use("/api", userRoute, express.static("uploads"));
app.use("/api", payment_router);
//listen in port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
//connecting to mongoose dataase
mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://noman:mian3434@cluster0.xwiknkz.mongodb.net/Products?retryWrites=true&w=majority"
    // "mongodb://localhost:27017"
  )
  .then(() => {
    console.log("connected to the database");
  })
  .catch((error) => {
    console.log("connection failed", error);
  });
