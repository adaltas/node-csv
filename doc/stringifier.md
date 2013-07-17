---
language: en
layout: page
title: "Stringifier"
date: 2013-07-17T08:03:53.225Z
comments: false
sharing: false
footer: false
navigation: csv
github: https://github.com/wdavidw/node-csv
source: ./src/stringifier.coffee
---


Convert an array or an object into a CSV line.   

<a name="write"></a>
`write(line, [preserve])`
-------------------------

Write a line to the written stream. Line may be an object, an array or a string
The `preserve` argument is for the lines which are not considered as CSV data.   


<a name="Stringifier"></a>
`Stringifier(line)`
-------------------

Convert a line to a string. Line may be an object, an array or a string.

