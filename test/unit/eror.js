'use strict';

var eror = require('../..');

var commonErrors = require('./error/common');
var httpErrors = require('./error/http');

var util = require('../lib/util');

var errors = {};

util.assign(errors, commonErrors);
util.assign(errors, httpErrors);

describe('eror', function () {
  it('should create custom error', function () {
    var err = eror();
    expect(err).to.be.instanceOf(Error);
  });

  it('should use default status code of 500', function () {
    var err = eror('Boom!');
    expect(err).to.have.property('statusCode', 500);
    expect(err).to.have.property('status', 500);
  });

  it('should allow overriding status code', function () {
    var err = eror(499);
    expect(err).to.have.property('statusCode', 499);
  });

  it('should not allow out-of-range status code', function () {
    expect(function () {
      eror(399);
    }).to.throw(Error);
  });

  it('should format error message', function () {
    var err = eror('Hello %s %d %j!', 'world', 3.14, { foo: 'bar' });
    expect(err).to.have.property('message', 'Hello world 3.14 {"foo":"bar"}!');
  });

  for (var name in errors) {
    if (!errors.hasOwnProperty(name)) {
      continue;
    }

    (function (name) {
      describe('.' + name, function () {
        it('should be a valid error class', function () {
          var err = new eror[name]();
          expect(err).to.be.instanceOf(eror[name]);
          expect(err).to.be.instanceOf(Error);
        });

        it('should have default status code', function () {
          expect(eror[name]).to.have.property('STATUS_CODE', errors[name].statusCode);
          expect(eror[name]).to.have.property('STATUS', errors[name].statusCode);
        });

        it('should have default error message', function () {
          expect(eror[name]).to.have.property('MESSAGE', errors[name].message);
        });

        it('should use default status code if not set', function () {
          var err = new eror[name]();
          expect(err).to.have.property('statusCode', eror[name].STATUS_CODE);
          expect(err).to.have.property('status', eror[name].STATUS_CODE);
        });

        it('should use default error message if not set', function () {
          var err = new eror[name]();
          expect(err).to.have.property('message', eror[name].MESSAGE);
        });

        if (commonErrors[name]) {
          it('should allow overriding status code', function () {
            var err = new eror[name](499);
            expect(err).to.have.property('statusCode', 499);
          });

          it('should not allow out-of-range status code', function () {
            expect(function () {
              new eror[name](399); // jshint ignore: line
            }).to.throw(Error);
          });

        } else {
          it('should not allow overriding status code', function () {
            expect(function () {
              new eror[name](499); // jshint ignore: line
            }).to.throw(Error);
          });
        }

        it('should format error message', function () {
          var err = new eror[name]('Hello %s %d %j!', 'world', 3.14, { foo: 'bar' });
          expect(err).to.have.property('message', 'Hello world 3.14 {"foo":"bar"}!');
        });
      });
    })(name); // jshint ignore: line
  }
});
