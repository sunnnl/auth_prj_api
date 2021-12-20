const jwt = require("jsonwebtoken");
const secretOrPrivateKey = "jwtSecretKey!";
const accessOptions = {
  algorithm: "HS256",
  expiresIn: "1h"
};
const refreshOptions = {
  algorithm: "HS256",
  expiresIn: "24h * 14"
};

module.exports = {
  // sign: (user) => {
  //   const payload = {
  //     idx: user.idx,
  //     name: user.name
  //   };
  //   const result = {
  //     token: jwt.sign(payload, secretOrPrivateKey, options)
  //   };
  //   return result;
  // },

  checkToken: (req, res, next) => {
    let token = req.get("authorization");
    if (token) {
      token = token.slice(7);
      jwt.verify(token, "[Token]", (err, decoded) => {
        console.log(token)
        if (err) {
          return res.json({
            success: 0,
            message: "Invalid Token..."
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.json({
        success: 0,
        message: "Access Denied! Unauthorized User"
      });
    }
  }
};