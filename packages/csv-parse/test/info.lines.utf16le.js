import "should";
import { parse } from "../lib/index.js";
import { parse as parseSync } from "../lib/sync.js";

describe("UTF-16LE line counting", function () {
  const values = ["\u010a", "\u010d", "\u0a0a", "\u0d0d"];

  it("does not count CR or LF bytes inside other code units", function () {
    for (const value of values) {
      for (const record_delimiter of ["\n", "\r", "\r\n"]) {
        const records = parseSync(
          Buffer.from(
            `a,b${record_delimiter}${value},c${record_delimiter}d,e`,
            "utf16le",
          ),
          { encoding: "utf16le", info: true, record_delimiter },
        );
        records.map(({ info }) => info.lines).should.eql([1, 2, 3]);
        records
          .map(({ record }) => record)
          .should.eql([
            ["a", "b"],
            [value, "c"],
            ["d", "e"],
          ]);
      }
    }
  });

  it("supports encoding aliases", function () {
    for (const encoding of ["ucs2", "ucs-2", "utf-16le", "UTF-16LE"]) {
      const records = parseSync(Buffer.from("a,b\n\u010a,c", encoding), {
        encoding,
        info: true,
        record_delimiter: "\n",
      });
      records.map(({ info }) => info.lines).should.eql([1, 2]);
    }
  });

  it("does not count an unaligned CR or LF byte pair as a newline", function () {
    for (const value of ["\u0a01\u0100", "\u0d01\u0100"]) {
      const records = parseSync(Buffer.from(`a,b|${value},c|d,e`, "utf16le"), {
        encoding: "utf16le",
        record_delimiter: "|",
        info: true,
      });
      records.map(({ info }) => info.lines).should.eql([1, 1, 1]);
      records[1].record.should.eql([value, "c"]);
    }
  });

  it("does not stop to_line inside an ordinary character", function () {
    for (const value of values) {
      parseSync(Buffer.from(`a,b\n${value},c\nd,e`, "utf16le"), {
        encoding: "utf16le",
        record_delimiter: "\n",
        to_line: 2,
      }).should.eql([
        ["a", "b"],
        [value, "c"],
      ]);
    }
  });

  it("starts from_line at the physical line requested", function () {
    for (const value of values) {
      parseSync(Buffer.from(`${value},a\nb,c\nd,e`, "utf16le"), {
        encoding: "utf16le",
        record_delimiter: "\n",
        from_line: 3,
      }).should.eql([["d", "e"]]);
    }
  });

  it("counts genuine newlines inside quoted fields", function () {
    for (const value of values) {
      const records = parseSync(
        Buffer.from(`a,b\n"${value}\nc",d`, "utf16le"),
        {
          encoding: "utf16le",
          record_delimiter: "\n",
          info: true,
        },
      );
      records.map(({ info }) => info.lines).should.eql([1, 3]);
      records[1].record.should.eql([`${value}\nc`, "d"]);
    }
  });

  it("counts comment lines without counting their character bytes", function () {
    for (const value of values) {
      const records = parseSync(Buffer.from(`#${value}\na,b\nc,d`, "utf16le"), {
        encoding: "utf16le",
        record_delimiter: "\n",
        comment: "#",
        info: true,
      });
      records.map(({ info }) => info.lines).should.eql([2, 3]);
      records[1].info.comment_lines.should.eql(1);
    }
  });

  it("reports physical line numbers on errors", function () {
    for (const value of values) {
      (() => {
        parseSync(Buffer.from(`a,b\n${value},"c`, "utf16le"), {
          encoding: "utf16le",
          record_delimiter: "\n",
        });
      }).should.throw({ code: "CSV_QUOTE_NOT_CLOSED", lines: 2 });
    }
  });

  it("keeps code unit alignment across one-byte writes and BOM detection", async function () {
    for (const bom of [false, true]) {
      for (const value of values) {
        const records = await new Promise((resolve, reject) => {
          const parser = parse(
            {
              ...(bom ? { bom: true } : { encoding: "utf16le" }),
              record_delimiter: "\n",
              info: true,
            },
            (err, records) => (err ? reject(err) : resolve(records)),
          );
          for (const byte of Buffer.from(
            `${bom ? "\ufeff" : ""}a,b\n${value},c\nd,e`,
            "utf16le",
          )) {
            parser.write(Buffer.from([byte]));
          }
          parser.end();
        });
        records.map(({ info }) => info.lines).should.eql([1, 2, 3]);
        records
          .map(({ record }) => record)
          .should.eql([
            ["a", "b"],
            [value, "c"],
            ["d", "e"],
          ]);
      }
    }
  });
});
