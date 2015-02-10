"use strict";

var Pipe = require('./pipe');

var Dispatcher = function (mapping) {
  this.mapping = mapping || {};
};

Dispatcher.prototype.register = function (action) {
  this.mapping[action] = Array.prototype.slice.call(arguments, 1);
};

Dispatcher.prototype.dispatch = function (action, data) {
  var middlewarePipe = this.mapping[action];

  if (!middlewarePipe) {
    throw new Error('Action ' + action + ' not found.');
  }

  new Pipe(data).execute(middlewarePipe);
};

module.exports = Dispatcher;