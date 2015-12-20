var Role = require("./../models/role");
var Doc = require("./../models/document");
var cMthds = require("./helpers");
var roleKeys = ["title"];


var roleFunctions = {
  createAdmin: function () {
    var adminQuery = Role.find({
      title: "Admin"
    });
    return cMthds.gCreate("Roles", {
      title: "Admin"
    }, Role, adminQuery);
  },

  createRole: function (title) {
    var roleData = cMthds.parseData(roleKeys, title);
    var query = Role.find({
      title: roleData.title
    });
    return cMthds.gCreate("Roles", roleData, Role, query);
  },

  getAllRoles: function (limit) {
    var query = Role.find({});
    if (limit) {
      query = query.limit(limit);
    }
    return cMthds.gGetAll("Roles", query);
  },

  getRole: function (id) {
    var query = Role.findOne({
      _id: id
    });
    return cMthds.gGetOne("Roles", query, id);
  },

  getDocsByRole: function (id) {
    return new Promise(function (resolve, reject) {
      Doc.getDocsByRole(id).then(function (data) {
        if (data.length) {
          resolve({
            "status": 200,
            "message": "Document for role-" + id,
            "data": data
          });
        } else {
          resolve({
            "status": 200,
            "message": "No Document exist for role-" + id,
            "data": []
          });
        }
      }).catch(function (err) {
        cMthds.dberrors(reject, "querying database", err);
      });
    });
  },

  updateRole: function (title, id) {
    var roleData = cMthds.parseData(roleKeys, title);
    var query = Role.findByIdAndUpdate(id, roleData, {
      new: true
    });
    return cMthds.gUpdate("Roles", id, query);
  },

  deleteRole: function (id) {
    var query = Role.findByIdAndRemove(id);
    return cMthds.gDelete("Roles", query, id);
  }

};

module.exports = roleFunctions;