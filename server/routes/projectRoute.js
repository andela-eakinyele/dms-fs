(function() {
  'use strict';
  var routeMethods = require('./helpers');
  // define creqte request body
  var bodyKeys = ['title', 'roles'];
  // require controller
  var projectFunc = require('./../controllers').projectFunc;

  var projectRoutes = {
    create: function(req, res) {
      // generate object for new project data
      var projectData = routeMethods.parseReq(bodyKeys, req.body);
      projectFunc.createProject(projectData).then(function(result) {
        res.status(result.status).json(result.data);
      }).catch(function(err) {
        routeMethods.dberrors(res, 'creating project', err); // db error
      });
    },
    // updateProject: function(req, res) {
    //   var projectData = routeMethods.parseReq(bodyKeys, req.body);
    //   projectFunc.updateproject(projectData, req.params.id)
    //     .then(function(result) {
    //       res.status(result.status).json(result);
    //     }).catch(function(err) {
    //       routeMethods.dberrors(res, 'updating project', err); // db error
    //     });
    // },

    // getProject: function(req, res) {
    //   projectFunc.getproject(req.params.id)
    //     .then(function(result) {
    //       res.status(result.status).json(result);
    //     }).catch(function(err) {
    //       routeMethods.dberrors(res, 'getting project', err); // db error
    //     });
    // },

    all: function(req, res) {
      projectFunc.getAllProjects()
        .then(function(result) {
          res.status(result.status).json(result.data);
        }).catch(function(err) {
          routeMethods.dberrors(res, 'getting projects', err); // db error
        });
    },

    // deleteProject: function(req, res) {
    //   projectFunc.deleteproject(req.params.id)
    //     .then(function(result) {
    //       res.status(result.status).json(result);
    //     }).catch(function(err) {
    //       routeMethods.dberrors(res, 'deleting project', err); // db error
    //     });
    // }


  };
  module.exports = projectRoutes;
})();
