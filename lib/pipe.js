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