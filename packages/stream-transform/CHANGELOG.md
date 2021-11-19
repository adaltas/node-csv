# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.3](https://github.com/adaltas/node-csv/compare/stream-transform@3.0.2...stream-transform@3.0.3) (2021-11-19)


### Bug Fixes

* expose browser esm modules ([eb87355](https://github.com/adaltas/node-csv/commit/eb873557c65912f065d2581d30a17a96b0bfd2d6))





## [3.0.2](https://github.com/adaltas/node-csv/compare/stream-transform@3.0.1...stream-transform@3.0.2) (2021-11-18)


### Bug Fixes

* dont insert polyfills in cjs [#303](https://github.com/adaltas/node-csv/issues/303) ([9baf334](https://github.com/adaltas/node-csv/commit/9baf334044dab90b4a0d096a7e456d0fd5807d5b))





## [3.0.1](https://github.com/adaltas/node-csv/compare/stream-transform@3.0.0...stream-transform@3.0.1) (2021-11-15)


### Bug Fixes

* remove samples from publicatgion ([12c221d](https://github.com/adaltas/node-csv/commit/12c221dc37add26f094e3bb7f94b50ee06ff5be6))





# [3.0.0](https://github.com/adaltas/node-csv/compare/stream-transform@2.1.3...stream-transform@3.0.0) (2021-11-15)


### Bug Fixes

* **csv-generate:** finish called twice in node 16 ([3decdf1](https://github.com/adaltas/node-csv/commit/3decdf169ce3b8e0c5cadd257816c346c8e4d3fa))
* export original lib esm modules ([be25349](https://github.com/adaltas/node-csv/commit/be2534928ba21156e9cde1e15d2e8593d62ffe71))
* fallback to setTimeout is setImmediate is undefined ([3d6a2d0](https://github.com/adaltas/node-csv/commit/3d6a2d0a655af342f28456b46db7ccfe7ee9d664))
* refer to esm files in dist ([b780fbd](https://github.com/adaltas/node-csv/commit/b780fbd26f5e54494e511eb2e004d3cdedee3593))


### Features

* backport support for node 14 ([dbfeb78](https://github.com/adaltas/node-csv/commit/dbfeb78f61ed36f02936d63a53345708ca213e45))
* backward support for node 8 ([496231d](https://github.com/adaltas/node-csv/commit/496231dfd838f0a6a72269a5a2390a4c637cef95))
* esm migration ([b5c0d4b](https://github.com/adaltas/node-csv/commit/b5c0d4b191c8b57397808c0922a3f08248506a9f))
* export ts types in sync ([890bf8d](https://github.com/adaltas/node-csv/commit/890bf8d950c18a05cab5e35a461d0847d9425156))
* replace ts types with typesVersions ([acb41d5](https://github.com/adaltas/node-csv/commit/acb41d5031669f2d582e40da1c80f5fd4738fee4))
* **stream-transform:** ts extends options with stream.TransformOptions ([eb64b12](https://github.com/adaltas/node-csv/commit/eb64b12774e8371cb1043a0c4a33ed9dc73a1c50))





## [2.1.2](https://github.com/adaltas/node-stream-transform/compare/stream-transform@2.1.1...stream-transform@2.1.2) (2021-08-27)

**Note:** Version bump only for package stream-transform





## 2.1.1 (2021-08-27)

### Bug Fixes

* **stream-transform:** finish event call multiple times ([4f45103](https://github.com/adaltas/node-stream-transform/commit/4f451038ef083b65d58ccee6fe3d041b106cc1cf))

## Version 2.1.0

* chore: use browserify

## Version 2.0.4

* fix: add ts generics to handler

## Version 2.0.3

* package: latest dependencies
* ts: enable strict mode
* package: mocha inside package declaration

## Version 2.0.2

* handler: update Typescript signature
* test: ensure every sample is valid
* package: contributing
* package: code of conduct

## Version 2.0.1

* package: prefix file path with "/"
* package: rename coffee cmd to build
* handler: preserve ordering with sync handler
* package: replace npm ignore with file field

## Version 2.0.0

Breaking changes:
* state: isolate properties into the "state" property

New Features:
* typescript: new ts definitions

Minor enhancements:
* api: clone options
* api: simplify argument discovery
* project: fix license in package.json
* babel: include .babelrc to git
* package: latest dependencies

## Version 1.0.8

Project Management

* package: update license to MIT
* travis: test against Node.js 11

## Version 1.0.7

* readme: fix website urls

## Version 1.0.6

* readme: fix links to project website

## Version 1.0.5

* package: move to csv.js.org
* package: upgrade dependencies including babel 7
* example: new sequential mode sample
* examples: new state examples
* examples: new api sync example
* examples: new mixed output stream example
* handler: bind execution context with current instance

## Version 1.0.4

* readme: update travis badge

## Version 1.0.3

* travis: support Node.js 10
* package: improve ignore files
* samples: update syntax
* sync: new module to ease synchronous usage
* stream: dont push empty string

## Version 1.0.2

* package: move babel to dev dependencies

## Version 1.0.1

* package: es5 backward compatibility
* package: ignore yarn lock file

## v0.2.0

* test: should require handled by mocha
* package: coffeescript 2 and use semver tilde
