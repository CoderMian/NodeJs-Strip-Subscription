const express = require("express");
const user_router = express();
const bodyParser = require("body-parser");
const authMiddleWare = require("../midlleware/auth");
const userController = require("../controller/userController");
user_router.use(express.json());
user_router.use(bodyParser.json());
user_router.use(bodyParser.urlencoded({ extended: false }));
user_router.use(express.urlencoded({ extended: false }));
const multer = require("multer");
const fs = require("fs");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({
  storage: storage,
});
user_router.post(
  "/signup",

  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "video",
      maxCount: 1,
    },
  ]),
  userController.registerUser
);

user_router.post("/logout", authMiddleWare, userController.logoutUser);
user_router.post(
  "/resetPassword",

  userController.resetPassword
);
user_router.get("/getProfile", authMiddleWare, userController.getProfile);
user_router.post("/singleUser", userController.singleUser);
user_router.get("/verify", userController.verifyMail);
user_router.post("/login", userController.loginUser);
user_router.get("/get", authMiddleWare, userController.getUser);
module.exports = user_router;
