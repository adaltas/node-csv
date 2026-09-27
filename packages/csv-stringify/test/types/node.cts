import { Transform } from "node:stream";
import { stringify, type Options } from "csv-stringify";
import { stringify as stringifySync } from "csv-stringify/sync";

const options: Options = { delimiter: Buffer.from(";") };
const stringifier: Transform = stringify(options);
const output: string = stringifySync([["first", 1]], options);
console.log(stringifier, output);
