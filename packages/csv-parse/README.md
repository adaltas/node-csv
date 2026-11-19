# CSV parser for Node.js and the web

[![Build Status](https://img.shields.io/github/actions/workflow/status/adaltas/node-csv/nodejs.yml?branch=master)](https://github.com/adaltas/node-csv/actions)
[![NPM](https://img.shields.io/npm/dm/csv-parse)](https://www.npmjs.com/package/csv-parse)
[![NPM](https://img.shields.io/npm/v/csv-parse)](https://www.npmjs.com/package/csv-parse)

The [`csv-parse` package](https://csv.js.org/parse/) is a parser converting CSV text input into arrays or objects. It is part of the [CSV project](https://csv.js.org/).

It implements the Node.js [`stream.Transform` API](http://nodejs.org/api/stream.html#stream_class_stream_transform). It also provides a simple callback-based API for convenience. It is both extremely easy to use and powerful. It was first released in 2010 and is used against big data sets by a large community.

## Documentation

- [Project homepage](https://csv.js.org/parse/)
- [API](https://csv.js.org/parse/api/)
- [Options](https://csv.js.org/parse/options/)
- [Info properties](https://csv.js.org/parse/info/)
- [Common errors](https://csv.js.org/parse/errors/)
- [Examples](https://csv.js.org/project/examples/)

## Main features

- Flexible with lot of [options](https://csv.js.org/parse/options/)
- Multiple [distributions](https://csv.js.org/parse/distributions/): Node.js, Web, ECMAScript modules and CommonJS
- Follow the Node.js streaming API
- Simplicity with the optional callback API
- Support delimiters, quotes, escape characters and comments
- Line breaks discovery
- Support big datasets
- Complete test coverage and lot of samples for inspiration
- No external dependencies
- Work nicely with the [csv-generate](https://csv.js.org/generate/), [stream-transform](https://csv.js.org/transform/) and [csv-stringify](https://csv.js.org/stringify/) packages
- MIT License

## Usage

Run `npm install csv` to install the full CSV module or run `npm install csv-parse` if you are only interested by the CSV parser.

Use the callback and sync APIs for simplicity, or the stream and async iterator APIs for incremental processing.

### Async iterator API

The `csv-parse/iterator` entrypoint parses an asynchronous iterable of string or
`Uint8Array` chunks, including Node.js Buffers, without a stream wrapper:

```js
import { parse } from "csv-parse/iterator";

async function* chunks() {
  yield "name,age\nAlice,";
  yield new TextEncoder().encode("20\nBob,30");
}

for await (const record of parse(chunks(), { columns: true, cast: true })) {
  console.log(record);
}
```

All records from a chunk are yielded before the next chunk is requested. The
final record does not need a trailing newline. Parsing and input errors are
thrown during iteration. Once iteration has started, breaking from the loop,
calling the generator's `return()`, or reaching a `to`/`to_line` limit closes the
input iterator.
Strings are encoded as UTF-8; use byte chunks with the `encoding` option for
other encodings. The existing parser options and streaming record shapes apply.

CommonJS consumers can use `require("csv-parse/iterator")`. For browsers, use
`csv-parse/browser/esm/iterator`; this distribution includes the required byte
buffer support and does not depend on Node.js streams. Parsing still processes
each input chunk synchronously, so callers should supply suitably sized chunks.

## Example

The [API](https://csv.js.org/parse/api/) is available in multiple flavors. This example illustrates the stream API.

```js
import assert from "assert";
import { parse } from "csv-parse";

const records = [];
// Initialize the parser
const parser = parse({
  delimiter: ":",
});
// Use the readable stream api to consume records
parser.on("readable", function () {
  let record;
  while ((record = parser.read()) !== null) {
    records.push(record);
  }
});
// Catch any error
parser.on("error", function (err) {
  console.error(err.message);
});
// Test that the parsed records matched the expected records
parser.on("end", function () {
  assert.deepStrictEqual(records, [
    ["root", "x", "0", "0", "root", "/root", "/bin/bash"],
    ["someone", "x", "1022", "1022", "", "/home/someone", "/bin/bash"],
  ]);
});
// Write data to the stream
parser.write("root:x:0:0:root:/root:/bin/bash\n");
parser.write("someone:x:1022:1022::/home/someone:/bin/bash\n");
// Close the readable stream
parser.end();
```

## Contributors

The project is sponsored by [Adaltas](https://www.adaltas.com), an Big Data consulting firm based in Paris, France.

- David Worms: <https://github.com/wdavidw>
