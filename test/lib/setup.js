'use strict';

var chai = require('chai');
var sinon = require('sinon'); // jshint ignore: line
var sinonChai = require('sinon-chai');

chai.use(sinonChai);

global.expect = chai.expect;
global.sinon = sinon;
