var promise = require("bluebird");
var _ = require("lodash");
var ModelFunc = require("./../app/controllers");
var User = require("./../app/models/user");
var Doc = require("./../app/models/document");
var Role = require("./../app/models/role");

exports.roleMock = function (testRoles) {
  return promise.mapSeries(testRoles, function (role) {
    return ModelFunc.roleFunc.createRole(new Array(role));
  });
};

exports.userMock = function (testUsers) {
  return promise.mapSeries(_.values(testUsers), function (userdata) {
    return ModelFunc.userFunc.createUser(userdata);
  });
};

exports.docMock = function (testDocs) {
  return promise.mapSeries(_.values(testDocs), function (doc) {
    return ModelFunc.docFunc.createDocument(doc);
  });
};

exports.parseData = function (keys, _data) {
  return _.zipObject(keys, _data);
};

exports.deleteModels = function (cb) {
  User.remove().exec(function (err) {
    if (err) {
      console.log("Users not removed");
      return;
    }
    Role.remove().exec(function (err) {
      if (err) {
        console.log("Roles not removed");
        return;
      }
      Doc.remove().exec(function (err) {
        if (err) {
          console.log("Users not removed");
          return;
        }
        cb();
      });
    });
  });
};