---
language: en
layout: page
title: "Transforming data"
date: 2012-10-18T13:11:44.066Z
comments: false
sharing: false
footer: false
navigation: csv
github: https://github.com/wdavidw/node-csv-parser
---


Transformation may occur synchronously or asynchronously dependending
on the provided transform callback and its declared arguments length.

Callback are called for each line and its arguments are :    

*   *data*   
  CSV record
*   *index*   
  Incremented counter
*   *callback*   
  Callback function to be called in asynchronous mode

Unless you specify the `columns` read option, `data` are provided 
as arrays, otherwise they are objects with keys matching columns 
names.

In synchronous mode, the contract is quite simple, you receive an array 
of fields for each record and return the transformed record.

In asynchronous mode, it is your responsibility to call the callback 
provided as the third argument. It must be called with two arguments,
the first one is an error if any, the second is the transformed record.

Transformed records may be an array, an associative array, a 
string or null. If null, the record will simply be skipped. When the 
returned value is an array, the fields are merged in order. 
When the returned value is an object, it will search for 
the `columns` property in the write or in the read options and 
smartly order the values. If no `columns` options are found, 
it will merge the values in their order of appearance. When the 
returned value is a string, it is directly sent to the destination 
source and it is your responsibility to delimit, quote, escape 
or define line breaks.

Transform callback run synchronously:

```javascript

csv()
.from('82,Preisner,Zbigniew\n94,Gainsbourg,Serge')
.to(console.log)
.transform(function(data, index){
    return data.reverse()
});
// Executing `node samples/transform.js`, print:
// 94,Gainsbourg,Serge\n82,Preisner,Zbigniew

```

Transform callback run asynchronously:

```javascript

csv()
.from('82,Preisner,Zbigniew\n94,Gainsbourg,Serge')
.to(console.log)
.transform(function(data, index, callback){
    process.nextTick(function(){
        callback(null, data.reverse());
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
.transform(function(data, index){
    return (index>0 ? ',' : '') + data[0] + ":" + data[2] + ' ' + data[1];
});
// Executing `node samples/transform.js`, print:
// 82:Zbigniew Preisner,94:Serge Gainsbourg
```

