import "should";
import dedent from "dedent";
import { parse } from "../lib/index.js";

describe("Option `raw`", function () {
  it("validation", function () {
    parse("", { raw: undefined }, () => {});
    parse("", { raw: null }, () => {});
    parse("", { raw: false }, () => {});
  });

  it("includes escape chars", function (next) {
    const str = dedent`
    "hello""world",LOL
    `;
    parse(str, { raw: true, escape: '"' }, (err, records) => {
      if (err) return next(err);
      const record = records[0] as unknown as { record: string[]; raw: string };
      record.raw.should.eql(str);
      record.record.should.eql(['hello"world', "LOL"]);
      next();
    });
  });

  it("includes line breaks", function (next) {
    parse(
      dedent`
      hello
      my
      friend
    `,
      { raw: true, escape: '"' },
      (err, records) => {
        if (err) return next(err);
        const record = records[1] as unknown as {
          record: string[];
          raw: string;
        };
        record.raw.should.match(/\n$/);
        next();
      },
    );
  });

  it("has the inner line breaks", function (next) {
    const str = dedent`
    foo,"b
    a
    r"
    `;
    parse(str, { raw: true, escape: '"' }, (err, records) => {
      if (err) return next(err);
      const record = records[0] as unknown as { record: string[]; raw: string };
      record.raw.should.eql(str);
      next();
    });
  });

  it("preserves windows (CRLF) record delimiters", function (next) {
    // The `\n` of a `\r\n` record delimiter used to be dropped from `raw`,
    // yielding `a,b\r` instead of `a,b\r\n`. (#332)
    parse("a,b\r\nc,d\r\n", { raw: true }, (err, records) => {
      if (err) return next(err);
      const raws = (
        records as unknown as { record: string[]; raw: string }[]
      ).map((r) => r.raw);
      raws.should.eql(["a,b\r\n", "c,d\r\n"]);
      next();
    });
  });

  it("preserve columns", function (next) {
    parse(
      dedent`
        name,last name
        Boudreau,Jonathan
      `,
      { raw: true, columns: ["FIELD_1", false] },
      (err, records) => {
        if (err) return next(err);
        const record = records[0] as unknown as {
          record: string[];
          raw: string;
        };
        record.raw.should.eql("name,last name\n");
        record.record.should.eql({ FIELD_1: "name" });
        next();
      },
    );
  });
});
