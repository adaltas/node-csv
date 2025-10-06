# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 3.4.0 (2025-07-10)

### Features

- backport support for node 14 ([dbfeb78](https://github.com/adaltas/node-csv/commit/dbfeb78f61ed36f02936d63a53345708ca213e45))
- backward support for node 8 ([496231d](https://github.com/adaltas/node-csv/commit/496231dfd838f0a6a72269a5a2390a4c637cef95))
- esm migration ([b5c0d4b](https://github.com/adaltas/node-csv/commit/b5c0d4b191c8b57397808c0922a3f08248506a9f))
- export ts types in sync ([890bf8d](https://github.com/adaltas/node-csv/commit/890bf8d950c18a05cab5e35a461d0847d9425156))
- replace ts types with typesVersions ([acb41d5](https://github.com/adaltas/node-csv/commit/acb41d5031669f2d582e40da1c80f5fd4738fee4))
- **stream-transform:** handler promise support ([df337ec](https://github.com/adaltas/node-csv/commit/df337ec44cfd9a4536641ca7e2f0f5c1404ea74d))
- **stream-transform:** ts extends options with stream.TransformOptions ([eb64b12](https://github.com/adaltas/node-csv/commit/eb64b12774e8371cb1043a0c4a33ed9dc73a1c50))
- ts module Node16 and type declaration to exports field ([#341](https://github.com/adaltas/node-csv/issues/341)) ([4b0283d](https://github.com/adaltas/node-csv/commit/4b0283d17b7fa46daa1f87380759ba72c71ec79b))
- wg stream api ([8a5eb7d](https://github.com/adaltas/node-csv/commit/8a5eb7dfd31b22217db4fbbc832d707221850785))

### Bug Fixes

- commonjs types, run tsc and lint to validate changes ([#397](https://github.com/adaltas/node-csv/issues/397)) ([e6870fe](https://github.com/adaltas/node-csv/commit/e6870fe272c119e273196522c9771d12ff8b2a35))
- correct exports in package.json with webpack ([154eafb](https://github.com/adaltas/node-csv/commit/154eafbac866eb4499a0d392f8dcd057695c2586))
- **csv-demo-ts-cjs-node16:** upgrade module definition after latest typescript ([87fe919](https://github.com/adaltas/node-csv/commit/87fe91996fb2a8895c252177fca4f0cb59a518f9))
- **csv-demo-webpack-ts:** remove polyfill ([47a99bd](https://github.com/adaltas/node-csv/commit/47a99bd944d1d943e6374227dbc4e20aaa2c8c7f))
- **csv-demo-webpack-ts:** simplify export paths ([8d63a14](https://github.com/adaltas/node-csv/commit/8d63a14313bb6b26f13fafb740cc686f1dfaa65f))
- **csv-generate:** finish called twice in node 16 ([3decdf1](https://github.com/adaltas/node-csv/commit/3decdf169ce3b8e0c5cadd257816c346c8e4d3fa))
- dont insert polyfills in cjs [#303](https://github.com/adaltas/node-csv/issues/303) ([9baf334](https://github.com/adaltas/node-csv/commit/9baf334044dab90b4a0d096a7e456d0fd5807d5b))
- esm exports in package.json files ([c48fe47](https://github.com/adaltas/node-csv/commit/c48fe478ced7560aa078fbc36ec33d6007111e2b)), closes [#308](https://github.com/adaltas/node-csv/issues/308)
- export original lib esm modules ([be25349](https://github.com/adaltas/node-csv/commit/be2534928ba21156e9cde1e15d2e8593d62ffe71))
- expose browser esm modules ([eb87355](https://github.com/adaltas/node-csv/commit/eb873557c65912f065d2581d30a17a96b0bfd2d6))
- fallback to setTimeout is setImmediate is undefined ([3d6a2d0](https://github.com/adaltas/node-csv/commit/3d6a2d0a655af342f28456b46db7ccfe7ee9d664))
- refer to esm files in dist ([b780fbd](https://github.com/adaltas/node-csv/commit/b780fbd26f5e54494e511eb2e004d3cdedee3593))
- remove samples from publicatgion ([12c221d](https://github.com/adaltas/node-csv/commit/12c221dc37add26f094e3bb7f94b50ee06ff5be6))
- **stream-transform:** backpressure after push ([3e83f4e](https://github.com/adaltas/node-csv/commit/3e83f4e604b7b944835de18afcb41716ce4bbfad))
- **stream-transform:** finish event call multiple times ([4f45103](https://github.com/adaltas/node-csv/commit/4f451038ef083b65d58ccee6fe3d041b106cc1cf))
- **stream-transform:** sync callback usage in async handler ([4dd562b](https://github.com/adaltas/node-csv/commit/4dd562b65b99803b45858f449f67e52e2ef15726))
- support ts node16 resolution in cjs ([#354](https://github.com/adaltas/node-csv/issues/354)) ([fa09d03](https://github.com/adaltas/node-csv/commit/fa09d03aaf0008b2790656871ca6b2c4be12d14c))
- support TypeScript moduleResolution node16 ([#368](https://github.com/adaltas/node-csv/issues/368)) ([f4d7c97](https://github.com/adaltas/node-csv/commit/f4d7c97f39fb73e9d248eee21e61e7dc48015c78))

## [3.3.3](https://github.com/adaltas/node-csv/compare/stream-transform@3.3.2...stream-transform@3.3.3) (2024-11-21)

**Note:** Version bump only for package stream-transform

## [3.3.2](https://github.com/adaltas/node-csv/compare/stream-transform@3.3.1...stream-transform@3.3.2) (2024-05-13)

**Note:** Version bump only for package stream-transform

## [3.3.1](https://github.com/adaltas/node-csv/compare/stream-transform@3.3.0...stream-transform@3.3.1) (2024-02-27)

**Note:** Version bump only for package stream-transform

## [3.3.0](https://github.com/adaltas/node-csv/compare/stream-transform@3.2.10...stream-transform@3.3.0) (2023-12-08)

### Features

- **stream-transform:** handler promise support ([df337ec](https://github.com/adaltas/node-csv/commit/df337ec44cfd9a4536641ca7e2f0f5c1404ea74d))

## [3.2.10](https://github.com/adaltas/node-csv/compare/stream-transform@3.2.9...stream-transform@3.2.10) (2023-10-09)

### Bug Fixes

- **stream-transform:** backpressure after push ([3e83f4e](https://github.com/adaltas/node-csv/commit/3e83f4e604b7b944835de18afcb41716ce4bbfad))

## [3.2.9](https://github.com/adaltas/node-csv/compare/stream-transform@3.2.8...stream-transform@3.2.9) (2023-10-05)

### Bug Fixes

- **stream-transform:** sync callback usage in async handler ([4dd562b](https://github.com/adaltas/node-csv/commit/4dd562b65b99803b45858f449f67e52e2ef15726))

## [3.2.8](https://github.com/adaltas/node-csv/compare/stream-transform@3.2.7...stream-transform@3.2.8) (2023-08-25)

### Bug Fixes

- **csv-demo-ts-cjs-node16:** upgrade module definition after latest typescript ([87fe919](https://github.com/adaltas/node-csv/commit/87fe91996fb2a8895c252177fca4f0cb59a518f9))

## [3.2.7](https://github.com/adaltas/node-csv/compare/stream-transform@3.2.6...stream-transform@3.2.7) (2023-08-24)

### Bug Fixes

- commonjs types, run tsc and lint to validate changes ([#397](https://github.com/adaltas/node-csv/issues/397)) ([e6870fe](https://github.com/adaltas/node-csv/commit/e6870fe272c119e273196522c9771d12ff8b2a35))

## [3.2.6](https://github.com/adaltas/node-csv/compare/stream-transform@3.2.5...stream-transform@3.2.6) (2023-05-04)

**Note:** Version bump only for package stream-transform

## [3.2.5](https://github.com/adaltas/node-csv/compare/stream-transform@3.2.4...stream-transform@3.2.5) (2023-04-30)

**Note:** Version bump only for package stream-transform

## [3.2.4](https://github.com/adaltas/node-csv/compare/stream-transform@3.2.2...stream-transform@3.2.4) (2023-04-16)

**Note:** Version bump only for package stream-transform

## [3.2.3](https://github.com/adaltas/node-csv/compare/stream-transform@3.2.2...stream-transform@3.2.3) (2023-04-16)

**Note:** Version bump only for package stream-transform

## [3.2.2](https://github.com/adaltas/node-csv/compare/stream-transform@3.2.1...stream-transform@3.2.2) (2023-02-08)

### Bug Fixes

- support ts node16 resolution in cjs ([#354](https://github.com/adaltas/node-csv/issues/354)) ([fa09d03](https://github.com/adaltas/node-csv/commit/fa09d03aaf0008b2790656871ca6b2c4be12d14c))

## [3.2.1](https://github.com/adaltas/node-csv/compare/stream-transform@3.2.0...stream-transform@3.2.1) (2022-11-08)

### Bug Fixes

- support TypeScript moduleResolution node16 ([#368](https://github.com/adaltas/node-csv/issues/368)) ([f4d7c97](https://github.com/adaltas/node-csv/commit/f4d7c97f39fb73e9d248eee21e61e7dc48015c78))

## [3.2.0](https://github.com/adaltas/node-csv/compare/stream-transform@3.1.0...stream-transform@3.2.0) (2022-07-10)

### Features

- ts module Node16 and type declaration to exports field ([#341](https://github.com/adaltas/node-csv/issues/341)) ([4b0283d](https://github.com/adaltas/node-csv/commit/4b0283d17b7fa46daa1f87380759ba72c71ec79b))

## [3.1.0](https://github.com/adaltas/node-csv/compare/stream-transform@3.0.4...stream-transform@3.1.0) (2022-05-24)

### Features

- wg stream api ([8a5eb7d](https://github.com/adaltas/node-csv/commit/8a5eb7dfd31b22217db4fbbc832d707221850785))

## [3.0.4](https://github.com/adaltas/node-csv/compare/stream-transform@3.0.3...stream-transform@3.0.4) (2021-12-29)

### Bug Fixes

- correct exports in package.json with webpack ([154eafb](https://github.com/adaltas/node-csv/commit/154eafbac866eb4499a0d392f8dcd057695c2586))
- **csv-demo-webpack-ts:** remove polyfill ([47a99bd](https://github.com/adaltas/node-csv/commit/47a99bd944d1d943e6374227dbc4e20aaa2c8c7f))
- **csv-demo-webpack-ts:** simplify export paths ([8d63a14](https://github.com/adaltas/node-csv/commit/8d63a14313bb6b26f13fafb740cc686f1dfaa65f))
- esm exports in package.json files ([c48fe47](https://github.com/adaltas/node-csv/commit/c48fe478ced7560aa078fbc36ec33d6007111e2b)), closes [#308](https://github.com/adaltas/node-csv/issues/308)

## [3.0.3](https://github.com/adaltas/node-csv/compare/stream-transform@3.0.2...stream-transform@3.0.3) (2021-11-19)

### Bug Fixes

- expose browser esm modules ([eb87355](https://github.com/adaltas/node-csv/commit/eb873557c65912f065d2581d30a17a96b0bfd2d6))

## [3.0.2](https://github.com/adaltas/node-csv/compare/stream-transform@3.0.1...stream-transform@3.0.2) (2021-11-18)

### Bug Fixes

- dont insert polyfills in cjs [#303](https://github.com/adaltas/node-csv/issues/303) ([9baf334](https://github.com/adaltas/node-csv/commit/9baf334044dab90b4a0d096a7e456d0fd5807d5b))

## [3.0.1](https://github.com/adaltas/node-csv/compare/stream-transform@3.0.0...stream-transform@3.0.1) (2021-11-15)

### Bug Fixes

- remove samples from publicatgion ([12c221d](https://github.com/adaltas/node-csv/commit/12c221dc37add26f094e3bb7f94b50ee06ff5be6))

# [3.0.0](https://github.com/adaltas/node-csv/compare/stream-transform@2.1.3...stream-transform@3.0.0) (2021-11-15)

### Bug Fixes

- **csv-generate:** finish called twice in node 16 ([3decdf1](https://github.com/adaltas/node-csv/commit/3decdf169ce3b8e0c5cadd257816c346c8e4d3fa))
- export original lib esm modules ([be25349](https://github.com/adaltas/node-csv/commit/be2534928ba21156e9cde1e15d2e8593d62ffe71))
- fallback to setTimeout is setImmediate is undefined ([3d6a2d0](https://github.com/adaltas/node-csv/commit/3d6a2d0a655af342f28456b46db7ccfe7ee9d664))
- refer to esm files in dist ([b780fbd](https://github.com/adaltas/node-csv/commit/b780fbd26f5e54494e511eb2e004d3cdedee3593))

### Features

- backport support for node 14 ([dbfeb78](https://github.com/adaltas/node-csv/commit/dbfeb78f61ed36f02936d63a53345708ca213e45))
- backward support for node 8 ([496231d](https://github.com/adaltas/node-csv/commit/496231dfd838f0a6a72269a5a2390a4c637cef95))
- esm migration ([b5c0d4b](https://github.com/adaltas/node-csv/commit/b5c0d4b191c8b57397808c0922a3f08248506a9f))
- export ts types in sync ([890bf8d](https://github.com/adaltas/node-csv/commit/890bf8d950c18a05cab5e35a461d0847d9425156))
- replace ts types with typesVersions ([acb41d5](https://github.com/adaltas/node-csv/commit/acb41d5031669f2d582e40da1c80f5fd4738fee4))
- **stream-transform:** ts extends options with stream.TransformOptions ([eb64b12](https://github.com/adaltas/node-csv/commit/eb64b12774e8371cb1043a0c4a33ed9dc73a1c50))

## [2.1.2](https://github.com/adaltas/node-stream-transform/compare/stream-transform@2.1.1...stream-transform@2.1.2) (2021-08-27)

**Note:** Version bump only for package stream-transform

## 2.1.1 (2021-08-27)

### Bug Fixes

- **stream-transform:** finish event call multiple times ([4f45103](https://github.com/adaltas/node-stream-transform/commit/4f451038ef083b65d58ccee6fe3d041b106cc1cf))

## Version 2.1.0

- chore: use browserify

## Version 2.0.4

- fix: add ts generics to handler

## Version 2.0.3

- package: latest dependencies
- ts: enable strict mode
- package: mocha inside package declaration

## Version 2.0.2

- handler: update Typescript signature
- test: ensure every sample is valid
- package: contributing
- package: code of conduct

## Version 2.0.1

- package: prefix file path with "/"
- package: rename coffee cmd to build
- handler: preserve ordering with sync handler
- package: replace npm ignore with file field

## Version 2.0.0

Breaking changes:

- state: isolate properties into the "state" property

New Features:

- typescript: new ts definitions

Minor enhancements:

- api: clone options
- api: simplify argument discovery
- project: fix license in package.json
- babel: include .babelrc to git
- package: latest dependencies

## Version 1.0.8

Project Management

- package: update license to MIT
- travis: test against Node.js 11

## Version 1.0.7

- readme: fix website urls

## Version 1.0.6

- readme: fix links to project website

## Version 1.0.5

- package: move to csv.js.org
- package: upgrade dependencies including babel 7
- example: new sequential mode sample
- examples: new state examples
- examples: new api sync example
- examples: new mixed output stream example
- handler: bind execution context with current instance

## Version 1.0.4

- readme: update travis badge

## Version 1.0.3

- travis: support Node.js 10
- package: improve ignore files
- samples: update syntax
- sync: new module to ease synchronous usage
- stream: dont push empty string

## Version 1.0.2

- package: move babel to dev dependencies

## Version 1.0.1

- package: es5 backward compatibility
- package: ignore yarn lock file

## v0.2.0

- test: should require handled by mocha
- package: coffeescript 2 and use semver tilde
