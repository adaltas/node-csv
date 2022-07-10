# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [5.3.0](https://github.com/adaltas/node-csv/compare/csv-parse@5.2.2...csv-parse@5.3.0) (2022-07-10)


### Features

* ts module Node16 and type declaration to exports field ([#341](https://github.com/adaltas/node-csv/issues/341)) ([4b0283d](https://github.com/adaltas/node-csv/commit/4b0283d17b7fa46daa1f87380759ba72c71ec79b))



### [5.2.2](https://github.com/adaltas/node-csv/compare/csv-parse@5.2.1...csv-parse@5.2.2) (2022-07-01)


### Bug Fixes

* **csv-parse:** encoding detection with bom ([#350](https://github.com/adaltas/node-csv/issues/350)) ([fd75e66](https://github.com/adaltas/node-csv/commit/fd75e6626c1c549936bf35a2247ebefa0f3d5ec3))



### [5.2.1](https://github.com/adaltas/node-csv/compare/csv-parse@5.2.0...csv-parse@5.2.1) (2022-06-29)


### Bug Fixes

* **csv-parse:** rtrim encoding support (fix [#349](https://github.com/adaltas/node-csv/issues/349)) ([8bf52f0](https://github.com/adaltas/node-csv/commit/8bf52f0d5c25ee2423cb1629d3e9103534668c83))



## [5.2.0](https://github.com/adaltas/node-csv/compare/csv-parse@5.1.0...csv-parse@5.2.0) (2022-06-14)


### Features

* **csv-parse:** cast_date as a function (fix [#342](https://github.com/adaltas/node-csv/issues/342)) ([2807d29](https://github.com/adaltas/node-csv/commit/2807d292c8987f5dedde4f7fe0bd0ac7f75c8755))



## [5.1.0](https://github.com/adaltas/node-csv/compare/csv-parse@5.0.4...csv-parse@5.1.0) (2022-05-24)


### Features

* wg stream api ([8a5eb7d](https://github.com/adaltas/node-csv/commit/8a5eb7dfd31b22217db4fbbc832d707221850785))



## [5.0.4](https://github.com/adaltas/node-csv/compare/csv-parse@5.0.3...csv-parse@5.0.4) (2021-12-29)


### Bug Fixes

* correct exports in package.json with webpack ([154eafb](https://github.com/adaltas/node-csv/commit/154eafbac866eb4499a0d392f8dcd057695c2586))
* **csv-demo-webpack-ts:** remove polyfill ([47a99bd](https://github.com/adaltas/node-csv/commit/47a99bd944d1d943e6374227dbc4e20aaa2c8c7f))
* **csv-demo-webpack-ts:** simplify export paths ([8d63a14](https://github.com/adaltas/node-csv/commit/8d63a14313bb6b26f13fafb740cc686f1dfaa65f))
* esm exports in package.json files ([c48fe47](https://github.com/adaltas/node-csv/commit/c48fe478ced7560aa078fbc36ec33d6007111e2b)), closes [#308](https://github.com/adaltas/node-csv/issues/308)





## [5.0.3](https://github.com/adaltas/node-csv/compare/csv-parse@5.0.2...csv-parse@5.0.3) (2021-11-19)


### Bug Fixes

* expose browser esm modules ([eb87355](https://github.com/adaltas/node-csv/commit/eb873557c65912f065d2581d30a17a96b0bfd2d6))





## [5.0.2](https://github.com/adaltas/node-csv/compare/csv-parse@5.0.1...csv-parse@5.0.2) (2021-11-18)


### Bug Fixes

* dont insert polyfills in cjs [#303](https://github.com/adaltas/node-csv/issues/303) ([9baf334](https://github.com/adaltas/node-csv/commit/9baf334044dab90b4a0d096a7e456d0fd5807d5b))


### Performance Improvements

* **csv-parse:** buffer unsafe allocation ([35c1f4a](https://github.com/adaltas/node-csv/commit/35c1f4a9dd806adc4de749c2e211bd436224d7f0))





## [5.0.1](https://github.com/adaltas/node-csv/compare/csv-parse@5.0.0...csv-parse@5.0.1) (2021-11-15)


### Bug Fixes

* remove samples from publicatgion ([12c221d](https://github.com/adaltas/node-csv/commit/12c221dc37add26f094e3bb7f94b50ee06ff5be6))





# [5.0.0](https://github.com/adaltas/node-csv/compare/csv-parse@4.16.3...csv-parse@5.0.0) (2021-11-15)

See also [CSV package for Node.js version 6 (11/15/2021)](https://www.adaltas.com/en/2021/11/15/csv-version-6/)

### ⚠ BREAKING CHANGES

* esm migration ([b5c0d4b](https://github.com/adaltas/node-csv/commit/b5c0d4b191c8b57397808c0922a3f08248506a9f))
  CommonJS consumers must change `require('csv-parse/lib/sync')` to `require('csv-parse/sync')`
* **csv-parse:** rename group_columns_by_name option [74334cf](https://github.com/adaltas/node-csv/commit/74334cf0e85e005a878c0597b3300f4762116a0d)
* **csv-parse:** rename RECORD_INCONSISTENT_FIELDS_LENGTH [7b55f05](https://github.com/adaltas/node-csv/commit/7b55f050df327939efcb65d4e76d27f98c89d925)
* **csv-parse:** rename RECORD_DONT_MATCH_COLUMNS_LENGTH [fb391c9](https://github.com/adaltas/node-csv/commit/fb391c92fa248bda30b816930cac88a5d9026b04)
* **csv-parse:** rename skip_records_with_error [0376af7](https://github.com/adaltas/node-csv/commit/0376af7984caa6726d12980edecccda1bbbbcacc)
* **csv-parse:** rename skip_records_with_empty_values [aa432c1](https://github.com/adaltas/node-csv/commit/aa432c1251327b579ee7f71bd9fd776021ac1f1e)
* **csv-parse:** rename relax to relax_quotes [9fffd50](https://github.com/adaltas/node-csv/commit/9fffd50762e10b3794883c6b3751ad209510f82e)

### Bug Fixes

* **csv-parse:** export csv error class in sync ([fc89380](https://github.com/adaltas/node-csv/commit/fc8938090141861dcbcae214f64e52a0aa6cc691))
* **csv-parse:** ts callback CsvError argument ([899dc67](https://github.com/adaltas/node-csv/commit/899dc67ed6256478e8eecbcc5b925f238ce367d5))
* export original lib esm modules ([be25349](https://github.com/adaltas/node-csv/commit/be2534928ba21156e9cde1e15d2e8593d62ffe71))
* fallback to setTimeout is setImmediate is undefined ([3d6a2d0](https://github.com/adaltas/node-csv/commit/3d6a2d0a655af342f28456b46db7ccfe7ee9d664))
* refer to esm files in dist ([b780fbd](https://github.com/adaltas/node-csv/commit/b780fbd26f5e54494e511eb2e004d3cdedee3593))


### Features

* backport support for node 14 ([dbfeb78](https://github.com/adaltas/node-csv/commit/dbfeb78f61ed36f02936d63a53345708ca213e45))
* backward support for node 8 ([496231d](https://github.com/adaltas/node-csv/commit/496231dfd838f0a6a72269a5a2390a4c637cef95))
* **csv-parse:** improve record_delimiter validation ([67b7da8](https://github.com/adaltas/node-csv/commit/67b7da892db7f0f426b9f0fa12063e81eafe8a9b))
* **csv-parse:** objname index ([015b936](https://github.com/adaltas/node-csv/commit/015b936ea42026efa52263a7687f886463263ed8))
* **csv-parse:** skip_line_with_errors used with raw print current buffer (fix [#292](https://github.com/adaltas/node-csv/issues/292)) ([2741990](https://github.com/adaltas/node-csv/commit/27419908b9ce5319307bb6647335d5c07cd1e3a4))
* **csv-parse:** ts type encoding with BufferEncoding ([39a4388](https://github.com/adaltas/node-csv/commit/39a43886904801d47a92a3cb5722409f36020534))
* export ts types in sync ([890bf8d](https://github.com/adaltas/node-csv/commit/890bf8d950c18a05cab5e35a461d0847d9425156))
* replace ts types with typesVersions ([acb41d5](https://github.com/adaltas/node-csv/commit/acb41d5031669f2d582e40da1c80f5fd4738fee4))





## [4.16.2](https://github.com/wdavidw/node-csv-parse/compare/csv-parse@4.16.1...csv-parse@4.16.2) (2021-08-27)

**Note:** Version bump only for package csv-parse





## 4.16.1 (2021-08-27)

**Note:** Version bump only for package csv-parse

## Version 4.16.0

* fix: info print the number of encountered line when emited
* feat: cast expose context.empty_lines
* fix: handle empty column names properly
* feat: enforce usage of columns with columns_duplicates_to_array
* fix: update error message with invalid column type

## Version 4.15.4

* fix: handle cast value 0 fix #315

## Version 4.15.3

* feat: lib/browser compatibility with ES5

## Version 4.15.2

* docs: browser demo fix #302
* fix: browserify export parse instead of stringify

## Version 4.15.1

* fix: skip_empty_lines don't interfere with from_line

## Version 4.15.0

* feat: new ignore_last_delimiters option, solve #193
* feat: generate browser compatible lib
* refactor: rename raw to record
* docs: comment about trimable chars
* refactor: move isCharTrimable

## Version 4.14.2

* fix(skip_lines_with_error): work with relax_column_count (#303)
* sample: async iterator
* sample: promises

## Version 4.14.1

* package: latest dependencies
* ts: enable strict mode
* package: mocha inside package declaration

## Version 4.14.0

* on_record: expose info.error when relax_column_count is activated
* raw: move tests
* package: latest dependencies

## Version 4.13.1

* encoding: buffer, detection and options samples
* encoding: return buffer when null or false
* encoding: support boolean values
* api: remove commented code

## Version 4.13.0

New features:
* encoding: auto-detect from the bom
* encoding: new option
* bom: multi bom encoding

Fixes & enhancements:
* delimiter: fix buffer size computation
* quote: compatibility with buffer size
* api: partial cache for needMoreData
* escape: support multiple characters
* quote: support multiple characters
* api: fix internal argument name

## Version 4.12.0

New feature:
* ts: error types
* ts: support camelcase options (fix #287)

## Version 4.11.1

New feature:
* escape: disabled when null or false

Project management:
* travis: test node version 14

## Version 4.11

Project management:
* mistake in the release

## Version 4.10.1

Minor improvements:
* columns_duplicates_to_array: error and type

## Version 4.10.0

New feature:
* columns_duplicates_to_array: new option

Project management:
* samples: new file recipie

## Version 4.9.1

Minor improvements:
* delimiter: update ts definition
* delimiter: new sample

## Version 4.9.0

New Feature:
* delimiter: accept multiple values

## Version 4.8.9

Fix:
* sync: disregard emitted null records

New Feature:
* trim: support form feed character

Minor improvements:
* src: cache length in loops
* trim: new sample
* to_line: simple sample
* comment: simple sample
* bom: sample with hidden bom
* bom: test behavior with the column option

## Version 4.8.8

* api: fix regression in browser environments

## Version 4.8.7

* api: fix input string with output stream

## Version 4.8.6

* on_record: catch and handle user errors

## Version 4.8.5

* ts: fix `types` declaration

## Version 4.8.4

* ts: fix `types` declaration to a single file

## Version 4.8.3

* `errors`: handle undefined captureStackTrace

## Version 4.8.2

* `relax_column_count`: ts definitions for less and more

## Version 4.8.1

* package: move pad dependency to dev

## Version 4.8.0

* `relax_column_count`: new less and more options
* columns: skip empty records before detecting headers
* errors: rename `CSV_INCONSISTENT_RECORD_LENGTH`
* errors: rename `CSV_RECORD_DONT_MATCH_COLUMNS_LENGTH`

## Version 4.7.0

New Feature:
* `on_record`: user function to alter and filter records

Minor improvements:
* test: ensure every sample is valid
* `from_line`: honours inferred column names
* `from_line`: new sample
* errors: expose `CSV_INVALID_ARGUMENT`
* errors: expose `CSV_INVALID_COLUMN_DEFINITION`
* errors: expose `CSV_OPTION_COLUMNS_MISSING_NAME`
* errors: expose `CSV_INVALID_OPTION_BOM`
* errors: expose `CSV_INVALID_OPTION_CAST`
* errors: expose `CSV_INVALID_OPTION_CAST_DATE`
* errors: expose `CSV_INVALID_OPTION_COLUMNS`
* errors: expose `CSV_INVALID_OPTION_COMMENT`
* errors: expose `CSV_INVALID_OPTION_DELIMITER`
* error: fix call to supper

Project management:
* package: contributing
* package: code of conduct

## Version 4.6.5

* context: column is null when cast force the context creation, fix #260

## Version 4.6.4

* errors: don't stringify/parse undefined and null values
* errors: expose `CSV_NON_TRIMABLE_CHAR_AFTER_CLOSING_QUOTE`
* errors: expose `CSV_MAX_RECORD_SIZE`

## Version 4.6.3

* lint: integrate eslint

## Version 4.6.2

* context: null column when columns number inferior to record length

## Version 4.6.1

* src: set const in for loop

## Version 4.6.0

* `skip_lines_with_empty_values`: handle non string value
* errors: add context information
* tests: new error assertion framework
* buffer: serialize to json as string
* errors: expose `INVALID_OPENING_QUOTE`

## Version 4.5.0

* errors: start normalizing errors with unique codes and context
* errors: expose `CSV_INVALID_CLOSING_QUOTE`
* errors: expose `CSV_QUOTE_NOT_CLOSED`
* errors: expose `CSV_INVALID_RECORD_LENGTH_DONT_PREVIOUS_RECORDS`
* errors: expose `CSV_INVALID_RECORD_LENGTH_DONT_MATCH_COLUMNS`
* errors: expose `CSV_INVALID_COLUMN_MAPPING`

## Version 4.4.7

* travis: remove node.js 8 and add 12
* destroy: test inside readable event

## Version 4.4.6

* security: remove regexp vulnerable to DOS in cast option, npm report 69742

## Version 4.4.5

* ts: add buffer as allowed type for input, fix #248

## Version 4.4.4

* package: latest dependencies
* bom: detection when buffer smaller than bom
* package: remove deprecated `@types/should` dependency
* package: update file path

## Version 4.4.3

* package: fix files declaration

## Version 4.4.2

* `bom`: parsing for BOM character #239
* ts: add sync definition
* package: replace npm ignore with file field

## Version 4.4.1

Fix:
* `columns`: allows returning an array of string, undefined, null or false

## Version 4.4.0

New features:
* options: new `bom` option

## Version 4.3.4

* `columns`: enrich error message when provided as literal object
* `cast`: handle undefined columns
* `skip_lines_with_error`: new sample

## Version 4.3.3

Fix:
columns: fix es5 generation

## Version 4.3.2

Fix:
* columns: immutable option

## Version 4.3.1

Minor enhancements:
* ts: distribute definitions with es5
* ts: unused MatcherFunc type

Project management:
* babel: include .babelrc to git

## Version 4.3.0

New features:
* `objname`: accept a buffer

Minor enhancements:
* `to_line`: validation refinements
* `trim`, ltrim, rtrim: validation refinements
* `to`: validation refinements
* `from_line`: validation refinements
* `objname`: validation refinements
* `from`: validation refinements
* `escape`: validation refinements
* `skip_empty_lines`: validation refinements
* `skip_lines_with_empty_values`: validation refinements
* `skip_lines_with_error`: validation refinements
* `relax_column_count`: validation refinements
* `relax`: validation refinements
* `delimiter`: validation refinements
* `max_record_size`: validation refinements

## Version 4.2.0

Fix:
* `record_delimiter`: fix multi bytes with `skip_empty_lines` and `from_line`
* `rtrim`: accept tab

## Version 4.1.0

New features:
* options: accept snake case and camel case
* `cast`: dont call cast for non column-mappable fields

Fix:
* `cast`: ensure column is a string and not an array
* stream: handle empty input streams
* `cast`: function may return non-string values
* stream: pass stream options without modification

## Version 4.0.1

Fix:
* `relax_column_count`: handle records with more columns

## Version 4.0.0

This is a complete rewrite based with a Buffer implementation. There are no major breaking changes but it introduces multiple minor breaking changes:

* option `rowDelimiter` is now `record_delimiter`
* option `max_limit_on_data_read` is now `max_record_size`
* drop the record event
* normalise error message as `{error type}: {error description}`
* state values are now isolated into the `info` object
* `count` is now `info.records`
* `lines` is now `info.lines`
* `empty_line_count` is now `info.empty_lines`
* `skipped_line_count` is now `info.invalid_field_length`
* `context.count` is cast function is now `context.records`
* drop support for deprecated options `auto_parse` and `auto_parse_date`
* drop emission of the `record` event
* in `raw` option, the `row` property is renamed `record`
* default value of `max_record_size` is now `0` (unlimited)
* remove the `record` event, use the `readable` event and `this.read()` instead

New features:
* new options `info`, `from_line` and `to_line`
* `trim`: respect `ltrim` and `rtrim` when defined
* `delimiter`: may be a Buffer
* `delimiter`: handle multiple bytes/characters
* callback: export info object as third argument
* `cast`: catch error in user functions
* ts: mark info as readonly with required properties
* `comment_lines`: count the number of commented lines with no records
* callback: pass undefined instead of null

API management:
* Multiple tests have been rewritten with easier data sample
* Source code is now written in ES6 instead of CoffeeScript
* package: switch to MIT license

## Version 3.2.0

* `max_limit_on_data_read`: update error msg
* src: simplify detection for more data
* lines: test empty line account for 1 line
* options: extract default options
* package: add a few keywords
* src: precompute escapeIsQuote
* travis: test against Node.js 11

## Version 3.1.3

* `rowDelimiter`: fix overlap with delimiter
* internal: rename rowDelimiterLength to `rowDelimiterMaxLength`

## Version 3.1.2

* readme: fix links to project website

## Version 3.1.1

* src: generate code

## Version 3.1.0

* package: move to csv.js.org
* samples: new cast sample
* package: upgrade to babel 7
* samples: new mixed api samples
* samples: new column script
* samples: update syntax
* package: improve ignore files

## Version 3.0.0

Breaking changes:
* `columns`: skip empty values when null, false or undefined

Cleanup:
* sync: refactor internal variables
* index: use destructuring assignment for deps

## Version 2.5.0

* typescript: make definition header more relevant

## Version 2.4.1

* `to`: ignore future records when to is reached

## Version 2.4.0

* `trim`: after and before quote
* tests: compatibility with Node.js 10
* `trim`: handle quote followed by escape
* parser: set nextChar to null instead of empty
* travis: run against node 8 and 10

## Version 2.3.0

* `cast`: pass the header property
* `auto_parse`: deprecated message on tests
* `cast`: inject lines property

## Version 2.2.0

* `cast`: deprecate `auto_parse`
* `auto_parse`: function get context as second argument

## Version 2.1.0

* `skip_lines_with_error`: DRYed implementation
* `skip_lines_with_error`: Go process the next line on error
* events: register and write not blocking
* test: prefix names by group membership
* events: emit record
* raw: test to ensure it preserve columns
* package: latest dependencies (28 march 2018)
* raw: ensure tests call and success
* package: ignore npm and yarn lock files
* sync: handle errors on last line

## Version 2.0.4

* package: move babel to dev dependencies

## Version 2.0.3

* package: es5 backward compatibility
* package: ignore yarn lock file

## Version 2.0.2

* package: only remove js files in lib
* source: remove unreferenced variables #179
* package: start running tests in preversion
* package: new release workflow

## 2.0.0

This major version use CoffeeScript 2 which produces a modern JavaScript syntax 
(ES6, or ES2015 and later) and break the compatibility with versions of Node.js 
lower than 7.6 as well as the browsers. It is however stable in term of API.

* package: use CoffeeScript 2

## v1.3.3

* package: revert to CoffeeScript 1

## v1.3.2

Irrelevant release, forgot to generate the coffee files.

## v1.3.1

* package: preserve compatibility with Node.js < 7.6

## v1.3.0

* options: `auto_parse` as a user function
* options: `auto_parse_date` as a user function
* test: should require handled by mocha
* package: coffeescript 2 and use semver tilde
* options: ensure objectMode is cloned

## v1.2.4

* `relax_column_count`: honors count while preserving skipped_line_count
* api: improve argument validation 

## v1.2.3

* sync: catch err on write

## v1.2.2

* relax: handle double quote

## v1.2.1

* src: group state variable initialisation
* package: update repo url
* quote: disabled when null, false or empty
* src: remove try/catch
* src: optimize estimation for row delimiter length
* lines: improve tests
* src: use in instead of multiple is
* src: string optimization

## v1.2.0

* skip default row delimiters when quoted #58
* `auto_parse`: cleaner implementation
* src: isolate internal variables

## v1.1.12

* options: new to and from options

## v1.1.11

* `rowDelimiters`: fix all last month issues

## v1.1.10

* regression with trim and last empty field #123

## V1.1.9

* `rowDelimiter`: simplification
* fix regression when trim and skip_empty_lines activated #122
* `auto_parse` = simplify internal function

## V1.1.8

* src: trailing whitespace and empty headers #120
* `rowDelimiter`: adding support for multiple row delimiters #119
* Remove unnecessary argument: `Parser.prototype.__write` #114

## v1.1.7

* `skip_lines_with_empty_values`: support space and tabs #108
* test: remove coverage support
* test: group by api, options and properties
* `skip_lines_with_empty_values` option
* write test illustrating column function throwing an error #98
* added ability to skip columns #50

## v1.1.6

* reduce substr usage
* new raw option

## v1.1.5

* `empty_line_count` counter and renamed skipped to `skipped_line_count`
* skipped line count

## v1.1.4

* avoid de-optimisation due to wrong charAt index #103
* parser writing before assigning listeners

## v1.1.3

* `columns`: stop on column count error #100

## v1.1.2

* make the parser more sensitive to input
* test case about the chunks of multiple chars without quotes
* test about data emission with newline

## v1.1.1

* stream: call end if data instance of buffer
* travis: add nodejs 6
* `columns`: fix line error #97

## v1.1.0

* `relax_column_count`: default to false (strict)

## v1.0.6

* `relax_column_count`: backward compatibility for 1.0.x
* `relax_column_count`: introduce new option
* `columns`: detect column length and fix lines count

## v1.0.5

* fix quotes tests that used data with inconsistent number of #73
* add tests for inconsistent number of columns #73
* throw an error when a column is missing #73
* travis: test nodejs versions 4, 5
* `max_limit_on_data_read`: new option
* removing the duplicate files in test and samples #86
* option argument to accept the number of bytes can be read #86
* avoid unwanted parsing when there is wrong delimiter or row delimiter #86

## v1.0.4

* sync: support `objname`

## v1.0.3

* sync: please older versions of node.js
* sync: new sample

## v1.0.2

* sync: new module
* removed global variable record on stream.js example #70

## v1.0.1

* api: accept buffer with 3 arguments #57
* package: latest dependencies
* spectrum: bypass regression test

## v1.0.0

* `auto_parse`: work on all fields, rename to “is_*”
* `auto_parse`: simplify test
