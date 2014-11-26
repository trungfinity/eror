'use strict';

var defineProperty = Object.defineProperty;
var toString = ({}).toString;

exports.isNumber = function (n) {
  return (toString.call(n) === '[object Number]');
};

exports.endsWith = function (s, suffix) {
  return (s.slice(-suffix.length) === suffix);
};

exports.alias = function (obj, dest, src) {
  defineProperty(obj, dest, {
    get: function () {
      return obj[src];
    },
    set: /* istanbul ignore next */ function (value) {
      return (obj[src] = value);
    }
  });
};
