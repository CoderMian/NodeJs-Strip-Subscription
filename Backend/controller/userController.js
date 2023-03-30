const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { response } = require("../routes/productRoute");
const { default: mongoose } = require("mongoose");
const userId = require("mongoose").ObjectId;
const jwt = require("jsonwebtoken");
const stripeKey =
  "sk_test_51MnglXL0GTUOyfP9Le7RdkzNl4cpZjOD6ZcV5Tm51B55HkCyy7D7v7j3HciW24ESlRsOv4tl3WlK5wvPNJeCPbSD00GKqmTfq5";
const stripe = require("stripe")(stripeKey);
const nodemailer = require("nodemailer");
//jwt secret key
const secretKey = "amianminhjkiqwklmnfkiknhgknfewnbgkoirtnbghjls";

//for send mail
const sendVerifyMail = async (name, email, user_id) => {
  try {
    //google smtp
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "muhammadnomantariq1999@gmail.com",
        pass: "lhzxioltyrsczcrg",
      },
    });
    const mailOptions = {
      from: "muhammadnomantariq1999@gmail.com",
      to: email,
      subject: "For verification mail",
      html:
        "<p>Hi " +
        name +
        ', please click here to <a href="http://localhost:4000/api/verify?id=' +
        user_id +
        '" Verify </a>your mail.<p>',
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email has been Sent:-", info.response);
      }
    });
  } catch (error) {
    console.log("error in mail sending.....");
  }
};
//mail verfiaction
exports.verifyMail = async (req, res) => {
  try {
    const updated = await User.updateOne(
      { _id: req.query.id },
      { $set: { isVerified: true } }
    );
    res.render("email");
  } catch (error) {
    console.log(error.message);
  }
};
//Register User in the databsase
//password always encrytp
exports.registerUser = async (req, res) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length > 0) {
        console.log("user already exist");
        return res.status(401).json({
          msg: "User Already Exist!!!",
        });
      }
      stripe.customers.create(
        {
          email: req.body.email,
          name: req.body.name,
          description: "New Stripe Customer Create When User Sign Up",
        },
        (err, customer) => {
          if (err) {
            console.error(
              "----------------error customer not created----------------",
              err
            );
          } else {
            console.log("Customer created successfully:");
            //setting the data from front end if customer created sucssefully......

            const avatarFile = req.files["avatar"][0].filename;
            const videoFile = req.files["video"][0].filename;
            console.log("videos", videoFile);
            bcrypt.hash(req.body.password, 10, (err, hash) => {
              if (err) {
                return response.status(500).json({
                  error: err,
                });
              } else {
                const user = new User({
                  _id: new mongoose.Types.ObjectId(),
                  name: req.body.name,
                  password: hash,
                  confirm_password: hash,
                  phones: req.body.phones,
                  email: req.body.email,
                  isLogin: false,
                  image: avatarFile,
                  video: videoFile,
                  customerId: customer.id,
                  isVerified: false,
                  subscriptionStatus: "none",
                });
                user
                  .save()
                  .then((response) => {
                    res.status(200).json({
                      newUser: response,
                    });
                    //mail verification
                    sendVerifyMail(req.body.name, req.body.email, response._id);
                  })
                  .catch((error) => {
                    res.status(500).json({
                      error: error,
                    });
                  });
              }
            });
          }
        }
      ); //create customer end
    });
};
//get user
exports.getUser = async (req, res) => {
  try {
    const user = await User.find({});
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get single user
exports.singleUser = async (req, res) => {
  console.log("request user email", req.body.email);
  const user = await User.findOne({ email: req.body.email });
  console.log("single user", user);
  if (!user) {
    res.status(500).json({ message: "User Not Found" });
  } else {
    res.status(200).json({ user });
  }
};

//login user handling
exports.loginUser = async (req, res) => {
  console.log("requested email", req.body.email);
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      console.log("user login...", user);
      if (user.length < 1) {
        return res.status(401).json({
          msg: "user not found",
        });
      }

      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (!result) {
          console.log("password not match");
          return res.status(401).json({
            message: "password matching Fail",
          });
        }
        if (result) {
          //set login true
          updateLogin(user[0]._id);
          checkCurrentSubcription(user[0].email, user[0]._id);
          const payload = {
            username: user[0].name,
            email: user[0].email,
            phones: user[0].phones,
            image: user[0].image,
            video: user[0].video,
            customerId: user[0].customerId,
            isVerified: user[0].isVerified,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 2 * 60 * 60,
          };
          const jwtToken = jwt.sign(payload, secretKey);

          res.status(200).json({
            name: user[0].name,
            email: user[0].email,
            phones: user[0].phones,
            image: user[0].image,
            video: user[0].video,
            customerId: user[0].customerId,
            isVerified: user[0].isVerified,
            isLogin: user[0].isLogin,
            token: jwtToken,
            mySubscriptions: user[0].subscriptionStatus,
          });
        }
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
        message: "fail",
      });
    });
};
// user profile route
exports.getProfile = async (req, res) => {
  const user = await User.findOne({
    isLogin: true,
  });

  checkCurrentSubcription(user.email, user._id);

  console.log("phones", user.phones);
  res.status(200).json({
    name: user.name,
    email: user.email,
    phones: user.phones,
    image: user.image,
    video: user.video,
    customerId: user.customerId,
    isVerified: user.isVerified,
    isLogin: user.isLogin,
    mySubscriptions: user.subscriptionStatus,
  });
};
//update the login
const updateLogin = async (id) => {
  try {
    const updated = await User.updateOne(
      { _id: id },
      { $set: { isLogin: true } }
    );
  } catch (error) {
    console.log("error", error);
  }
};
exports.logoutUser = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  try {
    const updated = await User.updateOne(
      { _id: user._id },
      { $set: { isLogin: false } }
    );
    console.log("user logout status is updated");
  } catch (error) {
    console.log("error", error);
  }
  res.json("user logout");
};

const checkCurrentSubcription = async (myemail, id) => {
  const user = await User.findOne({ email: myemail });
  console.log("email from subcription----", myemail);
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

  try {
    const updated = await User.updateOne(
      { _id: id },
      { $set: { subscriptionStatus: subscriptions.data[0].plan.interval } }
    );
  } catch (error) {
    console.log("error", error);
  }
};

exports.resetPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(500).json({ message: "Email Not Found" });
    return;
  } else {
    bcrypt.hash(req.body.newpassword, 10, (err, hash) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "password encryption failed" });
        return;
      }
      console.log(hash);
      const updation = resetPass(user._id, hash);
      if (updation) {
        res.status(200).json("updated");
      } else {
        res.status(500).json({ message: "Not updated" });
      }
    });
  }
};

const resetPass = async (id, pass) => {
  try {
    const updated = await User.updateOne(
      { _id: id },
      { $set: { password: pass } }
    );
    console.log("updated");
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};
