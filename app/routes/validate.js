var jwt = require("jwt-simple");
var _ = require("lodash");
var userFunc = require("./../controllers");


var authenticate = function (req, res, next) {
  var token = req.headers.access_token;
  if (token) {
    try {
      var decoded = jwt.decode(token, require("./../config/secret.js")());
      if (decoded.exp <= Date.now()) {
        res.json({
          "status": false,
          "message": "Token Expired, redirect to login",
          "error": "Token expired"
        });
        return;
      } else {
        next();
      }
    } catch (err) {
      res.json({
        "status": false,
        "message": "Token not validated",
        "error": err
      });
    }
  } else {
    res.json({
      "status": false,
      "message": "Invalid Token or Key"
    });
    return;
  }
};
exports.authenticate = authenticate;

exports.authorize = function (req, res, next) {
  var query = {
    username: req.headers.username
  };
  userFunc.retrieveData(query).then(function (user) {
    if (user) {
      var admin = _.filter(user.role, function (role) {
        return role.title === "Admin";
      });
      if (admin.length) {
        next();
      } else {
        res.json({
          "status": false,
          "message": "Not authorized",
          "error": "Unauthorized user"
        });
      }
    } else {
      res.json({
        "status": false,
        "message": "User is not logged in/does not exists",
        "error": "User not verified"
      });
    }
  }).catch(function (err) {
    res.json(err);
  });
};

exports.adminUser = function (req, res, next) {
  if (req.body.role === "Admin") {
    var query = {
      role: 1
    };
    userFunc.retrieveData(query).then(function (user) {
      if (user) {
        if (user.username === req.headers.username) {
          authenticate(req, res, next);
        } else {
          res.json({
            "status": false,
            "message": "Not authorized to create Admin user",
            "error": "Unauthorized user action"
          });
        }
      } else {
        next();
      }
    }, function (err) {
      res.json({
        "status": false,
        "message": "Database error",
        "error": "User not verified " + err
      });
    });
  } else {
    next();
  }
};