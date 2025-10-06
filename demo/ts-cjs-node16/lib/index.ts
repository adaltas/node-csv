import assert from "assert";
import { generate, Generator } from "csv-generate";
import { parse, Parser } from "csv-parse";
import { transform, Transformer } from "stream-transform";
import { stringify, Stringifier } from "csv-stringify";

const chunks: string[] = [];

// Create the parser
const generator: Generator = generate({ length: 2, seed: true });
const parser: Parser = parse();
const transformer: Transformer = transform((record) => record);
const stringifier: Stringifier = stringify();
generator
  .pipe(parser)
  .pipe(transformer)
  .pipe(stringifier)
  .on("data", function (data) {
    chunks.push(data.toString());
  })
  .on("end", () => {
    assert.strictEqual(
      chunks.join(""),
      [
        "OMH,ONKCHhJmjadoA,D,GeACHiN,nnmiN,CGfDKB,NIl,JnnmjadnmiNL",
        "KB,dmiM,fENL,Jn,opEMIkdmiOMFckep,MIj,bgIjadnn,fENLEOMIkbhLDK",
        "",
      ].join("\n"),
    );
  });
