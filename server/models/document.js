(function() {
  'use strict';
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var documentSchema = new Schema({
    _id: {
      type: Number,
      min: 100,
      required: true,
      default: 100,
      unique: true
    },
    ownerId: [{
      type: Number,
      ref: 'Users'
    }],
    label: {
      type: String
    },
    title: {
      type: String,
      required: (true, 'title is invalid')
    },
    content: {
      type: String,
      required: (true, 'content is invalid')
    },
    groupId: [{
      type: Number,
      ref: 'Groups'
    }],
    roles: [{
      type: Number,
      ref: 'Roles'
    }],
    dateCreated: {
      type: Date,
      default: Date.now
    },
    lastModified: {
      type: Date,
      default: Date.now
    }
  }, {
    strict: true
  });

  documentSchema.statics.getMaxId = function() {
    var query = this.find({}, '_id');
    return new Promise(function(resolve, reject) {
      query.then(function(ids) {
          resolve(ids);
        },
        function(err) {
          reject(Error(err));
        });
    });
  };

  documentSchema.statics.getDocsByOwnerId = function(ownerId, groupid, args) {
    var query = this.find({
        ownerId: ownerId
      })
      .where('groupId').in([groupid])
      .populate('groupId')
      .populate('roles')
      .populate({
        path: 'ownerId',
        select: 'username name'
      });



    if (args) {
      query = query.limit(args[0])
        .skip(args[0] * args[1])
        .sort('dateCreated');
    }

    return new Promise(function(resolve, reject) {
      query.then(function(docs) {
          resolve(docs);
        },
        function(err) {
          reject(Error(err));
        });
    });
  };

  documentSchema.statics.getDocsByOwnerIdCount = function(ownerId, groupid) {
    var countQuery = this.find({
        ownerId: ownerId
      })
      .where('groupId').in([groupid])
      .count();

    return new Promise(function(resolve, reject) {
      countQuery.then(function(count) {
        resolve(count);
      }, function(err) {
        reject(Error(err));
      });
    });
  };

  documentSchema.statics.getDocsByRole = function(roleId, groupId, args) {

    var query = this.find({
        groupId: groupId
      }).where('roles').in([roleId])
      .populate('groupId')
      .populate('roles')
      .populate({
        path: 'ownerId',
        select: 'username name'
      });

    if (args) {
      query = query.limit(args[0])
        .skip(args[0] * args[1])
        .sort('dateCreated');
    }

    return new Promise(function(resolve, reject) {
      query.then(function(docs) {
          resolve(docs);
        },
        function(err) {
          reject(Error(err));
        });
    });
  };

  documentSchema.statics.getDocsByRoleCount = function(roleId, groupId) {
    var countQuery = this.find({
        groupId: groupId
      }).where('roles').in([roleId])
      .count();

    return new Promise(function(resolve, reject) {
      countQuery.then(function(count) {
        resolve(count);
      }, function(err) {
        reject(Error(err));
      });
    });
  };

  module.exports = mongoose.model('Documents', documentSchema);
})();
