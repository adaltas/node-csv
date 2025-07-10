# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 6.6.0 (2025-07-10)

### Features

- add unicode chars to formula escape ([#387](https://github.com/adaltas/node-csv/issues/387)) ([1fc177c](https://github.com/adaltas/node-csv/commit/1fc177c605e8a88e403539806890695a6ba72dec))
- backport support for node 14 ([dbfeb78](https://github.com/adaltas/node-csv/commit/dbfeb78f61ed36f02936d63a53345708ca213e45))
- backward support for node 8 ([496231d](https://github.com/adaltas/node-csv/commit/496231dfd838f0a6a72269a5a2390a4c637cef95))
- **csv-parse:** set `columns` type as `readonly` ([#358](https://github.com/adaltas/node-csv/issues/358)) ([44f2e7c](https://github.com/adaltas/node-csv/commit/44f2e7c2d1c36adf2b1f5a32ee181b3c4c4b50d7))
- **csv-stringify:** Add escape_formulas to defend against injection attacks ([#380](https://github.com/adaltas/node-csv/issues/380)) ([47ac4bd](https://github.com/adaltas/node-csv/commit/47ac4bd7f5838e28daf889528fd6427ad0934076))
- **csv-stringify:** ts extends options with stream.TransformOptions ([#301](https://github.com/adaltas/node-csv/issues/301)) ([cc30d66](https://github.com/adaltas/node-csv/commit/cc30d66e0f07686d2c42670ead10246ebcf37a67))
- esm migration ([b5c0d4b](https://github.com/adaltas/node-csv/commit/b5c0d4b191c8b57397808c0922a3f08248506a9f))
- export ts types in sync ([890bf8d](https://github.com/adaltas/node-csv/commit/890bf8d950c18a05cab5e35a461d0847d9425156))
- replace ts types with typesVersions ([acb41d5](https://github.com/adaltas/node-csv/commit/acb41d5031669f2d582e40da1c80f5fd4738fee4))
- ts module Node16 and type declaration to exports field ([#341](https://github.com/adaltas/node-csv/issues/341)) ([4b0283d](https://github.com/adaltas/node-csv/commit/4b0283d17b7fa46daa1f87380759ba72c71ec79b))
- wg stream api ([8a5eb7d](https://github.com/adaltas/node-csv/commit/8a5eb7dfd31b22217db4fbbc832d707221850785))

### Bug Fixes

- commonjs types, run tsc and lint to validate changes ([#397](https://github.com/adaltas/node-csv/issues/397)) ([e6870fe](https://github.com/adaltas/node-csv/commit/e6870fe272c119e273196522c9771d12ff8b2a35))
- correct exports in package.json with webpack ([154eafb](https://github.com/adaltas/node-csv/commit/154eafbac866eb4499a0d392f8dcd057695c2586))
- **csv-demo-ts-cjs-node16:** upgrade module definition after latest typescript ([87fe919](https://github.com/adaltas/node-csv/commit/87fe91996fb2a8895c252177fca4f0cb59a518f9))
- **csv-demo-webpack-ts:** remove polyfill ([47a99bd](https://github.com/adaltas/node-csv/commit/47a99bd944d1d943e6374227dbc4e20aaa2c8c7f))
- **csv-demo-webpack-ts:** simplify export paths ([8d63a14](https://github.com/adaltas/node-csv/commit/8d63a14313bb6b26f13fafb740cc686f1dfaa65f))
- **csv-stringify:** add missing type definition for bigint cast option ([#369](https://github.com/adaltas/node-csv/issues/369)) ([764e748](https://github.com/adaltas/node-csv/commit/764e7486971835189364ea7a0103798e5c07fb2b))
- **csv-stringify:** allow mixed string and object columns typedef ([#456](https://github.com/adaltas/node-csv/issues/456)) ([c40c0d2](https://github.com/adaltas/node-csv/commit/c40c0d2114d7800cca8da2d685ad1e49bf4cc7eb))
- **csv-stringify:** bom and header in sync mode with no records (fix [#343](https://github.com/adaltas/node-csv/issues/343)) ([bff158f](https://github.com/adaltas/node-csv/commit/bff158fbc9001b2cf7177ecd0f16dc97edac55f2))
- **csv-stringify:** catch error with sync api, fix [#296](https://github.com/adaltas/node-csv/issues/296) ([e157f40](https://github.com/adaltas/node-csv/commit/e157f407eeffe5bcfb179cb20476169037bfb4f1))
- **csv-stringify:** node 12 compatibility in flush ([9145b75](https://github.com/adaltas/node-csv/commit/9145b75012ec71a0b4152036af2275bf28c460e0))
- **csv-stringify:** quote_match with empty string pattern quotes empty strings ([#345](https://github.com/adaltas/node-csv/issues/345)) ([1c22d2e](https://github.com/adaltas/node-csv/commit/1c22d2e07f66dd747150b5a7499b5ebd5bc0f25c)), closes [#344](https://github.com/adaltas/node-csv/issues/344)
- **csv-stringify:** remove non-functional auto value ([6e8a9ca](https://github.com/adaltas/node-csv/commit/6e8a9ca0a712c56c73eabeb8aa052bd6d197cb3f))
- **csv-stringify:** throw err with no records and header in sync mode ([5c8ef2e](https://github.com/adaltas/node-csv/commit/5c8ef2e25618b122982e01c22bcfa3f8ed5db8aa))
- **csv-stringify:** update quoted_match config option to accept arrays ([#371](https://github.com/adaltas/node-csv/issues/371)) ([42c468b](https://github.com/adaltas/node-csv/commit/42c468b188d9f0370d0f7ccf2b20c8f477b751d8))
- **csv-stringify:** update TS types to allow cast to return an object ([#339](https://github.com/adaltas/node-csv/issues/339)) ([60efa78](https://github.com/adaltas/node-csv/commit/60efa7862ed43bd2fd19d1f027a1809e9df6a67e))
- **csv-stringify:** use removeListener instead of off ([2c2623f](https://github.com/adaltas/node-csv/commit/2c2623f01a4985c5d248e1557a32a70350e825f6))
- dont insert polyfills in cjs [#303](https://github.com/adaltas/node-csv/issues/303) ([9baf334](https://github.com/adaltas/node-csv/commit/9baf334044dab90b4a0d096a7e456d0fd5807d5b))
- esm exports in package.json files ([c48fe47](https://github.com/adaltas/node-csv/commit/c48fe478ced7560aa078fbc36ec33d6007111e2b)), closes [#308](https://github.com/adaltas/node-csv/issues/308)
- export original lib esm modules ([be25349](https://github.com/adaltas/node-csv/commit/be2534928ba21156e9cde1e15d2e8593d62ffe71))
- expose browser esm modules ([eb87355](https://github.com/adaltas/node-csv/commit/eb873557c65912f065d2581d30a17a96b0bfd2d6))
- fallback to setTimeout is setImmediate is undefined ([3d6a2d0](https://github.com/adaltas/node-csv/commit/3d6a2d0a655af342f28456b46db7ccfe7ee9d664))
- refer to esm files in dist ([b780fbd](https://github.com/adaltas/node-csv/commit/b780fbd26f5e54494e511eb2e004d3cdedee3593))
- remove samples from publicatgion ([12c221d](https://github.com/adaltas/node-csv/commit/12c221dc37add26f094e3bb7f94b50ee06ff5be6))
- support ts node16 resolution in cjs ([#354](https://github.com/adaltas/node-csv/issues/354)) ([fa09d03](https://github.com/adaltas/node-csv/commit/fa09d03aaf0008b2790656871ca6b2c4be12d14c))
- support TypeScript moduleResolution node16 ([#368](https://github.com/adaltas/node-csv/issues/368)) ([f4d7c97](https://github.com/adaltas/node-csv/commit/f4d7c97f39fb73e9d248eee21e61e7dc48015c78))
- uncaught errors with large stream chunks (fix [#386](https://github.com/adaltas/node-csv/issues/386)) ([1d500ed](https://github.com/adaltas/node-csv/commit/1d500edf38ba06fc80409974e08c37c6a40f27a1))

## [6.5.2](https://github.com/adaltas/node-csv/compare/csv-stringify@6.5.1...csv-stringify@6.5.2) (2024-11-21)

**Note:** Version bump only for package csv-stringify

## [6.5.1](https://github.com/adaltas/node-csv/compare/csv-stringify@6.5.0...csv-stringify@6.5.1) (2024-07-27)

**Note:** Version bump only for package csv-stringify

## [6.5.0](https://github.com/adaltas/node-csv/compare/csv-stringify@6.4.6...csv-stringify@6.5.0) (2024-05-13)

### Features

- **csv-parse:** set `columns` type as `readonly` ([#358](https://github.com/adaltas/node-csv/issues/358)) ([44f2e7c](https://github.com/adaltas/node-csv/commit/44f2e7c2d1c36adf2b1f5a32ee181b3c4c4b50d7))

## [6.4.6](https://github.com/adaltas/node-csv/compare/csv-stringify@6.4.5...csv-stringify@6.4.6) (2024-02-27)

**Note:** Version bump only for package csv-stringify

## [6.4.5](https://github.com/adaltas/node-csv/compare/csv-stringify@6.4.4...csv-stringify@6.4.5) (2023-12-08)

**Note:** Version bump only for package csv-stringify

## [6.4.4](https://github.com/adaltas/node-csv/compare/csv-stringify@6.4.3...csv-stringify@6.4.4) (2023-10-09)

### Bug Fixes

- **csv-stringify:** remove non-functional auto value ([6e8a9ca](https://github.com/adaltas/node-csv/commit/6e8a9ca0a712c56c73eabeb8aa052bd6d197cb3f))

## [6.4.3](https://github.com/adaltas/node-csv/compare/csv-stringify@6.4.2...csv-stringify@6.4.3) (2023-10-05)

**Note:** Version bump only for package csv-stringify

## [6.4.2](https://github.com/adaltas/node-csv/compare/csv-stringify@6.4.1...csv-stringify@6.4.2) (2023-08-25)

### Bug Fixes

- **csv-demo-ts-cjs-node16:** upgrade module definition after latest typescript ([87fe919](https://github.com/adaltas/node-csv/commit/87fe91996fb2a8895c252177fca4f0cb59a518f9))

## [6.4.1](https://github.com/adaltas/node-csv/compare/csv-stringify@6.4.0...csv-stringify@6.4.1) (2023-08-24)

### Bug Fixes

- commonjs types, run tsc and lint to validate changes ([#397](https://github.com/adaltas/node-csv/issues/397)) ([e6870fe](https://github.com/adaltas/node-csv/commit/e6870fe272c119e273196522c9771d12ff8b2a35))

## [6.4.0](https://github.com/adaltas/node-csv/compare/csv-stringify@6.3.4...csv-stringify@6.4.0) (2023-05-09)

### Features

- add unicode chars to formula escape ([#387](https://github.com/adaltas/node-csv/issues/387)) ([1fc177c](https://github.com/adaltas/node-csv/commit/1fc177c605e8a88e403539806890695a6ba72dec))

## [6.3.4](https://github.com/adaltas/node-csv/compare/csv-stringify@6.3.3...csv-stringify@6.3.4) (2023-05-04)

**Note:** Version bump only for package csv-stringify

## [6.3.3](https://github.com/adaltas/node-csv/compare/csv-stringify@6.3.2...csv-stringify@6.3.3) (2023-04-30)

**Note:** Version bump only for package csv-stringify

## [6.3.2](https://github.com/adaltas/node-csv/compare/csv-stringify@6.3.0...csv-stringify@6.3.2) (2023-04-16)

### Bug Fixes

- uncaught errors with large stream chunks (fix [#386](https://github.com/adaltas/node-csv/issues/386)) ([1d500ed](https://github.com/adaltas/node-csv/commit/1d500edf38ba06fc80409974e08c37c6a40f27a1))

## [6.3.1](https://github.com/adaltas/node-csv/compare/csv-stringify@6.3.0...csv-stringify@6.3.1) (2023-04-16)

### Bug Fixes

- uncaught errors with large stream chunks (fix [#386](https://github.com/adaltas/node-csv/issues/386)) ([1d500ed](https://github.com/adaltas/node-csv/commit/1d500edf38ba06fc80409974e08c37c6a40f27a1))

## [6.3.0](https://github.com/adaltas/node-csv/compare/csv-stringify@6.2.4...csv-stringify@6.3.0) (2023-03-03)

### Features

- **csv-stringify:** Add escape_formulas to defend against injection attacks ([#380](https://github.com/adaltas/node-csv/issues/380)) ([47ac4bd](https://github.com/adaltas/node-csv/commit/47ac4bd7f5838e28daf889528fd6427ad0934076))

## [6.2.4](https://github.com/adaltas/node-csv/compare/csv-stringify@6.2.3...csv-stringify@6.2.4) (2023-02-08)

### Bug Fixes

- support ts node16 resolution in cjs ([#354](https://github.com/adaltas/node-csv/issues/354)) ([fa09d03](https://github.com/adaltas/node-csv/commit/fa09d03aaf0008b2790656871ca6b2c4be12d14c))

## [6.2.3](https://github.com/adaltas/node-csv/compare/csv-stringify@6.2.2...csv-stringify@6.2.3) (2022-11-30)

### Bug Fixes

- **csv-stringify:** update quoted_match config option to accept arrays ([#371](https://github.com/adaltas/node-csv/issues/371)) ([42c468b](https://github.com/adaltas/node-csv/commit/42c468b188d9f0370d0f7ccf2b20c8f477b751d8))

## [6.2.2](https://github.com/adaltas/node-csv/compare/csv-stringify@6.2.1...csv-stringify@6.2.2) (2022-11-22)

### Bug Fixes

- **csv-stringify:** add missing type definition for bigint cast option ([#369](https://github.com/adaltas/node-csv/issues/369)) ([764e748](https://github.com/adaltas/node-csv/commit/764e7486971835189364ea7a0103798e5c07fb2b))

## [6.2.1](https://github.com/adaltas/node-csv/compare/csv-stringify@6.2.0...csv-stringify@6.2.1) (2022-11-08)

### Bug Fixes

- support TypeScript moduleResolution node16 ([#368](https://github.com/adaltas/node-csv/issues/368)) ([f4d7c97](https://github.com/adaltas/node-csv/commit/f4d7c97f39fb73e9d248eee21e61e7dc48015c78))

## [6.2.0](https://github.com/adaltas/node-csv/compare/csv-stringify@6.1.3...csv-stringify@6.2.0) (2022-07-10)

### Features

- ts module Node16 and type declaration to exports field ([#341](https://github.com/adaltas/node-csv/issues/341)) ([4b0283d](https://github.com/adaltas/node-csv/commit/4b0283d17b7fa46daa1f87380759ba72c71ec79b))

### [6.1.3](https://github.com/adaltas/node-csv/compare/csv-stringify@6.1.2...csv-stringify@6.1.3) (2022-06-16)

### Bug Fixes

- **csv-stringify:** quote_match with empty string pattern quotes empty strings ([#345](https://github.com/adaltas/node-csv/issues/345)) ([1c22d2e](https://github.com/adaltas/node-csv/commit/1c22d2e07f66dd747150b5a7499b5ebd5bc0f25c)), closes [#344](https://github.com/adaltas/node-csv/issues/344)

### [6.1.2](https://github.com/adaltas/node-csv/compare/csv-stringify@6.1.1...csv-stringify@6.1.2) (2022-06-14)

### Bug Fixes

- **csv-stringify:** throw err with no records and header in sync mode ([5c8ef2e](https://github.com/adaltas/node-csv/commit/5c8ef2e25618b122982e01c22bcfa3f8ed5db8aa))

### [6.1.1](https://github.com/adaltas/node-csv/compare/csv-stringify@6.1.0...csv-stringify@6.1.1) (2022-06-14)

### Bug Fixes

- **csv-stringify:** bom and header in sync mode with no records (fix [#343](https://github.com/adaltas/node-csv/issues/343)) ([bff158f](https://github.com/adaltas/node-csv/commit/bff158fbc9001b2cf7177ecd0f16dc97edac55f2))

## [6.1.0](https://github.com/adaltas/node-csv/compare/csv-stringify@6.0.5...csv-stringify@6.1.0) (2022-05-24)

### Features

- wg stream api ([8a5eb7d](https://github.com/adaltas/node-csv/commit/8a5eb7dfd31b22217db4fbbc832d707221850785))

### Bug Fixes

- **csv-stringify:** update TS types to allow cast to return an object ([#339](https://github.com/adaltas/node-csv/issues/339)) ([60efa78](https://github.com/adaltas/node-csv/commit/60efa7862ed43bd2fd19d1f027a1809e9df6a67e))

## [6.0.5](https://github.com/adaltas/node-csv/compare/csv-stringify@6.0.4...csv-stringify@6.0.5) (2021-12-29)

### Bug Fixes

- correct exports in package.json with webpack ([154eafb](https://github.com/adaltas/node-csv/commit/154eafbac866eb4499a0d392f8dcd057695c2586))
- **csv-demo-webpack-ts:** remove polyfill ([47a99bd](https://github.com/adaltas/node-csv/commit/47a99bd944d1d943e6374227dbc4e20aaa2c8c7f))
- **csv-demo-webpack-ts:** simplify export paths ([8d63a14](https://github.com/adaltas/node-csv/commit/8d63a14313bb6b26f13fafb740cc686f1dfaa65f))
- esm exports in package.json files ([c48fe47](https://github.com/adaltas/node-csv/commit/c48fe478ced7560aa078fbc36ec33d6007111e2b)), closes [#308](https://github.com/adaltas/node-csv/issues/308)

## [6.0.4](https://github.com/adaltas/node-csv/compare/csv-stringify@6.0.3...csv-stringify@6.0.4) (2021-11-19)

### Bug Fixes

- **csv-stringify:** catch error with sync api, fix [#296](https://github.com/adaltas/node-csv/issues/296) ([e157f40](https://github.com/adaltas/node-csv/commit/e157f407eeffe5bcfb179cb20476169037bfb4f1))
- **csv-stringify:** node 12 compatibility in flush ([9145b75](https://github.com/adaltas/node-csv/commit/9145b75012ec71a0b4152036af2275bf28c460e0))

## [6.0.3](https://github.com/adaltas/node-csv/compare/csv-stringify@6.0.2...csv-stringify@6.0.3) (2021-11-19)

### Bug Fixes

- expose browser esm modules ([eb87355](https://github.com/adaltas/node-csv/commit/eb873557c65912f065d2581d30a17a96b0bfd2d6))

## [6.0.2](https://github.com/adaltas/node-csv/compare/csv-stringify@6.0.1...csv-stringify@6.0.2) (2021-11-18)

### Bug Fixes

- dont insert polyfills in cjs [#303](https://github.com/adaltas/node-csv/issues/303) ([9baf334](https://github.com/adaltas/node-csv/commit/9baf334044dab90b4a0d096a7e456d0fd5807d5b))

## [6.0.1](https://github.com/adaltas/node-csv/compare/csv-stringify@6.0.0...csv-stringify@6.0.1) (2021-11-15)

### Bug Fixes

- remove samples from publicatgion ([12c221d](https://github.com/adaltas/node-csv/commit/12c221dc37add26f094e3bb7f94b50ee06ff5be6))

# [6.0.0](https://github.com/adaltas/node-csv/compare/csv-stringify@5.6.5...csv-stringify@6.0.0) (2021-11-15)

### Bug Fixes

- **csv-stringify:** use removeListener instead of off ([2c2623f](https://github.com/adaltas/node-csv/commit/2c2623f01a4985c5d248e1557a32a70350e825f6))
- export original lib esm modules ([be25349](https://github.com/adaltas/node-csv/commit/be2534928ba21156e9cde1e15d2e8593d62ffe71))
- fallback to setTimeout is setImmediate is undefined ([3d6a2d0](https://github.com/adaltas/node-csv/commit/3d6a2d0a655af342f28456b46db7ccfe7ee9d664))
- refer to esm files in dist ([b780fbd](https://github.com/adaltas/node-csv/commit/b780fbd26f5e54494e511eb2e004d3cdedee3593))

### Features

- backport support for node 14 ([dbfeb78](https://github.com/adaltas/node-csv/commit/dbfeb78f61ed36f02936d63a53345708ca213e45))
- backward support for node 8 ([496231d](https://github.com/adaltas/node-csv/commit/496231dfd838f0a6a72269a5a2390a4c637cef95))
- **csv-stringify:** ts extends options with stream.TransformOptions ([#301](https://github.com/adaltas/node-csv/issues/301)) ([cc30d66](https://github.com/adaltas/node-csv/commit/cc30d66e0f07686d2c42670ead10246ebcf37a67))
- esm migration ([b5c0d4b](https://github.com/adaltas/node-csv/commit/b5c0d4b191c8b57397808c0922a3f08248506a9f))
- export ts types in sync ([890bf8d](https://github.com/adaltas/node-csv/commit/890bf8d950c18a05cab5e35a461d0847d9425156))
- replace ts types with typesVersions ([acb41d5](https://github.com/adaltas/node-csv/commit/acb41d5031669f2d582e40da1c80f5fd4738fee4))

## [5.6.4](https://github.com/adaltas/node-csv-stringify/compare/csv-stringify@5.6.3...csv-stringify@5.6.4) (2021-08-27)

**Note:** Version bump only for package csv-stringify

## 5.6.3 (2021-08-27)

**Note:** Version bump only for package csv-stringify

## Version 5.6.2

- build: rename build commands

## Version 5.6.1

- fix: memory leak in sync
- refactor: remove unsused values
- fix: add browserify dev dep

## Version 5.6.0

- build: use browser compatible bundles, fix #122

## Version 5.5.3

- ts: callback argument simplification

## Version 5.5.2

- package: latest dependencies
- test: fix write null in node 14
- ts: enable strict mode
- package: mocha inside package declaration

## Version 5.5.1

Fix

- bom: work with sync module, fix #115

## Version 5.5.0

Feature:

- cast: support for BigInt

## Version 5.4.3

Fix:

- utils: wrongly declared variable in isSymbol

## Version 5.4.2

Fix:

- quoted_match: apply on all types and not just string
- cast: validate and normalize local options

Project management:

- samples: add quoted examples

## Version 5.4.1

- bom: fix ts definition

## Version 5.4.0

- src: complete require in javascript
- bom: new option

## Version 5.3.6

- cast: fix header context property on first record

## Version 5.3.5

- stream: passing options to parent constructor, fix #104

## Version 5.3.4

- src: strengthen conditions
- test: ensure every sample is valid
- package: contributing
- package: code of conduct
- quoted_match: ts types string or RegExp

## Version 5.3.3

- columns: can still access fields with dots, fix #98

## Version 5.3.2

- columns: get on undefined objects, fix #97

## Version 5.3.1

- package: latest dependencies
- package: replace npm ignore with file field
- project: fix license in package.json
- package: simplify pretest command

## Version 5.3.0

New feature:

- quote: may be a boolean value
- delimiter: accept buffer and enforce validation
- delimiter: disabled if value is empty
- cast: overwrite options if value is an object

Fix:

- record_delimiter: enforce validation

Project management:

- package: latest dependencies
- ts: type tests

## Version 5.2.0

Fix:

- escape: enforce validation

Project management:

- babel: include .babelrc to git
- ts: rename RowDelimiter to RecordDelimiter
- ts: convert camel case to snake case

## Version 5.1.2

Fix:

- write: immutable input chunks

## Version 5.1.1

Fix:

- ts: add casting context missing type

## Version 5.1.0

Fix:

- header: ensure column definition

New features:

- cast: pass context to functions

Minor enhancements:

- write: validate written records
- src: extends stream class

Project management:

- package: latest dev dependencies

## Version 5.0.0

Breaking changes:

- `cast`: was `formatters`
- `record_delimiter`: was `row_delimiter`
- options: instance options stored in snake case
- nodejs: drop support for version 7, use './lib/es5'

New features:

- `quoted_match`: new option
- options: accept snake case and camel case

Minor enhancements:

- stream: pass all options to the transform stream
- stream: use writableObjectMode

Project management:

- package: update license to MIT
- travis: test against Node.js 11
- samples: improve some scripts

## Version 4.3.1

- readme: fix links to project website

## Version 4.3.0

- package: move to csv.js.org

## Version 4.2.0

- `formatters`: new string formatter
- stream: be a much better transform citizen
- package: upgrade to babel 7

## Version 4.1.0

- `columns`: support array with column definition objects
- travis: support Node.js 10
- samples: new formatters script
- samples: update syntax
- package: improve ignore files

## Version 4.0.1

- typescript: reflect latest change in formatters

## Version 4.0.0

Backward incompatibilities:

- `formatters`: rename bool to boolean

New features:

- `formatters`: handle number

Cleanup

- src: cache call to `typeof`
- package: latest dependencies

## Version 3.1.1

- typescript: sync API needs to return a string

## Version 3.1.0

- typescript: add typings

## Version 3.0.0

- Switch linebreak check for `rowDelimiter` check

## Version 2.1.0

- package: allow empty quote value
- package: add ascii option for `rowDelimiter`

## Version 2.0.4

- package: move babel to dev dependencies

## Version 2.0.3

- package: es5 backward compatiblity
- package: ignore yarn lock file

## Version 2.0.2

- package: start running tests in preversion

## Version 2.0.1

- package: new release workflow
- formatters: validate returned value

## 2.0.0

This major version use CoffeeScript 2 which produces a modern JavaScript syntax
(ES6, or ES2015 and later) and break the compatibility with versions of Node.js
lower than 7.6 as well as the browsers. It is however stable in term of API.

- package: use CoffeeScript 2

## v1.1.0

- test: should require handled by mocha
- package: CoffeeScript 2 and use of semver tilde
