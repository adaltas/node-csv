
<pre>
     _   _           _        _____  _______      __
    | \ | |         | |      / ____|/ ____\ \    / /
    |  \| | ___   __| | ___ | |    | (___  \ \  / /
    | . ` |/ _ \ / _` |/ _ \| |     \___ \  \ \/ /
    | |\  | (_) | (_| |  __/| |____ ____) |  \  /
    |_| \_|\___/ \__,_|\___| \_____|_____/    \/     MIT License

</pre>

This project provides CSV generation, parsing, transformation and serialization for Node.js.

It has been tested and used by a large community over the years and should be considered reliable. It provides every option you would expect from an advanced CSV parser and stringifier.

## Project structure

This repository is a monorepo managed using [Lerna](https://github.com/lerna/lerna). There are 5 packages managed in this codebase, even though we publish them to NPM as separate packages:

*   [`csv`](packages/csv/),
    an umbrella which is itself split into 4 packages.
*   [`csv-generate`](packages/csv-generate/),
    a flexible generator of CSV string and Javascript objects.
*   [`csv-parse`](packages/csv-parse/),
    a parser converting CSV text into arrays or objects.
*   [`csv-stringify`](packages/csv-stringify/),
    a stringifier converting records into a CSV text.
*   [`stream-transform`](packages/stream-transform/),
    a transformation framework.

## Documentation

The full documentation for the current version is available [here](https://csv.js.org).

## License

Licensed under the [MIT License](LICENSE).
