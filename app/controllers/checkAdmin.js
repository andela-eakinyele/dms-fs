var User = require("./../models/user");
var roleFunc = require("./roleMethods");
var cmMethods = require("./helpers");

/**
 * checks for Admin user
 * @param  {object} userData contains the data for new user
 * @return {promise}     status of admin user    
 */
module.exports = function (userData) {
  return new Promise(function (resolve, reject) {
    var query = User.findOne({
      role: 1
    });
    // check for admin user
    query.then(function (user) {
      if (user) {
        resolve({
          "status": true,
          "message": "Admin exists",
          "data": []
        });
      } else {
        // create admin if userData is admin
        if (userData.role === "Admin") {
          roleFunc.createAdmin().then(function () {
            resolve({
              "status": true,
              "message": "Create User as Admin",
              "data": []
            });
          }).catch(function (err) {
            resolve(err);
          });
        } else {
          // admin status false
          resolve({
            "status": 400,
            "message": "Create Admin User -role:Admin",
            "data": []
          });
        }
      }
    },
    function (err) {
      cmMethods.dberrors(reject, "querying database", err);
    });
  });
};