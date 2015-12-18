var routeMethods = require("./helpers");
// define creqte request body
var bodyKeys = ["title"];
// require controller
var roleFunc = require("./../controllers").roleFunc;

var roleRoutes = {
  createRole: function (req, res) {
    // generate object for new role data
    var roleData = routeMethods.parseReq(bodyKeys, req.body);
    roleFunc.createRole(roleData).then(function (result) {
      res.json(result);
    }).catch(function (err) {
      routeMethods.dberrors(res, "creating role", err); // db error
    });
  },

  updateRole: function (req, res) {
    var roleData = routeMethods.parseReq(bodyKeys, req.body);
    roleFunc.updateRole(roleData, req.params.id)
      .then(function (result) {
        res.json(result);
      }).catch(function (err) {
        routeMethods.dberrors(res, "updating role", err); // db error
      });
  },

  getRole: function (req, res) {
    roleFunc.getRole(req.params.id)
      .then(function (result) {
        res.json(result);
      }).catch(function (err) {
        routeMethods.dberrors(res, "getting role", err); // db error
      });
  },

  getAllRoles: function (req, res) {
    roleFunc.getAllRoles(req.body.limit)
      .then(function (result) {
        res.json(result);
      }).catch(function (err) {
        routeMethods.dberrors(res, "getting roles", err); // db error
      });
  },

  deleteRole: function (req, res) {
    roleFunc.deleteRole(req.params.id)
      .then(function (result) {
        res.json(result);
      }).catch(function (err) {
        routeMethods.dberrors(res, "deleting role", err); // db error
      });
  },

  getDocsById: function (req, res) {
    roleFunc.getDocsByRole(req.params.id)
      .then(function (result) {
        res.json(result);
      }).catch(function (err) {
        routeMethods.dberrors(res, "getting docs by role", err); // db error
      });
  }

};
module.exports = roleRoutes;