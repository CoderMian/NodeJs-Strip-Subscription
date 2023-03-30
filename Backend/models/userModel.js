const mongoose = require("mongoose");
userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    confirm_password: {
      type: String,
      required: false,
    },
    phones: [{ type: String }],
    email: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    video: {
      type: String,
      required: true,
    },
    customerId: {
      type: String,
    },
    subscriptionStatus: {
      type: String,
    },
    isVerified: {
      type: Boolean,
    },
    isLogin: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Registered Users", userSchema);
