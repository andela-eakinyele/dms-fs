(function() {
  'use strict';
  var express = require('express');
  var router = express.Router();

  var auth = require('./auth');
  var validate = require('./validate');

  var userRoute = require('./userRoute');
  var docRoute = require('./docRoute');
  var roleRoute = require('./roleRoute');
  /*
   Routes that can be accessed by all users
   */
  router.get('/', function(req, res) {
    res.json({
      message: 'Welcome to the Document Management System'
    });
  });

  router.post('/users/login', auth.login);
  router.post('/users', validate.adminUser, userRoute.createUser);

  /*
  Routes that can be accessed only by authenticated users
   */
  router.all('/*', validate.authenticate);
  router.route('/users/:id')
    .get(userRoute.getUser)
    .put(userRoute.updateUser);
  router.post('/documents', docRoute.createDoc);
  router.put('/documents/:id', docRoute.updateDoc);
  router.get('/users/:id/documents', docRoute.getDocsById);

  /*
  Routes that require owner/access validation
  */
  router.route('/documents/:id')
    .get(docRoute.getDoc)
    .delete(docRoute.deleteDoc);

  /*
  Routes that can be accessed only by authenticated and authorized users
   */
  router.all('/*', validate.authorize);
  router.get('/documents', docRoute.getAllDocs);
  router.get('/users', userRoute.getAllUsers);
  router.delete('/users/:id', userRoute.deleteUser);
  router.route('/roles')
    .post(roleRoute.createRole)
    .get(roleRoute.getAllRoles);
  router.route('/roles/:id')
    .get(roleRoute.getRole)
    .put(roleRoute.updateRole)
    .delete(roleRoute.deleteRole);
  router.get('/roles/:id/documents', roleRoute.getDocsById);
  router.post('/documents/date', docRoute.getDocsByDate);

  module.exports = router;
})();
