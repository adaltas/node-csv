
<pre>
             _   _           _         _____  _______      __
            | \ | |         | |       / ____|/ ____\ \    / /
            |  \| | ___   __| | ___  | |    | (___  \ \  / / 
            | . ` |/ _ \ / _` |/ _ \ | |     \___ \  \ \/ /  
            | |\  | (_) | (_| |  __/ | |____ ____) |  \  /   
            |_| \_|\___/ \__,_|\___|  \_____|_____/    \/   
</pre>

This project provide CSV parsing and has been tested and used on large source file (over 2Gb).

-   Support delimiter, quote and escape characteres
-   Line breaks discovery: line breaks in source are detected and reported to destination
-   Data transformation
-   Asynch and event based
-   Support for large datasets
-   Complete test coverage as sample and inspiration

Quick exemple
-------------

Using the library is a 3 steps process where all steps are optional:

1.	Create a source
2.	Create a destination
3.	Transform the data

<pre class="javascript">
	var csv = require('csv-parser');
	csv()
	.fromPath('/tmp/csv.in');
	.toPath('/tmp/csv.out');
	.transform(function(data){
		data.unshift(data.pop());
		return data;
	});
</pre>

Creating a source
-----------------

Options are:

-   *delimiter*    
    Set the field delimiter, one character only, default to comma.
    
-   *quote*    
    Set the field delimiter, one character only, default to double quotes.
    
-   *escape*    
    Set the field delimiter, one character only, default to double quotes.

The following method are available:

-   *fromPath*    
    Take a file path as first argument and optionnaly on object of options as a second arguments.
    
-   *fromStream*    
    Take a readable stream as first argument and optionnaly on object of options as a second arguments.
    
-   *from*    
    Take a string, a buffer, an array or an object as first argument and optionnaly some options as a second arguments.

Creating a destination
----------------------

Options are:

-   *delimiter*    
    Default to the delimiter read option
    
-   *quote*    
    Default to the quote read option
    
-   *escape*    
    Default to the escape read option
    
-   *encoding*    
    Default to 'utf8'
    
-   *lineBreaks*    
    String used to delimite record rows or a special value; special values are 'auto', 'unix', 'mac', 'windows', 'unicode'; default to 'auto' (discovered in source).
    
-   *flag*    
    Default to 'w', 'w' to create or overwrite an file, 'a' to append to a file. Apply when using the `toPath` method.
    
-   *bufferSize*    
    Internal buffer holding data before being flush into a stream. Apply when destination is a stream.

The following method are available:

-   *toPath*    
    Take a file path as first argument and optionnaly on object of options as a second arguments.
    
-   *toStream*    
    Take a readable stream as first argument and optionnaly on object of options as a second arguments.

Transforming data
-----------------

You may provide a callback to the `transform` method. The contract is quite simple, you recieve an array of fields for each record and return the transformed record. The return value may be an array, an associative array, a string or null. If null, the record will simply be skipped.

Events
------

By extending the Node `EventEmitter` class, the library provide a few usefull events:

-	*data* (function(data, index){})
    Thrown when a new row is parsed after the `transform` callback and with the data being the value returned by `transform`. Note however that the event won't be call if transform return `null` since the record is skipped.
	The callback provide two arguements:
	`data` is the CSV line being processed (by default as an array)
	`index` is the index number of the line starting at zero
    
-   *end*
    In case your redirecting the output to a file using the `toPath` method, the event will be called once the writing process is complete and the file closed.
    
-   *error*
    Thrown whenever an error is captured.

Running the tests
-----------------

Tests are executed with expresso. To install it, simple use `npm install expresso`.

To run the tests
	expresso -I lib test/*

To develop with the tests watching at your changes
	expresso -w -I lib test/*

To instrument the tests
	expresso -I lib --cov test/*

Related projects
----------------

*   Pavel Kolesnikov "ya-csv": http://github.com/wdavidw/ya-csv
*   Chris Williams "node-csv": http://github.com/voodootikigod/node-csv

