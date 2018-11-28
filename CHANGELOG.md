
# Changelog

## Roadmap

* seed: always a number, value "0" disable the feature
* Promise module API
* record_delimiter: rename from row_delimiter
* internal: store options in underscore form

## Version 3.2.0

* ts: new TypeScript definition files

## Version 3.1.0

* duration: fix start time
* package: MIT license (was BSD)
* sleep: new option

## Version 3.0.0

Breaking change:

* callback: generate buffers unless encoding is present

New features and bug fixes:

* options: accept underscore and came case keys
* eof: new option
* row_delimiter: new option
* travis: test agains Node.js 11

## Version 2.2.2

* readme: fix website urls

## Version 2.2.1

* readme: fix links to project website

## Version 2.2.0

* package: move to csv.js.org
* package: upgrade dependencies including babel 7
* options: new duration option
* samples: new api sync scripts
* samples: new objectmode scripts
* readme: remove api doc
* travis: support Node.js 10
* samples: update syntax
* package: improve ignore files

## Version 2.1.0

* sync: new module to ease synchronous usage

## Version 2.0.2

* package: move babel to dev dependencies

## Version 2.0.1

* package: es5 backward compatiblity
* package: ignore yarn lock file

## 2.0.0

This major version use CoffeeScript 2 which produces a modern JavaScript syntax 
(ES6, or ES2015 and later) and break the compatibility with versions of Node.js 
lower than 7.6 as well as the browsers. It is however stable in term of API.

* package: use CoffeeScript 2

## v1.1.2

* tests: remove references to coverage

## v1.1.0

* test: should require handled by mocha
* package: coffeescript 2 and use semver tilde
* options: validate column types, fix #4
