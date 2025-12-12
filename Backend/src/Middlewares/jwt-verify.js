const jwt = require("jsonwebtoken");

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "./config/.env",
  });
}

const verifyUser = (req, res, next) => {
  const { token } = req.query;

  if (!token) {
    return res.status(404).send({
      message: "Token is required in the request",
    });
  }

  try {
    const data = jwt.verify(token, process.env.SECRET_KEY);
    req.userEmailAddress = data.email;
    req.UserId = data.id;

    next();
  } catch (error) {
    return res.status(401).send({
      message: "Unauthorized: Invalid token",
    });
  }
};

module.exports = verifyUser;
