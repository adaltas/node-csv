import "should";
import {
  stringify,
  RecordDelimiter,
  Cast,
  PlainObject,
  Input,
  ColumnOption,
  CastingContext,
  Options,
} from "../lib/sync.js";

describe("API Types", function () {
  it("stringify return string", function () {
    const input: Input = [[1, 2, 3]];
    const stringifier: string = stringify(input);
    stringifier;
  });

  it("Options", function () {
    (options: Options) => {
      const rd: RecordDelimiter | undefined = options.record_delimiter;
      const cast = options.cast;
      const castBoolean: Cast<boolean> | undefined = cast?.boolean;
      const columns:
        | ReadonlyArray<string | ColumnOption>
        | PlainObject<string>
        | undefined = options.columns;
      return [rd, castBoolean, columns];
    };
  });

  it("CastingContext", function () {
    const options: Options = {
      cast: {
        boolean: (value: boolean, context: CastingContext) => {
          return `${value} ${context.index}`;
        },
      },
    };
    return options;
  });

  it("allows cast to return an object", function () {
    const options: Options = {
      cast: {
        boolean: (value: boolean) => ({
          value: value.toString(),
          delimiter: ";",
          quote: false,
        }),
      },
    };
    options;
  });
});
