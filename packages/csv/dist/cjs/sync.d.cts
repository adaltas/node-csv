// Alias to the modules exposing the sync APIs

import { generate } from "csv-generate/sync";
import { parse } from "csv-parse/sync";
import { transform } from "stream-transform/sync";
import { stringify } from "csv-stringify/sync";

export { generate, parse, transform, stringify };

export * as generator from "csv-generate/sync";
export * as parser from "csv-parse/sync";
export * as transformer from "stream-transform/sync";
export * as stringifier from "csv-stringify/sync";
