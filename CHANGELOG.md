
# Changelog

## Version 2.2.0

* cast: deprecate auto_parse
* auto_parse: function get context as second argument

## Version 2.1.0

* skip_lines_with_error: DRYed implementation
* skip_lines_with_error: Go process the next line on error
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

* package: es5 backward compatiblity
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

* options: auto_parse as a user function
* options: auto_parse_date as a user function
* test: should require handled by mocha
* package: coffeescript 2 and use semver tilde
* options: ensure objectMode is cloned

## v1.2.4

* relax_column_count: honors count while preserving skipped_line_count
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
* auto_parse: cleaner implementation
* src: isolate internal variables

## v1.1.12

* options: new to and from options

## v1.1.11

* rowDelimiters: fix all last month issues

## v1.1.10

* regression with trim and last empty field #123

## V1.1.9

* rowDelimiter: simplification
* fix regression when trim and skip_empty_lines activated #122
* auto_parse = simplify internal function

## V1.1.8

* src: trailing whitespace and empty headers #120
* rowDelimiter: adding support for multiple row delimiters #119
* Remove unnecessary argument: Parser.prototype.\__write #114

## v1.1.7

* skip_lines_with_empty_values: support space and tabs #108
* test: remove coverage support
* test: group by api, options and properties
* skip_lines_with_empty_values option
* write test illustrating column function throwing an error #98
* added ability to skip columns #50

## v1.1.6

* reduce substr usage
* new raw option

## v1.1.5

* empty_line_count counter and renamed skipped to skipped_line_count
* skipped line count

## v1.1.4

* avoid deoptimization due to wrong charAt index #103
* parser writing before assigning listeners

## v1.1.3

* column: stop on column count error #100

## v1.1.2

* make the parser more sensitive to input
* test case about the chunks of multiple chars without quotes
* test about data emission with newline

## v1.1.1

* stream: call end if data instance of buffer
* travis: add nodejs 6
* columns: fix line error #97

## v1.1.0

* relax_column_count: default to false (strict)

## v1.0.6

* relax_column_count: backward compatibility for 1.0.x
* relax_column_count: introduce new option
* columns: detect column length and fix lines count

## v1.0.5

* fix quotes tests that used data with inconsistent number of #73
* add tests for inconsistent number of columns #73
* throw an error when a column is missing #73
* travis: test nodejs versions 4, 5
* max_limit_on_data_read: new option
* removing the duplicate files in test and samples #86
* option argument to accept the number of bytes can be read #86
* avoid unwanted parsing when there is wrong delimiter or row delimiter #86

## v1.0.4

* sync: support objname

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

* auto_parse: work on all fields, rename to “is_*”
* auto_parse: simplify test
