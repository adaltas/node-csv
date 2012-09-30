<pre>
     _   _           _        _____  _______      __
    | \ | |         | |      / ____|/ ____\ \    / /
    |  \| | ___   __| | ___ | |    | (___  \ \  / / 
    | . ` |/ _ \ / _` |/ _ \| |     \___ \  \ \/ /  
    | |\  | (_) | (_| |  __/| |____ ____) |  \  /   
    |_| \_|\___/ \__,_|\___| \_____|_____/    \/     New BSD License

</pre>


Important
---------

This readme cover the current unreleased version of the node 
csv parser. Its documentation is not yet published but will be generated 
from the source code and is almost complete.

The documentation for the current version 0.1.0 is 
available [here](https://github.com/wdavidw/node-csv-parser/tree/v0.1).

Migration
---------

The functions 'from*' and 'to*' are now rewritten as 'from.*' and 'to.*'. The 'data'
event is now the 'record' event. The 'data' now recieved a stringified version of 
the 'record' event.

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
```

Contributors
------------

*	  David Worms : <https://github.com/wdavidw>
*	  Will White : <https://github.com/willwhite>
*	  Justin Latimer : <https://github.com/justinlatimer>
*	  jonseymour : <https://github.com/jonseymour>
*	  pascalopitz : <https://github.com/pascalopitz>
*	  Josh Pschorr : <https://github.com/jpschorr>
*   Elad Ben-Israel: <https://github.com/eladb>
*   Philippe Plantier: <https://github.com/phipla>
*   Tim Oxley: <https://github.com/timoxley>
*   Damon Oehlman: <https://github.com/DamonOehlman>
*   Alexandru Topliceanu: <https://github.com/topliceanu>
*   Visup: <https://github.com/visup>
*   Edmund von der Burg: <https://github.com/evdb>

Related projects
----------------

*   Pavel Kolesnikov "ya-csv": <http://github.com/koles/ya-csv>
*   Chris Williams "node-csv": <http://github.com/voodootikigod/node-csv>

