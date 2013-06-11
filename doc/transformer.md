---
language: en
layout: page
title: "Transforming data"
date: 2013-06-04T09:36:56.251Z
comments: false
sharing: false
footer: false
navigation: csv
github: https://github.com/wdavidw/node-csv
---


Transformations may occur synchronously or asynchronously depending
on the provided transform callback and its declared arguments length.

Callbacks are called for each line, with these arguments:    

*   *row*   
  CSV record
*   *index*   
  Incremented counter
*   *callback*   
  Callback function to be called in asynchronous mode

If you specify the `columns` read option, the `row` argument will be 
provided as an object with keys matching columns names. Otherwise it
will be provided as an array.

In synchronous mode, the contract is quite simple, you will receive an array 
of fields for each record and the transformed array should be returned.

In asynchronous mode, it is your responsibility to call the callback 
provided as the third argument. It must be called with two arguments,
an error (if any), and the transformed record.

Transformed records may be an array, an associative array, a 
string or `null`. If `null`, the record will simply be skipped. When the
returned value is an array, the fields are merged in order. 
When the returned value is an object, the module will search for
the `columns` property in the write or in the read options and 
intelligently order the values. If no `columns` options are found, 
it will merge the values in their order of appearance. When the 
returned value is a string, it is directly sent to the destination 
and it is your responsibility to delimit, quote, escape 
or define line breaks.

Transform callback run synchronously:

```javascript

csv()
.from('82,Preisner,Zbigniew\n94,Gainsbourg,Serge')
.to(console.log)
.transform(function(row, index){
    return row.reverse()
});
// Executing `node samples/transform.js`, print:
// 94,Gainsbourg,Serge\n82,Preisner,Zbigniew

```

Transform callback run asynchronously:

```javascript

csv()
.from('82,Preisner,Zbigniew\n94,Gainsbourg,Serge')
.to(console.log)
.transform(function(row, index, callback){
    process.nextTick(function(){
        callback(null, row.reverse());
    });
});
// Executing `node samples/transform.js`, print:
// 94,Gainsbourg,Serge\n82,Preisner,Zbigniew

```

Transform callback returning a string:

```javascript

csv()
.from('82,Preisner,Zbigniew\n94,Gainsbourg,Serge')
.to(console.log)
.transform(function(row, index){
    return (index>0 ? ',' : '') + row[0] + ":" + row[2] + ' ' + row[1];
});
// Executing `node samples/transform.js`, print:
// 82:Zbigniew Preisner,94:Serge Gainsbourg
```

