var User = require("./../models/user");
var Role = require("./../models/role");
var checkAdmin = require("./checkAdmin");

var cMthds = require("./helpers");
var uKeys = ["name.first", "name.last", "username",
  "password", "role", "email"
];

function getCompareRoles(username, cb) {
  // query for user access
  var queryUser = User.findOne({
    username: username
  }).populate({
    path: "role",
    select: "title"
  });
  return new Promise(function (resolve, reject) {
    cMthds.gGetOne("Users", queryUser, "").then(function (userResult) {
      if (userResult.status) {
        // find matching role for user and document
        var userRoles = userResult.data.role;
        var matchFind = userRoles.filter(function (value) {
          return value.title === "Admin";
        });
        resolve(cb(matchFind, userResult.data));
      } else {
        resolve(userResult);
      }
    }).catch(function (errUser) {
      cMthds.dberrors(reject, "querying database", errUser);
    });
  });
}

var userFunctions = {
  createUser: function (_userData) {
    var userData = cMthds.parseData(uKeys, _userData);
    // query definition for existing user data
    var query = User.find({}).or(
      [{
        email: userData.email
      }, {
        username: userData.username
      }]).select("username name").populate({
      path: "role",
      select: "title"
    });
    return new Promise(function (resolve, reject) {
      checkAdmin(userData).then(function (result) {
        if (result.status === true) {
          Role.findOne({
            title: userData.role
          }, "_id").then(function (_role) {
              if (_role) {
                userData.role = _role._id;
                resolve(cMthds.gCreate("Users", userData, User, query));
              } else {
                resolve({
                  "status": 400,
                  "message": "Invalid role specified \"" + userData.role +
                    "\" does not exist",
                  "data": []
                });
              }
            },
            function (err) {
              cMthds.dberrors(reject, "querying database", err);
            });
        } else {
          resolve(result);
        }
      }).catch(function (err) {
        cMthds.dberrors(reject, "querying database", err);
      });
    });
  },

  getAllUsers: function (limit) {
    var query = User.find({}).select("username email role name").populate({
      path: "role",
      select: "title"
    });
    if (limit) {
      query = query.limit(limit);
    }
    return cMthds.gGetAll("Users", query);
  },

  getUser: function (id) {
    var query = User.findOne({
      _id: id
    }).select("username email role name").populate({
      path: "role",
      select: "title"
    });
    return cMthds.gGetOne("Users", query, id);
  },

  updateUser: function (_userData, hid, username) {
    var userData = cMthds.parseData(uKeys, _userData);
    return new Promise(function (resolve, reject) {
      Role.findOne({
        title: userData.role
      }, "_id").then(function (_role) {
          if (_role) {
            userData.role = _role._id;
            resolve(getCompareRoles(username, function (matchFind, user) {
              if (matchFind.length !== 0 || user._id === parseInt(hid)) {
                var query = User.findByIdAndUpdate(hid, userData, {
                  new: true
                });
                return cMthds.gUpdate("Users", hid, query);
              } else {
                return {
                  "status": 403,
                  "message": "Not authorized to update user",
                  "data": []
                };
              }
            }));
          } else {
            resolve({
              "status": 400,
              "message": "Invalid role specified '" + userData.role +
                "' does not exist",
              "data": []
            });
          }
        },
        function (err) {
          cMthds.dberrors(reject, "querying database", err);
        });
    });
  },

  deleteUser: function (id) {
    var query = User.findByIdAndRemove(id);
    return cMthds.gDelete("Users", query, id);
  },

  retrieveAllData: function (search) {
    var query = User.find(search).populate("role");
    return cMthds.gFind("Users", query);
  },

  retrieveData: function (search) {
    var query = User.findOne(search).populate({
      path: "role",
      select: "title"
    }).select("username role email firstname lastname");
    return cMthds.gFind("Users", query);
  }
};

module.exports = userFunctions;