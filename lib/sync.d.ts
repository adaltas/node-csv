
// Alias to the ES6 modules exposing the stream and callback APIs

// import * as generate from "csv-generate/lib/sync"; // not yet created
import * as parse from "csv-parse/lib/sync";
import * as transform from "stream-transform/lib/sync";
// import * as stringify from "csv-stringify/lib/indsyncex"; // not yet created

export csv;

interface csv {
  generate: generate,
  parse: parse,
  transform: transform,
  stringify: stringify,
}
