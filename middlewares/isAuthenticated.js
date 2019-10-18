var User = require("../models/Users_model");

module.exports = async (req, res, next) => {
  if (req.headers.authorization) {
    User.findOne(
      { token: req.headers.authorization.replace("Bearer ", "") },
      function(err, user) {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        if (!user) {
          //console.log("");
          return res.status(401).json({ error: "Unauthorized" });
        } else {
          req.user = user;

          return next();
        }
      }
    );
  } else {
    return res.status(401).json({ error: "erre" });
  }
};
