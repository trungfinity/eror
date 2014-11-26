# eror

[![NPM version][meta-img-npm]][meta-url-npm]
[![Build status][meta-img-travis]][meta-url-travis]
[![Coveralls status][meta-img-coveralls]][meta-url-coveralls]
[![Support us][meta-img-gratipay]][meta-url-gratipay]

Error utilities which provide error classes for HTTP response (4xx, 5xx) and more.

## Installation

```sh
$ npm install eror
```

## Example

```js
// Formatted message
new eror.InvalidTypeError('"%s" must be a string!', 'name');

// Custom status code
new eror.MissingValueError(400, '"%s" is required!', 'age');

// Pre-defined HTTP errors
new eror.NotFoundError('User "%s" not found!', 'paul');

// Custom errors
eror(503, 'The Earth is %s!', 'exploding');
```

## API reference

### eror([statusCode], [message || format], [...values])

Create a custom error.

```js
eror(401, 'You are not logged in!');
eror('Welcome, %s %s.', 'John', 'Lennon');
```

* `statusCode`: Status code as a number, defaults to 500.
* `message`: Error message.
* `format`: Placeholder string, please refer to
[util.format][url-nodejs-util-format] for more details.
* `...values`: Values to be placed in placeholder string.

### new eror\[name\]([statusCode], [message || format], [...values])

Instantiate a new common error.

```js
new eror.MissingValueError(400, '"%s" field is required!', 'name');
```

* `name`: Class name of the error, as specified in [common error list](#common-errors).
* `statusCode`: Status code, if is not specified, default status code, 500, will be used.
* `message`, `format` and `...values`: as in [eror()](#erorstatuscode-message--format-values).

### new eror\[name || statusCode\]([message || format], [...values])

Instantiate a new HTTP error.

```js
new eror.NotFoundError('Requested resource not found!');
new eror[500]('Server exploded at %s!', new Date());
```

* `name`: Class name of the error, as specified in [HTTP error list](#http-errors).
* `statusCode`: Status code of HTTP error.
* `message`, `format` and `...values`: as in [eror()](#erorstatuscode-message--format-values).

HTTP error's status code cannot be overridden.

### Error properties

```js
var err = eror(404, 'Nothing!');

err.message; // Nothing!
err.statusCode; // 404
err.status; // also 404
```

* `message`
* `statusCode` and `status`: Status code of the error.

### Error class properties

```js
eror.InternalServerError.MESSAGE; // Internal Server Error
eror.InternalServerError.STATUS_CODE; // 500
eror.InternalServerError.STATUS; // also 500
```

* `MESSAGE`: Default error message of errors which are instantiate from this class.
* `STATUS_CODE` and `STATUS`: Default status code.

### Error list

#### Common errors

| Class name                | Status code |
| ------------------------- |:-----------:|
| UnsupportedOperationError |     500     |
| ReversedNameError         |     500     |
| NameAlreadyDefinedError   |     500     |
| InvalidOperationError     |     500     |
| InvalidTypeError          |     500     |
| MissingValueError         |     500     |
| InvalidValueError         |     500     |

#### HTTP errors

| Class name                         | Status code |
| ---------------------------------- |:-----------:|
| BadRequestError                    |     400     |
| UnauthorizedError                  |     401     |
| PaymentRequiredError               |     402     |
| ForbiddenError                     |     403     |
| NotFoundError                      |     404     |
| MethodNotAllowedError              |     405     |
| NotAcceptableError                 |     406     |
| ProxyAuthenticationRequiredError   |     407     |
| RequestTimeoutError                |     408     |
| ConflictError                      |     409     |
| GoneError                          |     410     |
| LengthRequiredError                |     411     |
| PreconditionFailedError            |     412     |
| PayloadTooLargeError               |     413     |
| UriTooLongError                    |     414     |
| UnsupportedMediaTypeError          |     415     |
| RangeNotSatisfiableError           |     416     |
| ExpectationFailedError             |     417     |
| ImATeapotError                     |     418     |
| UnprocessableEntityError           |     422     |
| LockedError                        |     423     |
| FailedDependencyError              |     424     |
| UnorderedCollectionError           |     425     |
| UpgradeRequiredError               |     426     |
| PreconditionRequiredError          |     428     |
| TooManyRequestsError               |     429     |
| RequestHeaderFieldsTooLargeError   |     431     |
| UnableForLegalReasonsError         |     451     |
| InternalServerError                |     500     |
| NotImplementedError                |     501     |
| BadGatewayError                    |     502     |
| ServiceUnavailableError            |     503     |
| GatewayTimeoutError                |     504     |
| HttpVersionNotSupportedError       |     505     |
| VariantAlsoNegotiatesError         |     506     |
| InsufficientStorageError           |     507     |
| LoopDetectedError                  |     508     |
| BandwidthLimitExceededError        |     509     |
| NotExtendedError                   |     510     |
| NetworkAuthenticationRequiredError |     511     |

## Contributing

* [Submit new issue][repo-url-new-issue] if there is any common error, which is
useful for you or others, unavailable.

* In lieu of a formal styleguide, take care to maintain the existing coding style.
  [.editorconfig][repo-editorconfig] and [.jshintrc][repo-jshintrc] files can give you
  more details.

* Add tests for any new or changed functionality/element.

* Lint and test your code using `npm test`.

### Author

* Website: [http://meo.guru][url-meoguru-website]
* Twitter: [@meoguru][url-meoguru-twitter]

## License

Released under [MIT license][repo-license].

[//]: # (Site URLs)
[url-editorconfig]: http://editorconfig.org
[url-jshint-docs]: http://www.jshint.com/docs
[url-nodejs-util-format]: http://nodejs.org/api/util.html#util_util_format_format

[//]: # (Repository URLs and resources)
[repo-url-new-issue]: https://github.com/meoguru/eror/issues/new
[repo-url-pull-request]: https://github.com/meoguru/eror/pulls
[repo-license]: https://github.com/meoguru/eror/blob/master/LICENSE
[repo-editorconfig]: https://github.com/meoguru/eror/blob/master/.editorconfig
[repo-jshintrc]: https://github.com/meoguru/eror/blob/master/.jshintrc
[repo-examples]: https://github.com/meoguru/eror/tree/master/examples

[//]: # (Repository meta information)
[meta-url-npm]: https://npmjs.org/package/eror
[meta-img-npm]: https://img.shields.io/npm/v/eror.svg?style=flat
[meta-url-travis]: https://travis-ci.org/meoguru/eror
[meta-img-travis]: https://img.shields.io/travis/meoguru/eror.svg?style=flat
[meta-url-coveralls]: https://coveralls.io/r/meoguru/eror
[meta-img-coveralls]: https://img.shields.io/coveralls/meoguru/eror/master.svg?style=flat
[meta-url-gratipay]: https://gratipay.com/meoguru
[meta-img-gratipay]: https://img.shields.io/gratipay/meoguru.svg?style=flat

[//]: # (Author URLs)
[url-meoguru-website]: http://meo.guru
[url-meoguru-twitter]: http://twitter.com/meoguru
