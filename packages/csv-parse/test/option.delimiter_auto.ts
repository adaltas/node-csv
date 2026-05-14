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
      // process.stdout.write(content.slice(i, i + 1));
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
