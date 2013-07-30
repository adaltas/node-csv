---
language: en
layout: page
title: "Writing data to a destination"
date: 2013-07-30T09:03:48.121Z
comments: false
sharing: false
footer: false
navigation: csv
github: https://github.com/wdavidw/node-csv
source: ./src/to.coffee
---


The `csv().to` property provides functions to read from a CSV instance and
to write to an external destination. The destination may be a stream, a file
or a callback. 

You may call the `to` function or one of its sub function. For example, 
here are two identical ways to write to a file:

```javascript

csv.from(data).to('/tmp/data.csv');
csv.from(data).to.path('/tmp/data.csv');
```


<a name="to"></a>
`to(mixed)`
-----------

Write from any sort of destination. It should be considered as a convenient function 
which will discover the nature of the destination where to write the CSV data.   

If the parameter is a function, then the csv will be provided as the first argument 
of the callback. If it is a string, then it is expected to be a 
file path. If it is an instance of `stream`, it consider the object to be an  
output stream. 

Here's some examples on how to use this function:

```javascript

csv()
.from('"1","2","3","4","5"')
.to(function(data){ console.log(data) })

csv()
.from('"1","2","3","4","5"')
.to('./path/to/file.csv')

csv()
.from('"1","2","3","4","5"')
.to(fs.createWriteStream('./path/to/file.csv'))
```



<a name="to.options"></a>
`to.options([options])`
-----------------------

Update and retrieve options relative to the output. Return the options 
as an object if no argument is provided.

*   `delimiter`   Set the field delimiter, one character only, defaults to `options.from.delimiter` which is a comma.
*   `quote`       Defaults to the quote read option.
*   `quoted`      Boolean, default to false, quote all the fields even if not required.
*   `escape`      Defaults to the escape read option.
*   `columns`     List of fields, applied when `transform` returns an object, order matters, read the transformer documentation for additionnal information.
*   `header`      Display the column names on the first line if the columns option is provided.
*   `lineBreaks`  String used to delimit record rows or a special value; special values are 'auto', 'unix', 'mac', 'windows', 'unicode'; defaults to 'auto' (discovered in source or 'unix' if no source is specified).
*   `flags`       Defaults to 'w', 'w' to create or overwrite an file, 'a' to append to a file. Applied when using the `toPath` method.
*   `newColumns`  If the `columns` option is not specified (which means columns will be taken from the reader options, will automatically append new columns if they are added during <a name="transform"></a>
`transform()`.
*   `end`         Prevent calling `end` on the destination, so that destination is no longer writable.
*   `eof`         Add a linebreak on the last line, default to false, expect a charactere or use '\n' if value is set to "true"

The end options is similar to passing `{end: false}` option in <a name="stream.pipe"></a>
`stream.pipe()`. According to the Node.js documentation:
> By default end() is called on the destination when the source stream emits end, so that destination is no longer writable. Pass { end: false } as options to keep the destination stream open. 


<a name="to.string"></a>
`to.string(callback, [options])`
------------------------------

Provide the output string to a callback.

```javascript

csv()
.from( '"1","2","3"\n"a","b","c"' )
.to.string( function(data, count){} )

```

Callback is called with 2 arguments:
*   data      Entire CSV as a string
*   count     Number of stringified records


<a name="to.stream"></a>
`to.stream(stream, [options])`
------------------------------

Write to a stream. Take a writable stream as first argument and  
optionally an object of options as a second argument.

Additionnal options may be defined. See the [`readable.pipe` 
documentation][srpdo] for additionnal information.

[srpdo]: http://www.nodejs.org/api/stream.html#stream_readable_pipe_destination_options


<a name="to.path"></a>
`to.path(path, [options])`
--------------------------

Write to a path. Take a file path as first argument and optionally an object of 
options as a second argument. The `close` event is sent after the file is written. 
Relying on the `end` event is incorrect because it is sent when parsing is done 
but before the file is written.

Additionnal options may be defined with the following default:

```javascript

{ flags: 'w',
  encoding: null,
  mode: 0666 }

```

See the [`fs.createReadStream` documentation][fscpo] for additionnal information.

[fscpo]: http://www.nodejs.org/api/fs.html#fs_fs_createwritestream_path_options

Example to modify a file rather than replacing it:

```javascript

csv()
.to.file('my.csv', {flags:'r+'})
.write(['hello', 'node'])
.end()
```



<a name="to.array"></a>
`to.array(path, [options])`
--------------------------

Provide the output string to a callback.

```javascript

csv()
.from( '"1","2","3"\n"a","b","c"' )
.to.array( function(data, count){} )

```

Callback is called with 2 arguments:
*   data      Entire CSV as an array of records
*   count     Number of stringified records

