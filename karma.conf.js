module.exports = function (config) {
  config.set({
    frameworks: ['browserify', 'mocha'],

    reporters: ['mocha'],

    files: [
      'spec/**/*.js'
    ],

    preprocessors: {
      'spec/**/*.js': [ 'browserify' ]
    },

    browserify: {
      debug: true
    }
  });
};