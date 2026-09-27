import { Transform, Writable } from "node:stream";
import { stringify, type Options } from "csv-stringify";
import { stringify as stringifySync } from "csv-stringify/sync";
import {
  stringify as stringifyBrowser,
  type Options as BrowserOptions,
} from "csv-stringify/browser/esm";

const options: Options = { delimiter: Buffer.from(";") };
const nodeStream: Transform = stringify(options);
const csv: string = stringifySync([["first", 1]], options);
const browserOptions: BrowserOptions = { delimiter: Buffer.from(";") };
const browserStream = stringifyBrowser(browserOptions);
const destination = new Writable();
const piped: Writable = browserStream.pipe(destination);
console.log(nodeStream, csv, piped);
