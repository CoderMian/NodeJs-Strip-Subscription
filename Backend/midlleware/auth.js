const jwt = require("jsonwebtoken");
const secretKey = "amianminhjkiqwklmnfkiknhgknfewnbgkoirtnbghjls";
authMiddleWare = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return res.status(401).json({ message: "Token Not found" });
  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(401).json({ message: "Token is Expired" });
    req.user = user;
    next();
  });
};
module.exports = authMiddleWare;
