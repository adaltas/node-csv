import should from "should";
import dedent from "dedent";
import { parse, Info } from "../lib/index.js";

describe("Option `info`", function () {
  describe("true", function () {
    it("return info and records", function (next) {
      parse(
        dedent`
          a,b,c
          d,e,f
          g,h,i
        `,
        { info: true },
        (err, records) => {
          // @todo: improve type definition, setting option.info as true shall
          // be reflected in the return records array.
          (records as unknown as { record: string[]; info: Info }[]).map(
            ({ record, info }) => {
              should(record).be.an.Array();
              should(info).be.an.Object();
            },
          );
          next(err);
        },
      );
    });

    it("info properties", function (next) {
      parse(`a,b,c`, { info: true }, (err, records) => {
        const { info } = records[0] as unknown as {
          record: string[];
          info: Info;
        };
        Object.keys(info)
          .sort()
          .should.eql([
            "bytes",
            "bytes_records",
            "columns",
            "comment_lines",
            "empty_lines",
            "error",
            "header",
            "index",
            "invalid_field_length",
            "lines",
            "raw",
            "records",
          ]);
        next(err);
      });
    });

    it("validate the `lines` and `bytes` properties", function (next) {
      parse(
        dedent`
          a,b,c
          d,e,f
          g,h,i
        `,
        { info: true },
        (err, records) => {
          if (err) return next(err);
          (records as unknown as { record: string[]; info: Info }[])
            .map(({ info }) => [info.lines, info.bytes])
            .should.eql([
              [1, 6],
              [2, 12],
              [3, 17],
            ]);
          next();
        },
      );
    });

    it("with skip_empty_lines", function (next) {
      parse(
        "\n" +
          dedent`
          a,b,c

          d,e,f

          g,h,i
        `,
        { info: true, skip_empty_lines: true },
        (err, records) => {
          if (err) next(err);
          (records as unknown as { record: string[]; info: Info }[])
            .map(({ info }) => [info.lines, info.bytes])
            .should.eql([
              [2, 7],
              [4, 14],
              [6, 20],
            ]);
          next();
        },
      );
    });

    it("with comment", function (next) {
      parse(
        dedent`
          # line 1
          a,b,c
          # line 2
          d,e,f
          # line 3
          g,h,i
        `,
        { info: true, comment: "#" },
        (err, records) => {
          if (err) next(err);
          (records as unknown as { record: string[]; info: Info }[])
            .map(({ info }) => [info.lines, info.bytes])
            .should.eql([
              [2, 15],
              [4, 30],
              [6, 44],
            ]);
          next();
        },
      );
    });

    it("with multiline records", function (next) {
      parse(
        dedent`
          a,b,c
          d,"e
          ",f
          g,h,i
        `,
        { info: true },
        (err, records) => {
          if (err) return next(err);
          (records as unknown as { record: string[]; info: Info }[])
            .map(({ info }) => [info.lines, info.bytes])
            .should.eql([
              [1, 6],
              [3, 15],
              [4, 20],
            ]);
          next();
        },
      );
    });
  });
});
