
// Alias to the ES6 modules exposing the stream and callback APIs

import * as generate from "csv-generate/lib/index";
import * as parse from "csv-parse/lib/index";
import * as transform from "stream-transform/lib/index";
import * as stringify from "csv-stringify/lib/index";

export csv;

interface csv {
  generate: generate,
  parse: parse,
  transform: transform,
  stringify: stringify,
}
