(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
  Dispatcher: require('./lib/dispatcher'),
  Pipe: require('./lib/pipe')
};
},{"./lib/dispatcher":2,"./lib/pipe":3}],2:[function(require,module,exports){
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
},{"./pipe":3}],3:[function(require,module,exports){
"use strict";

var Pipe = function (data) {
  this.data = data || {};
};

Pipe.prototype.execute = function (middlewarePipe) {
  var data = this.data;

  if (typeof middlewarePipe === 'function') {
    middlewarePipe(data);
  } else if (Array.isArray(middlewarePipe)) {
    var next = function () {
      var middleware = middlewarePipe.shift();

      if (typeof middleware === 'function') {
        middleware(data, next);
      } else if (Array.isArray(middleware)) {
        var lock = middleware.length,
            unlock = function () {
              if (!--lock) {
                next();
              }
            };

        middleware.forEach(function (middleware) {
          middleware(data, unlock);
        });
      }
    };

    next();
  }
};

module.exports = Pipe;
},{}]},{},[1]);
