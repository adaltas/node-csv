# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [6.4.1](https://github.com/adaltas/node-csv/compare/csv@6.3.11...csv@6.4.1) (2025-07-16)

**Note:** Version bump only for package csv

## 6.4.0 (2025-07-10)

### Features

- add unicode chars to formula escape ([#387](https://github.com/adaltas/node-csv/issues/387)) ([1fc177c](https://github.com/adaltas/node-csv/commit/1fc177c605e8a88e403539806890695a6ba72dec))
- backport support for node 14 ([dbfeb78](https://github.com/adaltas/node-csv/commit/dbfeb78f61ed36f02936d63a53345708ca213e45))
- backward support for node 8 ([496231d](https://github.com/adaltas/node-csv/commit/496231dfd838f0a6a72269a5a2390a4c637cef95))
- esm migration ([b5c0d4b](https://github.com/adaltas/node-csv/commit/b5c0d4b191c8b57397808c0922a3f08248506a9f))
- export ts types in sync ([890bf8d](https://github.com/adaltas/node-csv/commit/890bf8d950c18a05cab5e35a461d0847d9425156))
- replace ts types with typesVersions ([acb41d5](https://github.com/adaltas/node-csv/commit/acb41d5031669f2d582e40da1c80f5fd4738fee4))
- ts module Node16 and type declaration to exports field ([#341](https://github.com/adaltas/node-csv/issues/341)) ([4b0283d](https://github.com/adaltas/node-csv/commit/4b0283d17b7fa46daa1f87380759ba72c71ec79b))
- wg stream api ([8a5eb7d](https://github.com/adaltas/node-csv/commit/8a5eb7dfd31b22217db4fbbc832d707221850785))

### Bug Fixes

- commonjs types, run tsc and lint to validate changes ([#397](https://github.com/adaltas/node-csv/issues/397)) ([e6870fe](https://github.com/adaltas/node-csv/commit/e6870fe272c119e273196522c9771d12ff8b2a35))
- correct exports in package.json with webpack ([154eafb](https://github.com/adaltas/node-csv/commit/154eafbac866eb4499a0d392f8dcd057695c2586))
- **csv-demo-ts-cjs-node16:** upgrade module definition after latest typescript ([87fe919](https://github.com/adaltas/node-csv/commit/87fe91996fb2a8895c252177fca4f0cb59a518f9))
- **csv-demo-webpack-ts:** simplify export paths ([8d63a14](https://github.com/adaltas/node-csv/commit/8d63a14313bb6b26f13fafb740cc686f1dfaa65f))
- **csv-generate:** finish called twice in node 16 ([3decdf1](https://github.com/adaltas/node-csv/commit/3decdf169ce3b8e0c5cadd257816c346c8e4d3fa))
- **csv-stringify:** bom and header in sync mode with no records (fix [#343](https://github.com/adaltas/node-csv/issues/343)) ([bff158f](https://github.com/adaltas/node-csv/commit/bff158fbc9001b2cf7177ecd0f16dc97edac55f2))
- **csv-stringify:** node 12 compatibility in flush ([9145b75](https://github.com/adaltas/node-csv/commit/9145b75012ec71a0b4152036af2275bf28c460e0))
- **csv-stringify:** quote_match with empty string pattern quotes empty strings ([#345](https://github.com/adaltas/node-csv/issues/345)) ([1c22d2e](https://github.com/adaltas/node-csv/commit/1c22d2e07f66dd747150b5a7499b5ebd5bc0f25c)), closes [#344](https://github.com/adaltas/node-csv/issues/344)
- **csv:** export csv_sync ([1353284](https://github.com/adaltas/node-csv/commit/1353284aa02bb9f4f727d2653e398a869eebe20d))
- **csv:** fixed CJS types under modern `modernResolution` options ([#388](https://github.com/adaltas/node-csv/issues/388)) ([54d03e4](https://github.com/adaltas/node-csv/commit/54d03e4779033ef7d574dffa98a7c3ce93da345d))
- **csv:** remove ts files in cjs dist ([d0d1089](https://github.com/adaltas/node-csv/commit/d0d1089c3ef9053c9adb9a9747ce11d5ea5cfe49))
- dont insert polyfills in cjs [#303](https://github.com/adaltas/node-csv/issues/303) ([9baf334](https://github.com/adaltas/node-csv/commit/9baf334044dab90b4a0d096a7e456d0fd5807d5b))
- esm exports in package.json files ([c48fe47](https://github.com/adaltas/node-csv/commit/c48fe478ced7560aa078fbc36ec33d6007111e2b)), closes [#308](https://github.com/adaltas/node-csv/issues/308)
- export original lib esm modules ([be25349](https://github.com/adaltas/node-csv/commit/be2534928ba21156e9cde1e15d2e8593d62ffe71))
- expose browser esm modules ([eb87355](https://github.com/adaltas/node-csv/commit/eb873557c65912f065d2581d30a17a96b0bfd2d6))
- fallback to setTimeout is setImmediate is undefined ([3d6a2d0](https://github.com/adaltas/node-csv/commit/3d6a2d0a655af342f28456b46db7ccfe7ee9d664))
- refer to esm files in dist ([b780fbd](https://github.com/adaltas/node-csv/commit/b780fbd26f5e54494e511eb2e004d3cdedee3593))
- remove samples from publicatgion ([12c221d](https://github.com/adaltas/node-csv/commit/12c221dc37add26f094e3bb7f94b50ee06ff5be6))
- uncaught errors with large stream chunks (fix [#386](https://github.com/adaltas/node-csv/issues/386)) ([1d500ed](https://github.com/adaltas/node-csv/commit/1d500edf38ba06fc80409974e08c37c6a40f27a1))

## [6.3.11](https://github.com/adaltas/node-csv/compare/csv@6.3.10...csv@6.3.11) (2024-11-21)

**Note:** Version bump only for package csv

## [6.3.10](https://github.com/adaltas/node-csv/compare/csv@6.3.9...csv@6.3.10) (2024-07-27)

**Note:** Version bump only for package csv

## [6.3.9](https://github.com/adaltas/node-csv/compare/csv@6.3.8...csv@6.3.9) (2024-05-13)

**Note:** Version bump only for package csv

## [6.3.8](https://github.com/adaltas/node-csv/compare/csv@6.3.7...csv@6.3.8) (2024-02-28)

**Note:** Version bump only for package csv

## [6.3.7](https://github.com/adaltas/node-csv/compare/csv@6.3.6...csv@6.3.7) (2024-02-27)

**Note:** Version bump only for package csv

## [6.3.6](https://github.com/adaltas/node-csv/compare/csv@6.3.5...csv@6.3.6) (2023-12-08)

**Note:** Version bump only for package csv

## [6.3.5](https://github.com/adaltas/node-csv/compare/csv@6.3.4...csv@6.3.5) (2023-10-09)

**Note:** Version bump only for package csv

## [6.3.4](https://github.com/adaltas/node-csv/compare/csv@6.3.3...csv@6.3.4) (2023-10-05)

**Note:** Version bump only for package csv

## [6.3.3](https://github.com/adaltas/node-csv/compare/csv@6.3.2...csv@6.3.3) (2023-08-25)

### Bug Fixes

- **csv-demo-ts-cjs-node16:** upgrade module definition after latest typescript ([87fe919](https://github.com/adaltas/node-csv/commit/87fe91996fb2a8895c252177fca4f0cb59a518f9))

## [6.3.2](https://github.com/adaltas/node-csv/compare/csv@6.3.1...csv@6.3.2) (2023-08-24)

### Bug Fixes

- commonjs types, run tsc and lint to validate changes ([#397](https://github.com/adaltas/node-csv/issues/397)) ([e6870fe](https://github.com/adaltas/node-csv/commit/e6870fe272c119e273196522c9771d12ff8b2a35))

## [6.3.1](https://github.com/adaltas/node-csv/compare/csv@6.3.0...csv@6.3.1) (2023-05-26)

**Note:** Version bump only for package csv

## [6.3.0](https://github.com/adaltas/node-csv/compare/csv@6.2.12...csv@6.3.0) (2023-05-09)

### Features

- add unicode chars to formula escape ([#387](https://github.com/adaltas/node-csv/issues/387)) ([1fc177c](https://github.com/adaltas/node-csv/commit/1fc177c605e8a88e403539806890695a6ba72dec))

## [6.2.12](https://github.com/adaltas/node-csv/compare/csv@6.2.11...csv@6.2.12) (2023-05-04)

**Note:** Version bump only for package csv

## [6.2.11](https://github.com/adaltas/node-csv/compare/csv@6.2.10...csv@6.2.11) (2023-04-30)

### Bug Fixes

- **csv:** fixed CJS types under modern `modernResolution` options ([#388](https://github.com/adaltas/node-csv/issues/388)) ([54d03e4](https://github.com/adaltas/node-csv/commit/54d03e4779033ef7d574dffa98a7c3ce93da345d))
- **csv:** remove ts files in cjs dist ([d0d1089](https://github.com/adaltas/node-csv/commit/d0d1089c3ef9053c9adb9a9747ce11d5ea5cfe49))

## [6.2.10](https://github.com/adaltas/node-csv/compare/csv@6.2.8...csv@6.2.10) (2023-04-16)

### Bug Fixes

- uncaught errors with large stream chunks (fix [#386](https://github.com/adaltas/node-csv/issues/386)) ([1d500ed](https://github.com/adaltas/node-csv/commit/1d500edf38ba06fc80409974e08c37c6a40f27a1))

## [6.2.9](https://github.com/adaltas/node-csv/compare/csv@6.2.8...csv@6.2.9) (2023-04-16)

### Bug Fixes

- uncaught errors with large stream chunks (fix [#386](https://github.com/adaltas/node-csv/issues/386)) ([1d500ed](https://github.com/adaltas/node-csv/commit/1d500edf38ba06fc80409974e08c37c6a40f27a1))

## [6.2.8](https://github.com/adaltas/node-csv/compare/csv@6.2.7...csv@6.2.8) (2023-03-03)

**Note:** Version bump only for package csv

## [6.2.7](https://github.com/adaltas/node-csv/compare/csv@6.2.6...csv@6.2.7) (2023-02-08)

**Note:** Version bump only for package csv

## [6.2.6](https://github.com/adaltas/node-csv/compare/csv@6.2.5...csv@6.2.6) (2023-01-31)

**Note:** Version bump only for package csv

## [6.2.5](https://github.com/adaltas/node-csv/compare/csv@6.2.4...csv@6.2.5) (2022-11-30)

**Note:** Version bump only for package csv

## [6.2.4](https://github.com/adaltas/node-csv/compare/csv@6.2.3...csv@6.2.4) (2022-11-28)

**Note:** Version bump only for package csv

## [6.2.3](https://github.com/adaltas/node-csv/compare/csv@6.2.2...csv@6.2.3) (2022-11-22)

**Note:** Version bump only for package csv

## [6.2.2](https://github.com/adaltas/node-csv/compare/csv@6.2.1...csv@6.2.2) (2022-11-08)

**Note:** Version bump only for package csv

### [6.2.1](https://github.com/adaltas/node-csv/compare/csv@6.2.0...csv@6.2.1) (2022-10-12)

**Note:** Version bump only for package csv

## [6.2.0](https://github.com/adaltas/node-csv/compare/csv@6.1.5...csv@6.2.0) (2022-07-10)

### Features

- ts module Node16 and type declaration to exports field ([#341](https://github.com/adaltas/node-csv/issues/341)) ([4b0283d](https://github.com/adaltas/node-csv/commit/4b0283d17b7fa46daa1f87380759ba72c71ec79b))

### [6.1.5](https://github.com/adaltas/node-csv/compare/csv@6.1.4...csv@6.1.5) (2022-07-01)

**Note:** Version bump only for package csv

### [6.1.4](https://github.com/adaltas/node-csv/compare/csv@6.1.3...csv@6.1.4) (2022-06-29)

**Note:** Version bump only for package csv

### [6.1.3](https://github.com/adaltas/node-csv/compare/csv@6.1.2...csv@6.1.3) (2022-06-16)

### Bug Fixes

- **csv-stringify:** quote_match with empty string pattern quotes empty strings ([#345](https://github.com/adaltas/node-csv/issues/345)) ([1c22d2e](https://github.com/adaltas/node-csv/commit/1c22d2e07f66dd747150b5a7499b5ebd5bc0f25c)), closes [#344](https://github.com/adaltas/node-csv/issues/344)

### [6.1.2](https://github.com/adaltas/node-csv/compare/csv@6.1.1...csv@6.1.2) (2022-06-14)

**Note:** Version bump only for package csv

### [6.1.1](https://github.com/adaltas/node-csv/compare/csv@6.1.0...csv@6.1.1) (2022-06-14)

### Bug Fixes

- **csv-stringify:** bom and header in sync mode with no records (fix [#343](https://github.com/adaltas/node-csv/issues/343)) ([bff158f](https://github.com/adaltas/node-csv/commit/bff158fbc9001b2cf7177ecd0f16dc97edac55f2))

## [6.1.0](https://github.com/adaltas/node-csv/compare/csv@6.0.5...csv@6.1.0) (2022-05-24)

### Features

- wg stream api ([8a5eb7d](https://github.com/adaltas/node-csv/commit/8a5eb7dfd31b22217db4fbbc832d707221850785))

## [6.0.5](https://github.com/adaltas/node-csv/compare/csv@6.0.4...csv@6.0.5) (2021-12-29)

### Bug Fixes

- correct exports in package.json with webpack ([154eafb](https://github.com/adaltas/node-csv/commit/154eafbac866eb4499a0d392f8dcd057695c2586))
- **csv-demo-webpack-ts:** simplify export paths ([8d63a14](https://github.com/adaltas/node-csv/commit/8d63a14313bb6b26f13fafb740cc686f1dfaa65f))
- esm exports in package.json files ([c48fe47](https://github.com/adaltas/node-csv/commit/c48fe478ced7560aa078fbc36ec33d6007111e2b)), closes [#308](https://github.com/adaltas/node-csv/issues/308)

## [6.0.4](https://github.com/adaltas/node-csv/compare/csv@6.0.3...csv@6.0.4) (2021-11-19)

### Bug Fixes

- **csv-stringify:** node 12 compatibility in flush ([9145b75](https://github.com/adaltas/node-csv/commit/9145b75012ec71a0b4152036af2275bf28c460e0))

## [6.0.3](https://github.com/adaltas/node-csv/compare/csv@6.0.2...csv@6.0.3) (2021-11-19)

### Bug Fixes

- expose browser esm modules ([eb87355](https://github.com/adaltas/node-csv/commit/eb873557c65912f065d2581d30a17a96b0bfd2d6))

## [6.0.2](https://github.com/adaltas/node-csv/compare/csv@6.0.1...csv@6.0.2) (2021-11-18)

### Bug Fixes

- dont insert polyfills in cjs [#303](https://github.com/adaltas/node-csv/issues/303) ([9baf334](https://github.com/adaltas/node-csv/commit/9baf334044dab90b4a0d096a7e456d0fd5807d5b))

## [6.0.1](https://github.com/adaltas/node-csv/compare/csv@6.0.0...csv@6.0.1) (2021-11-15)

### Bug Fixes

- remove samples from publicatgion ([12c221d](https://github.com/adaltas/node-csv/commit/12c221dc37add26f094e3bb7f94b50ee06ff5be6))

# [6.0.0](https://github.com/adaltas/node-csv/compare/csv@5.5.3...csv@6.0.0) (2021-11-15)

### Bug Fixes

- **csv-generate:** finish called twice in node 16 ([3decdf1](https://github.com/adaltas/node-csv/commit/3decdf169ce3b8e0c5cadd257816c346c8e4d3fa))
- **csv:** export csv_sync ([1353284](https://github.com/adaltas/node-csv/commit/1353284aa02bb9f4f727d2653e398a869eebe20d))
- export original lib esm modules ([be25349](https://github.com/adaltas/node-csv/commit/be2534928ba21156e9cde1e15d2e8593d62ffe71))
- fallback to setTimeout is setImmediate is undefined ([3d6a2d0](https://github.com/adaltas/node-csv/commit/3d6a2d0a655af342f28456b46db7ccfe7ee9d664))
- refer to esm files in dist ([b780fbd](https://github.com/adaltas/node-csv/commit/b780fbd26f5e54494e511eb2e004d3cdedee3593))

### Features

- backport support for node 14 ([dbfeb78](https://github.com/adaltas/node-csv/commit/dbfeb78f61ed36f02936d63a53345708ca213e45))
- backward support for node 8 ([496231d](https://github.com/adaltas/node-csv/commit/496231dfd838f0a6a72269a5a2390a4c637cef95))
- esm migration ([b5c0d4b](https://github.com/adaltas/node-csv/commit/b5c0d4b191c8b57397808c0922a3f08248506a9f))
- export ts types in sync ([890bf8d](https://github.com/adaltas/node-csv/commit/890bf8d950c18a05cab5e35a461d0847d9425156))
- replace ts types with typesVersions ([acb41d5](https://github.com/adaltas/node-csv/commit/acb41d5031669f2d582e40da1c80f5fd4738fee4))

## [5.5.2](https://github.com/adaltas/node-csv/compare/csv@5.5.1...csv@5.5.2) (2021-08-27)

**Note:** Version bump only for package csv

## 5.5.1 (2021-08-27)

**Note:** Version bump only for package csv

## Version 5.5.0

feat: browersify

## Version 5.4.0

- csv-generate: 3.3.0
- csv-parse: 4.15.3
- stream-transform: 2.0.4
- csv-stringify: 5.6.2

## Version 5.3.2

- package: update project description
- csv-parse: 4.8.8
- csv-stringify: 5.3.6

## Version 5.3.1

- csv-generate: 3.2.4
- csv-parse: 4.8.2
- csv-stringify: 5.3.4

## Version 5.3.0

- csv-parse: version 4.8.0

## Version 5.2.0

- csv-parse: version 4.7.0
- package: contributing
- package: code of conduct

## Version 5.1.3

- travis: add node.js 12
- csv-parse: version 4.4.6

## Version 5.1.2

- csv-generate: version 3.2.3
- csv-parse: version 4.4.5
- csv-stringify: version 5.3.3
- stream-transform: version 2.0.1
- ts: new definition files
- project: fix license in package.json

## Version 5.1.1

- es5: fix modules to wrap es5 dependencies

## Version 5.1.0

- csv-generate: version 3.2.0
- csv-stringify: version 5.1.2
- csv-parse: version 4.3.0
- stream-transform: version 1.0.8
- babel: re-integration

## Version 5.0.1

- all: modules written in native JavaScript
- package: switch to MIT license

## Version 5.0.0

- csv-generate: version 3.1.0
- csv-stringify: version 5.0.0
- csv-parse: version 4.0.1
- travis: test with Node.js 8, 10 and 11

## Version 4.0.0

- es5: support older version of Node.js using Babel
- readme: update project website url
- sync: expose the sync api
- samples: new pipe_funny script
- samples: rewrite pipe with comments

## Version 3.1.0

- csv-parse ^2.2.0 → ^2.4.0
- package: ignore lock files

## Version 3.0.2

- package: generate js file before release

## Version 3.0.1

- package: attempt to re-submit NPM package, no ./lib/index.js present

## Version 3.0.0

- csv-generate: "^2.0.2"
- csv-parse: "^2.2.0"
- stream-transform: "^1.0.2"
- csv-stringify: "^3.0.0"
