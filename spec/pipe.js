var assert = require('chai').assert;

var Pipe = require('../lib/pipe');

describe("pipe", function (argument) {
  describe("#execute", function () {
    it("executes a stand alone function", function (done) {
      var pipe = new Pipe;

      pipe.execute(function (data) {
        done();
      });
    });

    it("executes an array of middleware", function (done) {
      var pipe = new Pipe,
          mw1 = function (data, next) {
            data.x = 1;
            next();
          },
          mw2 = function (data, next) {
            data.y = 2;
            next();
          };


      pipe.execute([mw1, mw2, function (data) {
        assert.equal(data.x, 1);
        assert.equal(data.y, 2);

        done();
      }]);
    });

    it("executes an array of middleware in order", function (done) {
      var pipe = new Pipe,
          mw1 = function (data, next) {
            data.x = 1;
            next();
          },
          mw2 = function (data, next) {
            data.x++;
            next();
          };

      pipe.execute([mw1, mw2, function (data) {
        assert.equal(data.x, 2);

        done();
      }]);
    });

    it("executes nested arrays of middleware asynchronously", function (done) {
      var pipe = new Pipe,
          mw1 = function (data, next) {
            data.x = 1;
            next();
          },
          asyncMw1 = function (data, next) {
            setTimeout(function () {
              assert.equal(data.x, 2);
              data.x++;
              next();
            }, 100);
          },
          asyncMw2 = function (data, next) {
            data.x++;
            next();
          };

      pipe.execute([mw1, [asyncMw1, asyncMw2], function (data) {
        assert.equal(data.x, 3);

        done();
      }]);
    });
  });
});