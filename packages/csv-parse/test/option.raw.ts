import "should";
import dedent from "dedent";
import { parse, type Options } from "../lib/index.js";
import { parse as parseSync } from "../lib/sync.js";

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

  it("preserves a multi-character delimiter", function (next) {
    parse("a|@|b|@|c\n", { raw: true, delimiter: "|@|" }, (err, records) => {
      if (err) return next(err);
      const record = records[0] as unknown as { record: string[]; raw: string };
      record.raw.should.eql("a|@|b|@|c\n");
      record.record.should.eql(["a", "b", "c"]);
      next();
    });
  });

  for (const [name, input, options, expected] of [
    [
      "record delimiters",
      "a,b||c,d||",
      { record_delimiter: "||" },
      ["a,b||", "c,d||"],
    ],
    ["CRLF records", "a,b\r\nc,d\r\n", {}, ["a,b\r\n", "c,d\r\n"]],
    ["quotes", "%%a%%,b\n", { quote: "%%" }, ["%%a%%,b\n"]],
    [
      "escaped quotes",
      "%%a%%%%b%%,c\n",
      { quote: "%%", escape: "%%" },
      ["%%a%%%%b%%,c\n"],
    ],
    [
      "escapes",
      "%%a!!b%%,c\n",
      { quote: "%%", escape: "!!" },
      ["%%a!!b%%,c\n"],
    ],
    [
      "relaxed quotes",
      "%%a%%b,c\n",
      { quote: "%%", relax_quotes: true },
      ["%%a%%b,c\n"],
    ],
    ["UTF-8 quotes", "«a«,b\n", { quote: "«" }, ["«a«,b\n"]],
  ] satisfies [string, string, Options, string[]][]) {
    it(`preserves all bytes of multi-byte ${name}`, function (next) {
      const records = parseSync(input, {
        ...options,
        raw: true,
      }) as unknown as {
        record: string[];
        raw: string;
      }[];
      records.map((record) => record.raw).should.eql(expected);
      records
        .map((record) => record.record)
        .should.eql(parseSync(input, options));
      const parser = parse({ ...options, raw: true }, (err, streamed) => {
        if (err) return next(err);
        streamed.should.eql(records);
        next();
      });
      for (const byte of Buffer.from(input)) parser.write(Buffer.from([byte]));
      parser.end();
    });
  }
});
