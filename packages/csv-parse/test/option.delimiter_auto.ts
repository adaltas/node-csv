import should from "should";
import { parse, normalize_options } from "../lib/index.js";
import { parse as parse_sync } from "../lib/sync.js";

describe("Option `delimiter_auto`", function () {
  it("validation", function () {
    parse("", { delimiter_auto: true }, () => {});
    parse("", { delimiter_auto: false }, () => {});
  });

  it("default to false", function () {
    const options = normalize_options({});
    options.delimiter_auto.should.eql(false);
    options.delimiter.should.eql([Buffer.from(",")]);
  });

  it("set delimiter to empty array when true", function () {
    const options = normalize_options({ delimiter_auto: true });
    options.delimiter_auto.should.match({
      preferred: (it: object) => it.should.be.an.Object(),
      score: (it: () => void) => it.should.be.a.Function(),
    });
    should(options.delimiter).eql([]);
  });

  it("sync empty", function () {
    parse_sync("", {
      delimiter_auto: true,
    }).should.eql([]);
  });

  it("sync small", function () {
    parse_sync("a.b,c.d\ne,f.g.h", {
      delimiter_auto: true,
    }).should.eql([
      ["a", "b,c", "d"],
      ["e,f", "g", "h"],
    ]);
  });

  it("sync preserves Unicode field content", function () {
    parse_sync("é,東京,😀\nß,北京,🚀", {
      delimiter_auto: true,
    }).should.eql([
      ["é", "東京", "😀"],
      ["ß", "北京", "🚀"],
    ]);
  });

  it("stream discovers with split UTF-8 field characters", function (next) {
    const expected = [
      ["姓名", "城市"],
      ["张三", "北京"],
      ["李四", "上海"],
    ];
    const input = Buffer.from(
      expected.map((record) => record.join(",")).join("\n"),
    );
    const parser = parse({ delimiter_auto: { size: 9 } }, (err, records) => {
      if (err) return next(err);
      records.should.eql(expected);
      next();
    });
    for (let i = 0; i < input.length; i++) {
      parser.write(input.subarray(i, i + 1));
    }
    parser.end();
  });

  it("custom score receives only ASCII candidates with Unicode fields", function () {
    const char_codes: number[] = [];
    parse_sync("é:甲;β\nø:乙;γ", {
      delimiter_auto: {
        score: (info) => {
          char_codes.push(info.char_code);
          return info.char_code === ":".charCodeAt(0) ? 1 : 0;
        },
      },
    }).should.eql([
      ["é", "甲;β"],
      ["ø", "乙;γ"],
    ]);
    char_codes.length.should.eql(127);
    char_codes.every((code) => code < 127).should.eql(true);
  });

  it("sync custom score", function () {
    // The default score elects `;` because it is more preferred than `:`
    parse_sync("a:b;c\nd:e;f", {
      delimiter_auto: true,
    }).should.eql([
      ["a:b", "c"],
      ["d:e", "f"],
    ]);
    // A custom score receives the candidate info and the normalized options
    const char_codes: number[] = [];
    parse_sync("a:b;c\nd:e;f", {
      delimiter_auto: {
        score: (info, options) => {
          char_codes.push(info.char_code);
          return info.char_code === ":".charCodeAt(0)
            ? 100
            : (info.total - info.std) *
                (options.preferred[info.char_code] || 1);
        },
      },
    }).should.eql([
      ["a", "b;c"],
      ["d", "e;f"],
    ]);
    char_codes.length.should.eql(127);
  });

  it("stream smaller than size", function (next) {
    let content = "";
    for (let i = 0; i < 10; i++) {
      content += i + ":abc:def:hij:klm:nop:qrs:tuv:wxyz" + "\n";
    }
    // Size is greater than the max discovery size
    const options = normalize_options({ delimiter_auto: true });
    content.length.should.be.lessThan(options.delimiter_auto.size);
    // Data parsing
    const parser = parse({ delimiter_auto: true }, (err, data) => {
      if (err) return next(err);
      data
        .map((r) => r.join(":"))
        .join("\n")
        .should.eql(content.trim());
      next();
    });
    // Data writing
    for (let i = 0; i < content.length; i++) {
      parser.write(content.slice(i, i + 1));
    }
    parser.end();
  });

  it("stream greater than size small version", function (next) {
    let content = "";
    for (let i = 0; i < 3; i++) {
      content += i + ":abc:def:hij" + "\n";
    }
    // Size is greater than the max discovery size
    const options = normalize_options({ delimiter_auto: { size: 20 } });
    content.length.should.be.greaterThan(options.delimiter_auto.size);
    // Data parsing
    const parser = parse({ delimiter_auto: { size: 20 } }, (err, data) => {
      if (err) return next(err);
      data
        .map((r) => r.join(":"))
        .join("\n")
        .should.eql(content.trim());
      next();
    });
    // Data writing
    for (let i = 0; i < content.length; i++) {
      parser.write(content.slice(i, i + 1));
    }
    parser.end();
  });

  it("stream greater than size large version", function (next) {
    let content = "";
    for (let i = 0; i < 100; i++) {
      content += i + ":abc:def:hij:klm:nop:qrs:tuv:wxyz" + "\n";
    }
    // Size is greater than the max discovery size
    const options = normalize_options({ delimiter_auto: true });
    content.length.should.be.greaterThan(options.delimiter_auto.size);
    // Data parsing
    const parser = parse({ delimiter_auto: true }, (err, data) => {
      if (err) return next(err);
      data
        .map((r) => r.join(":"))
        .join("\n")
        .should.eql(content.trim());
      next();
    });
    // Data writing
    for (let i = 0; i < content.length; i++) {
      parser.write(content.slice(i, i + 1));
    }
    parser.end();
  });
});
