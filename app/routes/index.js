(function() {
  "use strict";
  var express = require("express");
  var router = express.Router();

  var auth = require("./auth");
  var validate = require("./validate");

  var userRoute = require("./userRoute");
  var docRoute = require("./docRoute");
  var roleRoute = require("./roleRoute");
  /*
   Routes that can be accessed by all users
   */
  router.get("/", function(req, res) {
    res.json({
      message: "Welcome to the Document Management System"
    });
  });

  router.post("/users/login", auth.login);
  router.post("/users", validate.adminUser, userRoute.createUser);

  /*
  Routes that can be accessed only by authenticated users
   */
  router.all("/*", validate.authenticate);
  router.get("/users/:id", userRoute.getUser);
  router.put("/users/:id", userRoute.updateUser);
  router.post("/documents", docRoute.createDoc);
  router.put("/documents/:id", docRoute.updateDoc);
  router.get("/users/:id/documents", docRoute.getDocsById);

  /*
  Routes that require owner/access validation
  */
  router.get("/documents/:id", docRoute.getDoc);
  router.delete("/documents/:id", docRoute.deleteDoc);

  /*
  Routes that can be accessed only by authenticated and authorized users
   */
  router.all("/*", validate.authorize);
  router.get("/documents", docRoute.getAllDocs);
  router.get("/users", userRoute.getAllUsers);
  router.delete("/users/:id", userRoute.deleteUser);

  router.post("/roles", roleRoute.createRole);
  router.put("/roles/:id", roleRoute.updateRole);
  router.get("/roles", roleRoute.getAllRoles);
  router.get("/roles/:id", roleRoute.getRole);
  router.get("/roles/:id/documents", roleRoute.getDocsById);
  router.post("/documents/date", docRoute.getDocsByDate);
  router.delete("/roles/:id", roleRoute.deleteRole);

  module.exports = router;
})();
