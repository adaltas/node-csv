[![Build Status](https://secure.travis-ci.org/wdavidw/node-csv-parse.png)](http://travis-ci.org/wdavidw/node-csv-parse)

Part of the [CSV module](https://github.com/wdavidw/node-csv), this project is a
parser converting CSV text input into arrays or objects. It implements the 
Node.js [stream.Transform`API](http://nodejs.org/api/stream.html#stream_class_stream_transform). It also provides a simple callback-base API for convenience. It is both extremely easy to use and powerful. It was first
released in 2010 and is used against big data sets by a large community.

[The full documentation of the CSV parser is available here](http://www.adaltas.com/projects/node-csv/).

## Features

*   Follow the Node.js streaming API
*   Support delimiters, quotes, escape characters and comments
*   Line breaks discovery
*   Support big datasets
*   Complete test coverage and samples for inspiration
*   no external dependencies
*   to be used conjointly with `csv-generate`, `stream-transform` and `csv-stringify`


## Usage

Run `npm install csv` to install the full CSV package or run 
`npm install csv-parse` if you are only interested by the CSV parser.

Use the callback style API for simplicity or the stream based API for 
scalability. You may also mix the two styles. For example, the 
[fs_read.js example][fs_read] pipe a file stream reader and get the results 
inside a callback.

For examples, refer to [the "samples" folder][csv-samples], 
the documentation or [the "test" folder][csv-test].

### Using the callback API

The parser receive a string and returns an array inside a user-provided 
callback. This example is available with the command `node samples/callback.js`.

See the full list of supported parsing options below.

```javascript
var parse = require('csv-parse');
require('should');

var input = '#Welcome\n"1","2","3","4"\n"a","b","c","d"';
parse(input, {comment: '#'}, function(err, output){
  output.should.eql([ [ '1', '2', '3', '4' ], [ 'a', 'b', 'c', 'd' ] ]);
});
```

### Using the stream API

The CSV parser implements the [stream.Transform`API][stream_transform].

CSV data is send through the `write` function and the resulted data is obtained
within the "readable" event by calling the `read` function. This example is 
available with the command `node samples/stream.js`.

See the full list of supported parser options below.
    
```javascript
var parse = require('csv-parse');
require('should');

var output = [];
// Create the parser
var parser = parse({delimiter: ':'});
// Use the writable stream api
parser.on('readable', function(){
  while(record = parser.read()){
    output.push(record);
  }
});
// Catch any error
parser.on('error', function(err){
  console.log(err.message);
});
// When we are done, test that the parsed output matched what expected
parser.on('finish', function(){
  output.should.eql([
    [ 'root','x','0','0','root','/root','/bin/bash' ],
    [ 'someone','x','1022','1022','a funny cat','/home/someone','/bin/bash' ]
  ]);
});
// Now that setup is done, write data to the stream
parser.write("root:x:0:0:root:/root:/bin/bash\n");
parser.write("someone:x:1022:1022:a funny cat:/home/someone:/bin/bash\n");
// Close the readable stream
parser.end();
```

### Using the pipe function

One useful function part of the Stream API is `pipe` to interact between 
multiple streams. You may use this function to pipe a `stream.Readable` string 
source to a `stream.Writable` object destination. This example available as 
`node samples/pipe.js` read the file, parse its content and transform it.

```javascript
var fs = require('fs');
var parse = require('csv-parse');
var transform = require('stream-transform');

var output = [];
var parser = parse({delimiter: ':'})
var input = fs.createReadStream('/etc/passwd');
var transformer = transform(function(record, callback){
  setTimeout(function(){
    callback(null, record.join(' ')+'\n');
  }, 500);
}, {parallel: 10});
input.pipe(parser).pipe(transformer).pipe(process.stdout);
```

## Parser options

*   `delimiter`         Set the field delimiter. One character only, defaults to comma.   
*   `rowDelimiter`      String used to delimit record rows or a special value; special values are 'auto', 'unix', 'mac', 'windows', 'unicode'; defaults to 'auto' (discovered in source or 'unix' if no source is specified).   
*   `quote`             Optional character surrounding a field, one character only, defaults to double quotes.   
*   `escape`            Set the escape character, one character only, defaults to double quotes.   
*   `columns`           List of fields as an array, a user defined callback accepting the first line and returning the column names or true if autodiscovered in the first CSV line, default to null, affect the result data set in the sense that records will be objects instead of arrays.   
*   `comment`           Treat all the characteres after this one as a comment, default to '#'.   
*   `objname`           Name of header-record title to name objects by.   
*   `skip_empty_lines`  Dont generate empty values for empty lines.   
*   `trim`              If true, ignore whitespace immediately around the delimiter, defaults to false.   
*   `ltrim`             If true, ignore whitespace immediately following the delimiter (i.e. left-trim all fields), defaults to false.   
*   `rtrim`             If true, ignore whitespace immediately preceding the delimiter (i.e. right-trim all fields), defaults to false.   
*   `auto_parse`        If true, the parser will attempt to convert read data types to native types.   

## Migration

Most of the generator is imported from its parent project [CSV][csv] in a effort 
to split it between the generator, the parser, the transformer and the 
stringifier.

The "record" has disappeared, you are encouraged to use the "readable" event conjointly 
with the "read" function as documented above and in the [Stream API][stream_transform].

## Development

Tests are executed with mocha. To install it, simple run `npm install` 
followed by `npm test`. It will install mocha and its dependencies in your 
project "node_modules" directory and run the test suite. The tests run 
against the CoffeeScript source files.

To generate the JavaScript files, run `make build`.

The test suite is run online with [Travis][travis] against the versions 
0.10 and 0.11 of Node.js.

Contributors
------------

*   David Worms: <https://github.com/wdavidw>
*   Will White: <https://github.com/willwhite>
*   Justin Latimer: <https://github.com/justinlatimer>
*   jonseymour: <https://github.com/jonseymour>
*   pascalopitz: <https://github.com/pascalopitz>
*   Josh Pschorr: <https://github.com/jpschorr>
*   Elad Ben-Israel: <https://github.com/eladb>
*   Philippe Plantier: <https://github.com/phipla>
*   Tim Oxley: <https://github.com/timoxley>
*   Damon Oehlman: <https://github.com/DamonOehlman>
*   Alexandru Topliceanu: <https://github.com/topliceanu>
*   Visup: <https://github.com/visup>
*   Edmund von der Burg: <https://github.com/evdb>
*   Douglas Christopher Wilson: <https://github.com/dougwilson>
*   Chris Khoo: <https://github.com/khoomeister>
*   Joeasaurus: <https://github.com/Joeasaurus>
*   Mark Stosberg: <https://github.com/markstos>

[csv]: https://github.com/wdavidw/node-csv
[csv-samples]: https://github.com/wdavidw/node-csv-parse/tree/master/samples
[fs_read]: https://github.com/wdavidw/node-csv-parse/tree/master/samples/fs_read.js
[csv-test]: https://github.com/wdavidw/node-csv-parse/tree/master/test
[stream_transform]: http://nodejs.org/api/stream.html#stream_class_stream_transform
[travis]: https://travis-ci.org/#!/wdavidw/node-csv-parse

