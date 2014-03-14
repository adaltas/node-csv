[![Build Status](https://secure.travis-ci.org/wdavidw/node-csv-parse.png)](http://travis-ci.org/wdavidw/node-csv-parse)

This project is part of the [CSV module](https://github.com/wdavidw/node-csv) and parse input CSV text into 
arrays or objects. It is both extremely easy to use and powerfull. It was released since 2010 and is tested
agains very large dataset by a large community.

[The full documentation of the CSV parser is available here](http://www.adaltas.com/projects/node-csv/).

Note
----

This module is to be considered in alpha stage. It is part of an ongoing effort to split the current CSV module 
into complementary module with a cleaner design and the latest stream implementation. However, the
code has been important with very little changes and you should feel confident to use it in your code.

Usage
-----

Run `npm install csv` to install the full csv module or run `npm install csv-parse` if you are only interested 
by the CSV parser.

Use the callback style API for simplicity or the stream based API for scalability.

### Using the simple API

The parser recieve a string and return an array inside a user-provided callback. This example 
is available with the command `node samples/callback.js`.

```javascript
var parse = require('csv-parse');

input = '#Welcome\n"1","2","3","4"\n"a","b","c","d"';
parse(input, function(err, output){
  output.should.eql([ [ '1', '2', '3', '4' ], [ 'a', 'b', 'c', 'd' ] ]);
});
```

### Using the stream API
    
```javascript
// node samples/stream.js
var parse = require('csv-parse');

input = fs.createReadStream('/etc/passwd');
output = [];
parser = parse({delimiter: ':'})
parser.on 'readable', function(){
  while(row = parser.read()){
    output.push(row)
  }
};
parser.on 'error', function(err){
  consol.log(err.message);
};
parser.on 'finish', function(){
  output.should.eql([
    [ 'root','x','0','0','root','/root','/bin/bash' ]
    [ 'someone','x','1022','1022','a funny cat','/home/someone','/bin/bash' ]
  ]);
};
parser.write("root:x:0:0:root:/root:/bin/bash");
parser.write("someone:x:1022:1022:a funny cat:/home/someone:/bin/bash");
parser.end()
```

### Using the pipe function

One usefull function part of the Stream API is `pipe` you interact with string and object. You
may use this function to pipe a `stream.Readable` string source to a `stream.Writable` object 
destination. The next example available as `node samples/piple.js` read the file, parse its content and
transform it.

```javascript
output = [];
parser = parse({delimiter: ':'})
input = fs.createReadStream('/etc/passwd')
mutator = mutate({parallel: 100})
mutator.transform(function(row, callback){
  exec('du -hs '+row[5], function(err, stdout, stderr){
    if(!err){
      callback(null, [row[0], stdout]);
    }else{
      callback();
    }
  });
});
input.pipe(parser).pipe(mutator).pipe(process.stdout);
```

Migration
---------

Most of the parser is imported from its parent project [CSV](https://github.com/wdavidw/node-csv) in a effort to split it
between the parser, the stringifier and the transformer.

Development
-----------

Tests are executed with mocha. To install it, simple run `npm install`, it will install
mocha and its dependencies in your project "node_modules" directory.

To run the tests:
```bash
npm test
```

The tests run against the CoffeeScript source files.

To generate the JavaScript files:
```bash
make build
npm test
```

The test suite is run online with [Travis][travis] against Node.js version 0.9, 0.10 and 0.11.

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

Related projects
----------------

*   Pavel Kolesnikov "ya-csv": <http://github.com/koles/ya-csv>
*   Chris Williams "node-csv": <http://github.com/voodootikigod/node-csv>

[travis]: https://travis-ci.org/#!/wdavidw/node-csv-parse

