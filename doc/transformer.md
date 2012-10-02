---
language: en
layout: page
title: "Transforming data"
date: 2012-10-02T15:35:24.009Z
comments: false
sharing: false
footer: false
navigation: csv
github: https://github.com/wdavidw/node-csv
---


The contract is quite simple, you receive an array of fields for 
each record and return the transformed record. The return value 
may be an array, an associative array, a string or null. If null, 
the record will simply be skipped.

Unless you specify the `columns` read option, `data` are provided 
as arrays, otherwise they are objects with keys matching columns 
names.

When the returned value is an array, the fields are merged in 
order. When the returned value is an object, it will search for 
the `columns` property in the write or in the read options and 
smartly order the values. If no `columns` options are found, 
it will merge the values in their order of appearance. When the 
returned value is a string, it is directly sent to the destination 
source and it is your responsibility to delimit, quote, escape 
or define line breaks.

Example of transform returning a string

```javascript
// node samples/transform.js
var csv = require('csv');

csv()
.from.path(__dirname+'/transform.in')
.to.stream(process.stdout)
.transform(function(data, index){
  return (index>0 ? ',' : '') + data[0] + ":" + data[2] + ' ' + data[1];
});

// Print sth like:
// 82:Zbigniew Preisner,94:Serge Gainsbourg
```
<a name="transform"></a>`transform(line)`
-----------------

Call a callback to transform a line. Used by the `parse` function on each 
line. It is responsible for transforming the data and finally calling `write`.

