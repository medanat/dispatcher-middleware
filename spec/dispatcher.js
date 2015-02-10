var assert = require('chai').assert;

var Dispatcher = require('../lib/dispatcher');

describe("dispatcher", function (argument) {
  describe("#new", function () {
    it("should take a map of actions and middleware", function () {
      var dispatcher = new Dispatcher({
        action: [function () {}]
      });

      assert.ok(dispatcher);
    });
  });

  describe("#register", function () {
    it("should register an action with middleware", function (done) {
      var response = function (data) {
            assert(data.x, 1);
            done();
          };

      var dispatcher = new Dispatcher();

      dispatcher.register('action', response);
      dispatcher.dispatch('action', {x: 1});
    });

    it("should override a pre-registered action with a similar name", function (done) {

      var dontrigger = function (data) {
            assert.ok(false);
          },
          trigger = function (data) {
            assert.equal(data.x, 1);
            done();
          };

      var dispatcher = new Dispatcher();

      dispatcher.register('action', dontrigger);
      dispatcher.register('action', trigger);
      dispatcher.dispatch('action', {x: 1});
    });
  });

  describe("#dispatch", function () {
    it("should dispatch an action triggering it's middleware", function (done) {
      var mw1 = function (data, next) {
            data.x = 1;
            next();
          },
          response = function (data) {
            assert.equal(data.x, 1);

            done();
          };

      var dispatcher = new Dispatcher({
        action: [mw1, response]
      });

      dispatcher.dispatch('action');
    });

    it("should dispatch an action with data and trigger it's middleware", function (done) {
      var response = function (data) {
            assert.equal(data.x, 1);

            done();
          };

      var dispatcher = new Dispatcher({
        action: [response]
      });

      dispatcher.dispatch('action', {x: 1});
    });

    it("should throw an error not found when dispatching an unknown action", function () {
      var errFn = function () {
        new Dispatcher().dispatch('unknownaction');
      }

      assert.throws(errFn, Error, 'Action unknownaction not found.');
    });
  });
});