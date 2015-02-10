# dispatcher-middleware

A middleware control flow dispatcher similar to the middleware implementation of routes within [expressjs](http://expressjs.com/).

[![NPM version][npm-image]][npm-url]

## Installation
```bash
npm install dispatcher-middleware
```

## Usage

#### Basic Usage
```js
var Dispatcher = require('dispatcher-middleware').Dispatcher;

var dispatcher = new Dispatcher({
      myAction: [middlewareFn1, middlewareFn2, finalFn],
      myAsyncAction: [[asyncMiddlewareFn1, asyncMiddlewareFn2], finalFn]
    });
```

#### Middleware Functions

Middleware functions are passed a `data` object hash and a `next` function. Middleware functions pass data by appending the 
`data` object.

Middleware functions take the format:

```js
function (data, next) {
  data.x = 3;
  next();
}
```
And the final function call takes the format:
```js
function (data) {
  console.log(data.x); // 3
}
```

Any function can short circuit the middleware pipe by not calling `next()`.

Middleware functions are synchronous unless nested within an array. (Other than the leading array).

#### Asynchronous Middleware Functions (order does not matter) 

Nested arrays of middleware will run asynchronously.

##### Example
```js
function asyncMw1(data, next) {
  window.setTimeout(function () {
    data.x = 4;  
    next();
  }, 100);
}

function asyncMw2(data, next) {
  console.log(data.x); // undefined
  data.y = 3;
  next();
}

function final (data) {
  console.log(data.x + data.y); // 7
}

var Dispatcher = require('dispatcher-middleware').Dispatcher;

var dispatcher = new Dispatcher({
      myAction: [[asyncMw1, asyncMw2], final]
    });
```

#### Just the Middleware Pipe
```js
var Pipe = require('dispatcher-middleware').Pipe;

new Pipe.execute([middlewareFn1, middlewareFn2, final]);
```

## Contribute

#### Tests
```bash
npm test
```
#### Coverage
```bash
npm run-script coverage
```

## License
[MIT](https://tldrlegal.com/license/mit-license)

[npm-image]: https://img.shields.io/npm/v/dispatcher-middleware.svg?style=flat-square
[npm-url]: https://npmjs.org/package/dispatcher-middleware
