'use strict';

var inherits = require('util').inherits;
var format = require('util').format;

var commonErrors = require('./error/common');
var httpErrors = require('./error/http');

var util = require('./util');

var slice = [].slice;

var eror = module.exports = function (statusCode) {
  var args = slice.call(arguments);

  if (util.isNumber(statusCode)) {
    statusCode = ~~statusCode;
    args.shift();

  } else {
    statusCode = 500;
  }

  var message = format.apply(null, args);
  var err = create(statusCode, message);

  Error.captureStackTrace(err, Error);

  return err;
};

commonErrors.forEach(function (message) {
  expose(500, message);
});

for (var statusCode in httpErrors) {
  /* istanbul ignore next */
  if (httpErrors.hasOwnProperty(statusCode)) {
    expose(Number(statusCode), httpErrors[statusCode]);
  }
}

function expose(defaultStatusCode, defaultMessage) {
  var name = defaultMessage.replace(/([\w']+)(\s|$)/g, function (all, word) {
    word = word.replace(/[^\w]/g, '');
    return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
  });

  if (!util.endsWith(name, 'Error')) {
    name = name + 'Error';
  }

  var allowStatusCodeOverriding = (httpErrors[defaultStatusCode] !== defaultMessage);

  eror[name] = function (statusCode, message) {
    var args = slice.call(arguments);

    if (util.isNumber(statusCode)) {
      statusCode = ~~statusCode;

      if (!allowStatusCodeOverriding && statusCode !== defaultStatusCode) {
        throw eror('Status code of HTTP error cannot be overridden!');
      }

      args.shift();

    } else {
      message = statusCode;
      statusCode = defaultStatusCode;
    }

    if (message) {
      message = format.apply(null, args);
    } else {
      message = defaultMessage;
    }

    var err = create(statusCode, message);

    err.__proto__ = eror[name].prototype;
    Error.captureStackTrace(err, eror[name]);

    return err;
  };

  eror[name].STATUS_CODE = defaultStatusCode;
  eror[name].MESSAGE = defaultMessage;

  util.alias(eror[name], 'STATUS', 'STATUS_CODE');

  inherits(eror[name], Error);
}

function create(statusCode, message) {
  if (statusCode < 400 || statusCode > 599) {
    throw eror('Bad status code, must be in range of 400-599!');
  }

  var err = new Error();

  err.statusCode = statusCode;
  err.message = message;

  util.alias(err, 'status', 'statusCode');

  return err;
}
