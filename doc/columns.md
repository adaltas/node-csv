---
language: en
layout: page
title: "Columns ordering and filtering"
date: 2012-10-24T13:17:49.531Z
comments: false
sharing: false
footer: false
navigation: csv
github: https://github.com/wdavidw/node-csv-parser
---

Columns are defined in the `csv.options.from` and `csv.options.to`.
Columns names may be provided or discovered in the first line with the 
read options `columns`. Most users will define columns as an
array of property names. If defined as an array, the order must match 
the one of the input source. If set to `true`, the fields are 
expected to be present in the first line of the input source. For greater 
flexibility in parallel with the `csv.options.to.header` option,
it is possible to define the "columns" options as an object where keys 
are the property names and values are the display name.

You can define a different order and even different columns in the 
read options and in the write options. If `columns` is not defined 
in the write options, it will default to the one present in the read options. 

When working with fields, the `transform` method and the `data` 
events receive their `row` parameter as an object instead of an 
array where the keys are the field names.

```javascript
// node samples/column.js
var csv = require('csv');

csv()
.from.path(__dirname+'/columns.in', {
  columns: true
})
.to.stream(process.stdout, {
  columns: ['id', 'name']
})
.transform(function(row){
  row.name = row.firstname + ' ' + row.lastname
  return row;
});

// Print sth like:
// 82,Zbigniew Preisner
// 94,Serge Gainsbourg
```

Columns as `true`:

```javascript
var data = 'field1,field2\nval1,val2';
csv()
.from(data, {columns: true})
.to(function(data){
  data.should.eql('val1,val3');
});
```

Columns as an array:

```javascript
var data = 'field1,field2,field3\nval1,val2,val3';
csv()
.from(data, {columns: true})
.to(function(data){
  data.should.eql('val1,val3');
}, {columns: ['field1', 'field3']});
```

Columns as an object with header option:

```javascript
var data = 'field1,field2,field3\nval1,val2,val3';
csv()
.from(data, {columns: true})
.to(function(data){
  data.should.eql('column1,column3\nval1,val3');
}, {columns: {field1: 'column1', field3: 'column3'}, header: true});
```



