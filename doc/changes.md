---
language: en
layout: page
title: "Changes in latest versions"
date: 2012-10-24T16:24:28.045Z
comments: false
sharing: false
footer: false
navigation: csv
github: https://github.com/wdavidw/node-csv-parser
---

version 0.2.6
-------------

*   Print headers if no records
*   Add function `to.prototype.array`
*   TSV sample
*   Test 0, null and undefined values in `from.prototype.array`

version 0.2.5
-------------

*   Print doc generation path
*   Update doc generation with latest each dependency
*   Remove buffer related test

version 0.2.4
-------------

*   Speed improvement to transformation

version 0.2.3
-------------

*   Fix stdout samples
*   Install instruction
*   Honor the pipe `end` option

version 0.2.2
-------------

*   Function `from.stream` now use a "pipe" implementation
*   Add `setEncoding` to the generator to respect the readable stream API

version 0.2.1
-------------

*   Line number in parsing error
*   Asynchronous transformation
*   Have from stream send pause/resume advisories from csv to stream
*   Column property to column name if defined option column defined as an object
*   Pass options in the `from` and `to` functions
*   Function `to.string` receives the number of written records
*   Skip UTF BOM from first data event on UTF-8 decoded stream
*   Fix from array with the column options
*   Travis support
*   More doc about columns and transformation
*   Update and improve samples
*   Backward compatibility width Node.js < 0.8.x

version 0.2.0
-------------

*   Add `to` and `from` convenient functions
*   Documentation generation
*   New generator function and class
*   Full stream support
*   Externalize the parse, stringify and transform functionnalities
*   Rename the `data` event to `record`
*   Test coverage
*   Isolate state into its own file
*   Isolate default options into their own file; Implement `to.options`
*   Convert lib to coffee
*   Rename `from*` and `to*` functions to `from.*` and `to.*`