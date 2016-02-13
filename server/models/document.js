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

  documentSchema.statics.getDocsByOwnerId = function(ownerId, groupid) {
    var query = this.find({
        ownerId: ownerId
      })
      .where('groupId').in([groupid])
      .populate('groupId')
      .populate('roles')
      .populate({
        path: 'ownerId',
        select: 'username name'
      }).sort('dateCreated');
    return new Promise(function(resolve, reject) {
      query.then(function(docs) {
          console.log(docs);
          resolve(docs);
        },
        function(err) {
          reject(Error(err));
        });
    });
  };

  documentSchema.statics.getDocsByDate = function(date) {
    var st = new Date(date);
    var end = (new Date(date)).setDate(st.getDate() + 1);
    var edt = new Date(end);
    var query = this.find({}).where('dateCreated').gt(st).lt(edt).populate({
      path: 'ownerId',
      select: 'username'
    }).sort('dateCreated');
    return new Promise(function(resolve, reject) {
      query.then(function(docs) {
          resolve(docs);
        },
        function(err) {
          reject(Error(err));
        });
    });
  };

  documentSchema.statics.getDocsByRole = function(roleId, groupId) {
    var doc = this;
    return new Promise(function(resolve, reject) {
      var query = doc.find({
          groupId: groupId
        }).where('roles').in([roleId])
        .populate({
          path: 'roles',
          select: 'title'
        }).sort('dateCreated');
      query.then(function(docs) {
          resolve(docs);
        },
        function(err) {
          reject(Error(err));
        });
    });
  };

  module.exports = mongoose.model('Documents', documentSchema);
})();
