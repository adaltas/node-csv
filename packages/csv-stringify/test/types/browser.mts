import {
  stringify,
  Stringifier,
  CsvError,
  type Options,
  type OptionsNormalized,
} from "csv-stringify/browser/esm";
import { stringify as stringifySync } from "csv-stringify/browser/esm/sync";

const timeout: number = setTimeout(() => {}, 1000);
clearTimeout(timeout);

const options: Options = {
  header: true,
  columns: ["name", "value"] as const,
  quoted_match: [/\s/],
  cast: { number: (value, context) => `${value + context.index}` },
  highWaterMark: 32,
};
const stream: Stringifier = stringify(
  [["first", 1]],
  options,
  (err, output) => {
    if (err) throw err;
    const csv: string = output;
    console.log(csv);
  },
);
const normalized: OptionsNormalized = stream.options;
const csv: string = stringifySync([["first", 1]], options);
const ready: boolean = stream.write(["second", 2]);
stream.on("readable", function (this: Stringifier) {
  this.read();
});
stream.pause();
stream.resume();
stream.cork();
stream.uncork();
stream.end();
new Stringifier(options);
new CsvError("CSV_INVALID_ARGUMENT", "invalid", normalized);
console.log(csv, ready);

// @ts-expect-error Browser imports must not introduce the Node process global.
console.log(process.env);
// @ts-expect-error Browser imports must not introduce the Node Buffer global.
Buffer.from("value");
// @ts-expect-error CSV options accept Buffer values, not arbitrary typed arrays.
const invalid: Options = { delimiter: new Uint8Array([44]) };
console.log(invalid);
